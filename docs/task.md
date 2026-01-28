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

## 3. Design System & Base UI [/]
- [ ] Configure Tailwind CSS theme (colors, typography, spacing) inspired by ISDIN
- [ ] Implement responsive Header (with locale switcher) and Footer
- [ ] Build reusable UI components (Buttons, Inputs, Modals, Product Cards)

## 4. Feature Implementation [/]
- [ ] **Multi-language Catalog**: PLP and PDP with localized content
- [ ] **Authentication**: Sign-up, Login, and Profile management
- [ ] **Cart**: Global state management with Zustand
- [ ] **Checkout**: Shipping info collection and Order creation
- [ ] **Admin Panel**: Dashboard to manage Products, Categories, and Orders

## 5. Integrations & Notifications [/]
- [ ] Setup Cloudflare R2 for image storage
- [ ] Integrate Resend for checkout notification emails to admins
- [ ] Final UI/UX refinements and micro-animations

## 6. Verification & Launch [/]
- [ ] Verify locale switching and routing
- [ ] Test full checkout flow and email delivery
- [ ] Final audit against ISDIN reference site
