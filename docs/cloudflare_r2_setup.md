# Cloudflare Account & R2 Storage Setup Guide

This guide will walk you through creating a Cloudflare account, setting up billing, and configuring R2 Object Storage for your Bella Vida project.

## 1. Create a Cloudflare Account

1.  Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).
2.  Enter your **Email** and **Password**.
3.  Click **Sign Up**.
4.  Verify your email address by clicking the link sent to your inbox.

## 2. Set Up Billing (Required for R2)

R2 has a generous free tier (10 GB storage, 1M Class A operations per month), but requires a valid payment method to be enabled.

1.  Log in to your Cloudflare dashboard.
2.  Go to **Manage Account** > **Billing** > **Payment Info**.
3.  Click **Add Payment Method**.
4.  Enter your **Credit Card** details.
5.  Save your payment information.

## 3. Enable R2 Object Storage

1.  On the left sidebar of the dashboard, locate and click **R2**.
2.  If this is your first time, you will see a "Get started with R2" page.
3.  Click **Subscribe to R2 Plan**.
4.  Review the plan details (Free tier + pay-as-you-go).
5.  Confirm the subscription using your saved payment method.

## 4. Create a Bucket

1.  In the R2 dashboard, click **Create bucket**.
2.  **Bucket Name**: Enter a unique name (e.g., `bellavida-assets`).
3.  **Location**: Leave as "Automatic" or select a region closest to your users (e.g., `WNAM` for North America/West, `EEUR` for Europe).
4.  Click **Create Bucket**.

## 5. Generate API Credentials

To allow the application to upload and view images, you need API keys.

1.  Go back to the main **R2** dashboard page (not inside the specific bucket).
2.  On the right side, click **Manage R2 API Tokens**.
3.  Click **Create API Token**.
4.  **Token Name**: Enter a descriptive name (e.g., `bellavida-app-token`).
5.  **Permissions**: Select **Object Read & Write**.
    *   *Note: Read & Write is required for image uploads.*
6.  **TTL (Time To Live)**: Select **Forever** (or a duration of your choice).
7.  Click **Create API Token**.

## 6. Save Credentials

**IMPORTANT:** Do not close the page until you have saved these values. You cannot see the Secret Access Key again.

Copy the following values into your project's `.env` file:

-   **Access Key ID**: Maps to `R2_ACCESS_KEY_ID`.
-   **Secret Access Key**: Maps to `R2_SECRET_ACCESS_KEY`.
-   **Endpoint**: Look for the URL that looks like `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`. Maps to `R2_ENDPOINT`.
-   **Bucket Name**: The name you chose in Step 4. Maps to `R2_BUCKET_NAME`.

Example `.env` configuration:
```bash
R2_ACCOUNT_ID="<your_account_id>"
R2_ACCESS_KEY_ID="<your_access_key_id>"
R2_SECRET_ACCESS_KEY="<your_secret_access_key>"
R2_BUCKET_NAME="bellavida-assets"
R2_PUBLIC_URL="https://pub-<hash>.r2.dev" # Optional: Setup public access
```

## 7. Setup Public Access (Optional but Recommended)

For images to be visible to users without signing URLs every time (cheaper/faster for public assets):

1.  Go to your bucket settings.
2.  Click **Settings** tab.
3.  Scroll to **R2.dev subdomain**.
4.  Click **Allow Access**.
5.  Copy the `https://pub-....r2.dev` URL.
6.  Use this as your `R2_PUBLIC_URL` in the `.env` file.
7.  *Alternatively, you can connect a custom domain (e.g., assets.bellavida.cl) if you have one managed by Cloudflare.*

## 8. Configure CORS (Cross-Origin Resource Sharing)

If you plan to upload files directly from the browser (Client-side uploads), you need to configure CORS. For this project (Server-side uploads), this step is optional but good practice.

1.  In your bucket, go to **Settings**.
2.  Scroll to **CORS Policy**.
3.  Click **Edit CORS Policy** and paste:
```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://your-production-url.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```
4.  Click **Save**.

You are now ready to use Cloudflare R2 with your application!
