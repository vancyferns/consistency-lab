# 🔐 Google Sign-In Setup Guide

To allow users to "Sign in with Google", you need to get credentials from Google and put them into Supabase.

## 1. Get Google Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Click **Create Project** (if you don't have one) and name it (e.g., "Consistency Lab").
3. Click **Configure Consent Screen**:
   - Select **External** > Create.
   - Enter App Name ("Consistency Lab") and your email.
   - Click Save & Continue (you can skip scopes for now).
4. Go to **Credentials** (sidebar) > **Create Credentials** > **OAuth client ID**.
5. Select Application Type: **Web application**.
6. Under **Authorized redirect URIs**, add your Supabase Callback URL:
   ```
   https://guittljwnglngasgxwhr.supabase.co/auth/v1/callback
   ```
   *(This is your actual Project URL)*
7. Click **Create** and copy your **Client ID** and **Client Secret**.

## 2. Configure Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project **Consistency Lab**.
3. Go to **Authentication** > **Providers**.
4. Click **Google**.
5. Enable it (toggle "Enable Sign in with Google").
6. Paste the **Client ID** and **Client Secret** you just got from Google.
7. Click **Save**.

## 3. Test It!
1. Restart your frontend terminal (`Ctrl+C` then `npm run dev`) just to be safe.
2. Go to http://localhost:3000/dashboard.
3. Click **Sign In with Google**.
4. It should now redirect you to Google's login page!
