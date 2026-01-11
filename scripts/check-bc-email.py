#!/usr/bin/env python3
"""
Gmail API Email Checker for bc@crowestudio.com

This script checks the Gmail inbox for bc@crowestudio.com to verify email delivery
for end-to-end testing of the APR Dashboard email workflows.

Usage:
    python3 scripts/check-bc-email.py --search "subject:Letter of Engagement" --max-results 5
    python3 scripts/check-bc-email.py --email-id "GMAIL_MESSAGE_ID" --show-body
    python3 scripts/check-bc-email.py --latest --show-body
    python3 scripts/check-bc-email.py --wait-for "subject:Letter of Engagement" --timeout 60

Prerequisites:
    - OAuth credentials set up (run setup-bc-email-auth.sh first)
    - Google API Python client library: pip3 install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
"""

import os
import sys
import json
import argparse
import time
from datetime import datetime
from pathlib import Path

try:
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError as e:
    print("❌ Missing required Python packages.")
    print("   Install with: pip3 install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib")
    sys.exit(1)

# Gmail API scopes
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

# Credentials directory
CREDENTIALS_DIR = Path(__file__).parent.parent / 'credentials' / 'bc-crowestudio'
CREDENTIALS_FILE = CREDENTIALS_DIR / 'credentials.json'
TOKEN_FILE = CREDENTIALS_DIR / 'token.json'

# Email account
EMAIL_ACCOUNT = 'bc@crowestudio.com'


def get_credentials():
    """Get valid user credentials from storage or OAuth flow."""
    creds = None
    
    # Try 1: Use existing token file (project-specific)
    if TOKEN_FILE.exists():
        try:
            creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
            if creds and creds.valid:
                return creds
        except Exception as e:
            print(f"⚠️  Error loading token file: {e}")
    
    # Try 2: Use Application Default Credentials (gcloud setup)
    # Note: ADC may not have Gmail scopes, so we'll try but fall back if needed
    ADC_FILE = Path.home() / '.config' / 'gcloud' / 'application_default_credentials.json'
    if ADC_FILE.exists():
        try:
            print("🔍 Found Application Default Credentials, attempting to use...")
            with open(ADC_FILE, 'r') as f:
                adc_data = json.load(f)
            
            # Check if it's the right format and has refresh token
            if adc_data.get('type') == 'authorized_user' and adc_data.get('refresh_token'):
                # Create credentials from ADC
                creds = Credentials(
                    token=None,
                    refresh_token=adc_data['refresh_token'],
                    token_uri='https://oauth2.googleapis.com/token',
                    client_id=adc_data['client_id'],
                    client_secret=adc_data['client_secret'],
                    scopes=SCOPES
                )
                
                # Try to refresh - this may fail if scopes don't match
                try:
                    print("🔄 Refreshing token from Application Default Credentials...")
                    creds.refresh(Request())
                    
                    # Save to project-specific token file for future use
                    TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
                    with open(TOKEN_FILE, 'w') as token:
                        token.write(creds.to_json())
                    print(f"✅ Using Application Default Credentials")
                    print(f"✅ Token saved to {TOKEN_FILE}")
                    return creds
                except Exception as refresh_error:
                    # Refresh failed - likely scope mismatch
                    print(f"⚠️  ADC token doesn't have Gmail scopes: {refresh_error}")
                    print("   Will need to re-authenticate with Gmail API scopes")
                    # Fall through to OAuth flow
        except Exception as e:
            print(f"⚠️  Error using Application Default Credentials: {e}")
    
    # Try 3: Refresh existing token if expired
    if creds and creds.expired and creds.refresh_token:
        print("🔄 Refreshing expired token...")
        try:
            creds.refresh(Request())
            # Save refreshed token
            TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
            with open(TOKEN_FILE, 'w') as token:
                token.write(creds.to_json())
            return creds
        except Exception as e:
            print(f"⚠️  Error refreshing token: {e}")
    
    # Try 4: Use project-specific credentials.json and OAuth flow
    if CREDENTIALS_FILE.exists():
        print(f"🔐 Starting OAuth flow for {EMAIL_ACCOUNT}...")
        flow = InstalledAppFlow.from_client_secrets_file(
            str(CREDENTIALS_FILE), SCOPES)
        creds = flow.run_local_server(port=0)
        
        # Save credentials for next run
        TOKEN_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
        print(f"✅ Credentials saved to {TOKEN_FILE}")
        return creds
    
    # No credentials found
    print(f"❌ No valid credentials found")
    print("")
    print("Options:")
    print("1. Use existing Application Default Credentials (recommended):")
    print("   - Found at: ~/.config/gcloud/application_default_credentials.json")
    print("   - The script will use these automatically")
    print("")
    print("2. Set up project-specific credentials:")
    print("   bash scripts/setup-bc-email-auth.sh")
    sys.exit(1)


