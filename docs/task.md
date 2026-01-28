# BELLA VIDA Website Development

## 1. Project Initialization & Setup [x]
- [x] Initialize Next.js project with TypeScript, Tailwind CSS, and App Router
- [x] Setup Neon Database and Drizzle ORM (Dependencies installed)
- [x] Install and configure `next-intl` (Dependencies installed)
- [x] Setup NextAuth.js (Auth.js) infrastructure (Dependencies installed)
- [x] Setup base layout and directory structure

## 2. Catalog Data Extraction [x]
- [x] Extract sample products and categories from [prd](file:///home/yashp/projects/bellavida/prd) PDFs
- [x] Create a seed script to populate the database with initial catalog data

## 3. Design System & Base UI [x]
- [x] Configure Tailwind CSS theme (colors, typography, spacing) inspired by ISDIN
- [x] Implement responsive Header (with locale switcher) and Footer
- [x] Build reusable UI components (Buttons, Inputs, Modals, Product Cards)

## 4. Feature Implementation [/]
- [x] **Multi-language Catalog**: Setup `next-intl` and folder-based routing
- [x] **PLP and PDP**: with localized content
- [x] **Authentication**: Sign-up, Login, and Profile management
- [x] **Cart**: Global state management with Zustand
- [x] **Checkout**: Shipping info collection and Order creation
- [/] **Admin Panel**: Dashboard to manage Products, Categories, and Orders
  - [x] View Orders
  - [x] Manage Products (Add, Update, Delete)

## 5. Integrations & Notifications [/]
- [x] Setup Cloudflare R2 for image storage
- [x] Integrate Resend for checkout notification emails to admins
- [x] Final UI/UX refinements and micro-animations

## 6. Verification & Launch [x]
- [x] Verify locale switching and routing
- [x] Test full checkout flow and email delivery
- [x] Final audit against ISDIN reference site
