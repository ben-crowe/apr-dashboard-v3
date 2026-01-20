# Email Recipient Override - Testing Setup

**Date:** January 8, 2026  
**Status:** ✅ Configured and Ready

---

## How It Works

### Default Behavior

**When you open LOE Preview Modal:**
- ✅ **Default recipient:** `bc@crowestudio.com` (your email)
- ✅ **Shows:** "E-signature will be sent to: bc@crowestudio.com"
- ✅ **Testing mode indicator:** Shows when different from client's email

### Change Recipient

**To change the email:**
1. Click **"Change Recipient"** button in the LOE Preview Modal
2. Enter any email address
3. Click **"Done"**
4. Email will be sent to that address

---

## Flow

1. **LOE Preview Modal opens**
   - Defaults to: `bc@crowestudio.com`
   - Shows current recipient

2. **User can change recipient**
   - Click "Change Recipient"
   - Enter new email
   - Click "Done"

3. **When "Send to Client" clicked**
   - Uses the email shown (your email or changed email)
   - Sends to Edge Function with that email
   - Edge Function sends to actual recipient (no redirect)

4. **Email arrives**
   - At the email address you specified
   - Contains DocuSeal signing link
   - Can be verified with email checker

---

## Testing Workflow

### Step 1: Open LOE Preview
- Click "Preview & Send LOE" on a job
- See default: `bc@crowestudio.com`

### Step 2: (Optional) Change Recipient
- Click "Change Recipient" if you want a different email
- Or leave as `bc@crowestudio.com` for testing

### Step 3: Send LOE
- Click "Send to Client"
- Email sent to the address shown

### Step 4: Verify Email Arrived
```bash
python3 scripts/check-bc-email.py --wait-for "subject:Letter of Engagement" --timeout 60 --show-body
```

---

## Code Flow

**LOEPreviewModal.tsx:**
- Line 41: Defaults to `bc@crowestudio.com`
- Line 102: Passes `recipientEmail` to `onApprove()`

**LoeQuoteSection.tsx:**
- Line 635: Uses `overrideEmail || job.clientEmail`
- Line 651: Calls `sendLOEEmail(recipientEmail, ...)`

**generateLOE.ts:**
- Line 333: Sends `to: clientEmail` to Edge Function

**send-loe-email-fixed/index.ts:**
- Line 14: Receives `to` parameter
- Line 33: Uses `actualRecipient = to` (no redirect!)
- Line 77: Sends to `[actualRecipient]`

---

## Current Configuration

✅ **Default email:** `bc@crowestudio.com`  
✅ **Can be changed:** Via "Change Recipient" button  
✅ **Edge Function:** Sends to actual recipient (no redirect)  
✅ **Resend API:** Using your account (`re_G2kzpzLs_BYcHQSapaKbNosgRvGYpT7e8`)  
✅ **Domain:** `crowestudio.com` verified for sending  

---

## Expected Behavior

**When you send LOE:**
1. ✅ Modal shows `bc@crowestudio.com` by default
2. ✅ You can change it if needed
3. ✅ Email sent to the address shown
4. ✅ Email arrives at that address
5. ✅ Email checker can verify it

---

**Status:** ✅ Ready to test - Send LOE and verify it arrives at your email!
