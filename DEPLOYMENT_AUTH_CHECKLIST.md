# 🚀 Deployment Auth Checklist

Since you are now using a deployed backend (`https://consistency-lab.onrender.com`), you need to ensure your authentication settings in Supabase and Google Cloud Console are correct.

This guide assumes:
1.  **Backend URL**: `https://consistency-lab.onrender.com` (Already updated in your code)
2.  **Frontend URL**:
    *   If testing locally: `http://localhost:3000`
    *   **If you deploy your frontend** (e.g. to Vercel/Netlify/Render), replace `http://localhost:3000` with your actual frontend URL (e.g., `https://my-app.vercel.app`) in the steps below.

---

## 1. Google Cloud Console Changes

Go to: [Google Cloud Console > APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)

1.  Find your OAuth 2.0 Client ID (the one you created for this project).
2.  **Authorized JavaScript origins**:
    *   Add your **Frontend URL** (e.g., `https://my-app.vercel.app`).
    *   Keep `http://localhost:3000` for local testing.
3.  **Authorized redirect URIs**:
    *   Ensure this points to your Supabase project callback:
        ```
        https://guittljwnglngasgxwhr.supabase.co/auth/v1/callback
        ```
    *   (This usually doesn't need changing unless you switched Supabase projects).

> **Note:** Changes to Google Auth settings can take a few minutes to propagate.

## 2. Supabase Auth Settings

Go to: [Supabase Dashboard > Authentication > URL Configuration](https://supabase.com/dashboard/project/guittljwnglngasgxwhr/auth/url-configuration)

1.  **Site URL**:
    *   Set this to your **Production Frontend URL** (e.g., `https://my-app.vercel.app`).
    *   If you don't have a production frontend yet, you can leave it as `http://localhost:3000`.
2.  **Redirect URLs**:
    *   Add your **Production Frontend URL** (e.g., `https://my-app.vercel.app/**`).
    *   Add `http://localhost:3000/**` for local testing.
    *   The `**` wildcard allows redirects to any path on that domain (like `/dashboard`).

## 3. Frontend Code Changes (Already Done ✅)

I have already updated your `frontend/.env.local` file:

```bash
NEXT_PUBLIC_API_URL=https://consistency-lab.onrender.com
```

This ensures your local frontend talks to the deployed backend.

## 4. Verification

After making these changes:
1.  Restart your local frontend (`npm run dev`).
2.  Try to **Sign Up** or **Sign In**.
3.  Check the "Network" tab in browser developer tools to verify requests are going to `https://consistency-lab.onrender.com`.

---

### Troubleshooting
*   **CORS Errors?** If you see CORS errors in the browser console, check the backend logs on Render. The backend is configured to allow all origins (`CORS(app)`), so this should work fine.
*   **Redirect Mismatch?** If Google shows a `redirect_uri_mismatch` error, double-check that the URL in the error message matches exactly what is in the "Authorized redirect URIs" in Google Cloud Console.
