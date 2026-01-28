# BELLA VIDA Website Implementation Plan

Building a premium skincare e-commerce website "BELLA VIDA" as a clone of ISDIN, tailored for South American markets with multi-language support and administrative checkout notification.

## Proposed Technologies

- **Frontend**: Next.js (App Router) + TypeScript
- **Internationalization**: `next-intl`
- **Styling**: **Tailwind CSS** (for rapid, responsive development)
- **Database**: **Neon** (Serverless Postgres) or **PlanetScale**
- **ORM**: **Drizzle ORM** (Lightweight and extremely fast)
- **Object Storage**: **Cloudflare R2** (S3 compatible, zero egress fees, very cost-effective for skincare catalogs)
- **Authentication**: **NextAuth.js (Auth.js)** or **Clerk** (Clerk has a great free tier and is very scalable)
- **Forms**: React Hook Form + Zod
- **Emails**: Resend
- **State Management**: Zustand (for the cart)

## Proposed Changes

### Core Infrastructure

#### [NEW] [next.config.mjs](file:///home/yashp/projects/bellavida/next.config.mjs)
Configure internationalization and project settings.

#### [NEW] [tailwind.config.ts](file:///home/yashp/projects/bellavida/tailwind.config.ts)
Professional design configuration inspired by ISDIN's aesthetic.

### Design System

#### [NEW] [globals.css](file:///home/yashp/projects/bellavida/app/globals.css)
Global styles, CSS variables for the BELLA VIDA brand (inspired by ISDIN's minimalist and premium aesthetic).

#### [NEW] [Header.tsx](file:///home/yashp/projects/bellavida/components/layout/Header.tsx)
Responsive navigation with country/locale selector, search, and cart.

### Backend & Database (Drizzle ORM)

#### [NEW] [schema.ts](file:///home/yashp/projects/bellavida/lib/db/schema.ts)
Drizzle schema for PostgreSQL:
- **Auth (NextAuth standard)**: `users`, `accounts`, `sessions`, `verificationTokens`
- **Profiles**: `profiles` (extends `users` with `role`, `phone`, `country`, `preferred_locale`)
- **E-commerce**:
  - `categories`: `id`, `slug`, `name` (JSONB for localization), `image_url`
  - `products`: `id`, `category_id`, `slug`, `sku`, `price`, `name` (JSONB), `description` (JSONB), `images` (text array for R2 URLs), `stock`, `active`
  - `orders`: `id`, `user_id`, `status` (pending, contacted, completed, cancelled), `total`, `currency`, `shipping_info` (JSONB), `locale`
  - `order_items`: `id`, `order_id`, `product_id`, `quantity`, `price`

### Internationalization (next-intl)

#### [NEW] [routing.ts](file:///home/yashp/projects/bellavida/i18n/routing.ts)
Configuration for supported locales: `en`, `es-CL`, `es-PE`, `es-PY`, `es-UY`, `es-BO`, `es-AR`.

#### [NEW] [middleware.ts](file:///home/yashp/projects/bellavida/middleware.ts)
Next.js middleware to handle locale detection and routing.

### Features

#### [NEW] Product Catalog Pages
Multi-language dynamic routes: `/[locale]/products/[category]` and `/[locale]/products/[category]/[slug]`.

#### [NEW] Auth Pages
Login, register using NextAuth.js (Auth.js) with standard Email/Password or Social providers.

#### [NEW] Administrative Checkout
- User fills shipping info.
- Order is saved in `orders` table with `status: 'pending'`.
- Admin is notified via email (Resend) or a simple internal dashboard update.

## Verification Plan

### Automated Tests
- Linting and build checks: `npm run build`
- Unit tests for cart logic.

### Manual Verification
- Testing locale switching across all target countries.
- Verifying user registration and login.
- Completing a checkout flow and checking admin notification triggers.
- Responsive design check on mobile and desktop.
