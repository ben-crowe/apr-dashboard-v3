#!/bin/bash
# Setup script for environment variables

echo "Creating .env.local file..."

cat > .env.local << 'EOF'
# APR Dashboard V3 - Environment Variables
# DO NOT COMMIT THIS FILE TO VERSION CONTROL

# ============================================
# SUPABASE CONFIGURATION
# ============================================
VITE_SUPABASE_URL=https://ngovnamnjmexdpjtcnky.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nb3ZuYW1uam1leGRwanRjbmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTk0NzAsImV4cCI6MjA1NzI5NTQ3MH0.i5pxHZ6Uvo1kcyws-C0tSegs35pA7tMO287_gYXIkGQ
VITE_SUPABASE_PROJECT_ID=ngovnamnjmexdpjtcnky

# ============================================
# CLICKUP INTEGRATION
# ============================================
VITE_CLICKUP_API_TOKEN=pk_10791838_U80AIXPC66YFCS56AGWT71SAPXWH6EU5
VITE_CLICKUP_ENV=production
VITE_CLICKUP_LIST_ID=901402094744

# ============================================
# DOCUSEAL E-SIGNATURE
# ============================================
VITE_DOCUSEAL_API_KEY=9jnCPmKv5FfnokxJBnn4ij1tPgsQPEqqXASs2MSyaRN

# ============================================
# RESEND EMAIL SERVICE
# ============================================
RESEND_API_KEY=re_8B4Po2eL_84kFfQeEHAf4z4GFTLaqTv94

# ============================================
# VALCRE API CREDENTIALS
# ============================================
VALCRE_CLIENT_ID=c9AfkQFS3Scq8YvRsl1DtGbbMRaDDSoh
VALCRE_CLIENT_SECRET=6VLkSjdT-EvELiIh8QLNv-sQrgy-o_P2KXrHn1g1_Sq9p9yPn73NxuBGtKGaO2kZ
VALCRE_USERNAME=chris.chornohos@valta.ca
VALCRE_PASSWORD=Valvalta1!

# ============================================
# GMAIL SMTP (for legacy email sending)
# ============================================
GMAIL_USERNAME=admin@valta.ca
GMAIL_APP_PASSWORD=spusouthiyfmesdj

# ============================================
# APPLICATION CONFIGURATION
# ============================================
VITE_APP_URL=https://apr-dashboard-v2.vercel.app
EOF

echo "✅ Created .env.local"

echo ""
echo "Creating .env.example template..."

cat > .env.example << 'EOF'
# APR Dashboard V3 - Environment Variables Template
# Copy this file to .env.local and fill in your actual values
# NEVER commit .env.local to version control

# ============================================
# SUPABASE CONFIGURATION
# ============================================
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id_here

# ============================================
# CLICKUP INTEGRATION
# ============================================
VITE_CLICKUP_API_TOKEN=your_clickup_api_token_here
VITE_CLICKUP_ENV=test
VITE_CLICKUP_LIST_ID=your_clickup_list_id_here

# ============================================
# DOCUSEAL E-SIGNATURE
# ============================================
VITE_DOCUSEAL_API_KEY=your_docuseal_api_key_here

# ============================================
# RESEND EMAIL SERVICE
# ============================================
RESEND_API_KEY=your_resend_api_key_here

# ============================================
# VALCRE API CREDENTIALS
# ============================================
VALCRE_CLIENT_ID=your_valcre_client_id_here
VALCRE_CLIENT_SECRET=your_valcre_client_secret_here
VALCRE_USERNAME=your_valcre_username_here
VALCRE_PASSWORD=your_valcre_password_here

# ============================================
# GMAIL SMTP (for legacy email sending)
# ============================================
GMAIL_USERNAME=your_gmail_username_here
GMAIL_APP_PASSWORD=your_gmail_app_password_here

# ============================================
# APPLICATION CONFIGURATION
# ============================================
VITE_APP_URL=http://localhost:8080
EOF

echo "✅ Created .env.example"
echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Review .env.local for correct values"
echo "2. Set Supabase secrets: supabase secrets set KEY=value"
echo "3. Set Vercel environment variables in project settings"
echo ""
echo "See ENV_SETUP_GUIDE.md for detailed instructions"



