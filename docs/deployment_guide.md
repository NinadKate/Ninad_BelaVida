# Production Deployment Guide

This document outlines the necessary configuration and steps to deploy **Bella Vida** to a production environment (e.g., Vercel, Netlify, Cloudflare Pages, or Docker).

## 1. Environment Variables

You must set the following environment variables in your production hosting dashboard.

### **Core**
- `DATABASE_URL`: Connection string for your production PostgreSQL database (Neon recommended).
  - *Format*: `postgresql://user:pass@host/dbname?sslmode=require`

### **Authentication (NextAuth.js)**
- `NEXTAUTH_URL`: The canonical URL of your production site.
  - *Example*: `https://bellavida.cl` (or `https://your-project.vercel.app`)
- `NEXTAUTH_SECRET`: A strong, random string used to encrypt session tokens.
  - *Generate*: Run `openssl rand -base64 32` in your terminal.
- **Google OAuth**:
  - `GOOGLE_CLIENT_ID`: From Google Cloud Console -> APIs & Services -> Credentials.
  - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console.
  - *Important*: Add your production callback URL (e.g., `https://bellavida.cl/api/auth/callback/google`) to the "Authorized redirect URIs" in Google Console.

### **Storage (Cloudflare R2)**
- `R2_ACCOUNT_ID`: Cloudflare Account ID.
- `R2_ACCESS_KEY_ID`: R2 Token Access Key ID.
- `R2_SECRET_ACCESS_KEY`: R2 Token Secret Access Key (ensure `Object Read & Write` permissions).
- `R2_BUCKET_NAME`: Name of your production bucket (e.g., `bellavida-prod`).
- `NEXT_PUBLIC_R2_URL`: The public-facing URL for your bucket (Custom Domain or R2.dev).
  - *Example*: `https://cdn.bellavida.cl`

### **Email (Resend)**
- `RESEND_API_KEY`: API Key from Resend.
  - *Note*: You must verify your sending domain (e.g., `bellavida.cl`) in the Resend dashboard to send emails to non-admin users.

## 2. Database Migration

Before the application starts, the production database schema must be up to date.

1. **Connect**: Ensure your local `.env` has the `DATABASE_URL` pointing to the **production** DB (temporarily) OR use a CI/CD pipeline step.
2. **Push Schema**:
   ```bash
   npx drizzle-kit push
   ```
   *Note*: This strictly syncs the schema. For more complex migrations, generating migration files (`npx drizzle-kit generate`) is recommended.

3. **Seeding (Optional)**:
   If you need initial data (categories, admin user, mock products):
   ```bash
   npx tsx src/lib/db/seed.ts
   ```

## 3. Build & Start

The application is a standard Next.js app.

- **Build Command**:
  ```bash
  npm run build
  ```
  *(This runs `next build`)*

- **Start Command**:
  ```bash
  npm start
  ```
  *(This runs `next start`)*

## 4. Specific Platform Notes

### **Vercel**
- **Preset**: Next.js
- **Root Directory**: `./`
- **Environment Variables**: Add all variables from Section 1 in "Project Settings > Environment Variables".
- **Database**: If using Vercel Postgres, variable names might differ (`POSTGRES_URL`), but Drizzle expects `DATABASE_URL`. Ensure mapping is correct.

### **Netlify**
- **Plugin**: Essential Next.js
- **Runtime**: Node.js 20+

## 5. Post-Deployment Verification

1. **Login**: Test "Sign in with Google". Ensure redirect back to the production domain works.
2. **Checkout**: Place a test order. Verify that:
   - Order appears in Admin Dashboard (`/admin`).
   - Email is received via Resend.
3. **Uploads**: Try creating a product with an image. Verify the image loads from the CDN.
