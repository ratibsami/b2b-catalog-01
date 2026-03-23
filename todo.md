# B2B Catalog Platform - TODO

## Phase 1: Project Setup & Database Schema
- [x] Initialize project scaffold with web-db-user template
- [x] Design and implement database schema (products, categories, users, inquiries, content)
- [x] Set up environment variables and secrets
- [ ] Configure cloud storage (S3) integration

## Phase 2: Backend API Development
- [x] Implement authentication and authorization (admin/user roles)
- [x] Create product CRUD endpoints
- [x] Create category management endpoints
- [x] Create inquiry/message endpoints
- [x] Implement email notification system for new inquiries
- [x] Create content management endpoints (homepage text, banners)
- [x] Set up image upload and storage endpoints
- [x] Write comprehensive API tests

## Phase 3: Frontend Public Pages
- [x] Design and implement Home page (hero, CTAs, featured categories, B2B benefits)
- [x] Design and implement Product Catalog page (grid, filters, search)
- [x] Design and implement Product Detail page (images, specs, pricing, contact button)
- [x] Design and implement About Us page
- [x] Design and implement Contact page with inquiry form
- [x] Design and implement FAQ page
- [x] Implement Persian (RTL) layout throughout
- [x] Add WhatsApp contact integration
- [ ] Implement optional login system for pricing visibility

## Phase 4: CMS Admin Panel
- [x] Create admin dashboard
- [x] Implement secure admin login
- [x] Build product management UI (CRUD)
- [x] Build category management UI
- [x] Build image upload interface
- [x] Build content management interface (homepage, banners)
- [x] Build inquiry/message viewing interface
- [x] Implement admin-only access controls

## Phase 5: Image Generation & Cloud Storage
- [x] Integrate image generation API for product placeholders
- [x] Configure cloud storage for product images
- [x] Configure cloud storage for category banners
- [x] Configure cloud storage for marketing assets
- [x] Implement image upload workflow in admin panel
- [x] Set up CDN URLs for asset delivery

## Phase 6: UI Polish, RTL, & SEO
- [x] Apply dark SaaS design (purple/blue gradient, soft rounded cards)
- [x] Implement smooth animations and hover effects
- [x] Ensure full RTL support across all pages
- [x] Implement mobile-first responsive design
- [x] Add SEO meta tags and structured data
- [x] Optimize performance and loading times
- [x] Test cross-browser compatibility

## Phase 7: Testing & Delivery
- [x] Seed demo data (products, categories, sample inquiries)
- [x] Perform comprehensive testing (functionality, RTL, responsiveness)
- [x] Test email notification system
- [x] Test image upload and storage
- [x] Test admin panel workflows
- [ ] Create checkpoint and prepare for delivery
- [x] Document setup and deployment instructions


## Bug Fixes
- [x] Fix /admin/categories 404 error - create admin sub-pages routing
- [x] Create admin/Products.tsx page
- [x] Create admin/Categories.tsx page
- [x] Create admin/Inquiries.tsx page
- [x] Create admin/Content.tsx page
- [x] Create admin/FAQ.tsx page
- [x] Update App.tsx with admin sub-routes

## Admin Authentication
- [x] Create admin login page with password protection
- [x] Implement admin session management
- [x] Add admin login/logout API endpoints
- [x] Protect admin routes with authentication check
- [x] Create admin credentials in database
- [x] Test login flow and session persistence


## Current Bugs to Fix
- [x] Fix admin panel 404 error when accessing /admin/categories and other sub-pages
- [x] Remove "پنل ادمین" button from header navigation
- [x] Ensure admin pages render correctly after login
- [x] Fix missing useState import in admin pages

## Current Issues
- [x] Admin login page gets stuck after entering credentials - page doesn't navigate to admin dashboard

## Image Upload Issues
- [x] Fix category image upload - images not persisting to database/storage
- [x] Implement proper cloud storage integration for category images
- [x] Update category create/update endpoints to handle image uploads

## Product Image & Video Upload
- [x] Add uploadProductMedia endpoint to products router (reuses categories uploadImage)
- [x] Update Products admin page with card-based UI for products
- [x] Add image upload with preview in Products admin page
- [x] Add optional video upload support for products
- [ ] Display products with images and video thumbnails on public catalog


## Admin Security Enhancement
- [x] Add password-protected modal dialog to admin panel
- [x] Create admin password verification endpoint
- [x] Store admin session in localStorage after password verification
- [x] Display password modal on admin page load if session not verified


## Branding Updates
- [x] Add Savin Global Trade logo to header
- [x] Update business name throughout website
- [x] Add logo to admin panel header
- [ ] Update favicon with logo
- [ ] Add logo to footer


## Admin Logo Management
- [x] Add logo upload endpoint to server routers
- [x] Create Settings page in admin panel for logo management
- [x] Add logo upload UI with preview in admin Settings
- [x] Store logo URL in database and load on page load
- [x] Update Home page to fetch logo from database
- [x] Update Catalog page to fetch logo from database
- [x] Update Admin panel to fetch logo from database
- [x] Write tests for logo upload functionality
- [x] Remove logo images from all pages (display name only)
- [x] Remove team section from About page
- [x] Add hamburger menu to Home page for mobile
- [x] Add hamburger menu to Catalog page for mobile
- [x] Make company name smaller on mobile
- [x] Update phone number to +8613012705854
- [x] Update email to ratibsami360@gmail.com
- [x] Update address to شنجزن - چین