def get_message_body(service, message_id):
    """Get the full body of an email message."""
    try:
        message = service.users().messages().get(
            userId='me', id=message_id, format='full').execute()
        
        body = ""
        if 'payload' in message:
            payload = message['payload']
            if 'parts' in payload:
                for part in payload['parts']:
                    if part['mimeType'] == 'text/plain':
                        data = part['body']['data']
                        import base64
                        body = base64.urlsafe_b64decode(data).decode('utf-8')
                        break
                    elif part['mimeType'] == 'text/html':
                        data = part['body']['data']
                        import base64
                        body = base64.urlsafe_b64decode(data).decode('utf-8')
            elif 'body' in payload and 'data' in payload['body']:
                import base64
                body = base64.urlsafe_b64decode(payload['body']['data']).decode('utf-8')
        
        return body
    except HttpError as error:
        print(f"❌ Error getting message body: {error}")
        return None


def get_message_headers(message):
    """Extract headers from a message."""
    headers = {}
    if 'payload' in message and 'headers' in message['payload']:
        for header in message['payload']['headers']:
            headers[header['name'].lower()] = header['value']
    return headers


def format_message(message, show_body=False):
    """Format a message for display."""
    headers = get_message_headers(message)
    
    subject = headers.get('subject', '(No Subject)')
    sender = headers.get('from', '(Unknown Sender)')
    date = headers.get('date', '(Unknown Date)')
    message_id = message['id']
    
    # Get internal date (timestamp)
    internal_date = int(message['internalDate']) / 1000
    formatted_date = datetime.fromtimestamp(internal_date).strftime('%Y-%m-%d %H:%M:%S')
    
    output = []
    output.append(f"📧 Message ID: {message_id}")
    output.append(f"   Subject: {subject}")
    output.append(f"   From: {sender}")
    output.append(f"   Date: {formatted_date}")
    
    if show_body:
        body = get_message_body(service, message_id)
        if body:
            # Truncate long bodies
            if len(body) > 1000:
                body = body[:1000] + "\n... (truncated)"
            output.append(f"   Body:\n{body}")
    
    return "\n".join(output)


def search_messages(service, query, max_results=10):
    """Search for messages matching a query."""
    try:
        results = service.users().messages().list(
            userId='me', q=query, maxResults=max_results).execute()
        
        messages = results.get('messages', [])
        if not messages:
            return []
        
        # Get full message details
        full_messages = []
        for msg in messages:
            try:
                message = service.users().messages().get(
                    userId='me', id=msg['id']).execute()
                full_messages.append(message)
            except HttpError as error:
                print(f"⚠️  Error getting message {msg['id']}: {error}")
        
        return full_messages
    except HttpError as error:
        print(f"❌ Error searching messages: {error}")
        return []


def get_latest_messages(service, max_results=5):
    """Get the latest messages from the inbox."""
    return search_messages(service, '', max_results=max_results)


def wait_for_message(service, query, timeout=60, check_interval=5):
    """Wait for a message matching the query to arrive."""
    print(f"⏳ Waiting for message matching: {query}")
    print(f"   Timeout: {timeout} seconds, Checking every {check_interval} seconds...")
    
    start_time = time.time()
    last_seen_ids = set()
    
    while time.time() - start_time < timeout:
        messages = search_messages(service, query, max_results=10)
        
        # Check for new messages
        new_messages = [msg for msg in messages if msg['id'] not in last_seen_ids]
        
        if new_messages:
            print(f"\n✅ Found {len(new_messages)} new message(s)!")
            return new_messages
        
        # Update last seen IDs
        last_seen_ids.update(msg['id'] for msg in messages)
        
        elapsed = int(time.time() - start_time)
        print(f"   Still waiting... ({elapsed}s elapsed)", end='\r')
        time.sleep(check_interval)
    
    print(f"\n⏱️  Timeout reached ({timeout}s)")
    return []


def main():
    parser = argparse.ArgumentParser(
        description='Check Gmail inbox for bc@crowestudio.com',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Search for LOE emails
  python3 scripts/check-bc-email.py --search "subject:Letter of Engagement" --max-results 5

  # Get latest 10 emails
  python3 scripts/check-bc-email.py --latest --max-results 10

  # Show full body of a specific email
  python3 scripts/check-bc-email.py --email-id "18a1b2c3d4e5f6g7" --show-body

  # Wait for an email to arrive
  python3 scripts/check-bc-email.py --wait-for "subject:Letter of Engagement" --timeout 120
        """
    )
    
    parser.add_argument('--search', type=str, help='Gmail search query (e.g., "subject:Letter of Engagement")')
    parser.add_argument('--latest', action='store_true', help='Get latest messages from inbox')
    parser.add_argument('--email-id', type=str, help='Get specific email by message ID')
    parser.add_argument('--wait-for', type=str, help='Wait for a message matching the query')
    parser.add_argument('--max-results', type=int, default=10, help='Maximum number of results (default: 10)')
    parser.add_argument('--show-body', action='store_true', help='Show full email body')
    parser.add_argument('--timeout', type=int, default=60, help='Timeout in seconds for --wait-for (default: 60)')
    
    args = parser.parse_args()
    
    # Validate arguments
    if not any([args.search, args.latest, args.email_id, args.wait_for]):
        parser.print_help()
        sys.exit(1)
    
    # Get credentials and build service
    print(f"🔐 Authenticating for {EMAIL_ACCOUNT}...")
    creds = get_credentials()
    global service
    service = build('gmail', 'v1', credentials=creds)
    print("✅ Authenticated successfully\n")
    
    # Execute requested action
    if args.wait_for:
        messages = wait_for_message(service, args.wait_for, timeout=args.timeout)
        if messages:
            for msg in messages:
                print("\n" + "="*60)
                print(format_message(msg, show_body=args.show_body))
        else:
            print("❌ No matching message found within timeout period")
            sys.exit(1)
    
    elif args.email_id:
        try:
            message = service.users().messages().get(
                userId='me', id=args.email_id, format='full').execute()
            print(format_message(message, show_body=True))
        except HttpError as error:
            print(f"❌ Error getting message: {error}")
            sys.exit(1)
    
    elif args.search:
        print(f"🔍 Searching for: {args.search}")
        messages = search_messages(service, args.search, max_results=args.max_results)
        
        if not messages:
            print("❌ No messages found")
            sys.exit(1)
        
        print(f"✅ Found {len(messages)} message(s)\n")
        for i, msg in enumerate(messages, 1):
            print(f"\n[{i}/{len(messages)}]")
            print("="*60)
            print(format_message(msg, show_body=args.show_body))
    
    elif args.latest:
        print(f"📬 Getting latest {args.max_results} messages...")
        messages = get_latest_messages(service, max_results=args.max_results)
        
        if not messages:
            print("❌ No messages found")
            sys.exit(1)
        
        print(f"✅ Found {len(messages)} message(s)\n")
        for i, msg in enumerate(messages, 1):
            print(f"\n[{i}/{len(messages)}]")
            print("="*60)
            print(format_message(msg, show_body=args.show_body))


if __name__ == '__main__':
    main()
