# LazyCart 🥱🛒

Multi vendor e-commerce app built with Next.js App Router and Tailwind CSS. Includes store management, product catalogs, cart/checkout, orders, coupons, ratings, and admin and store dashboards.

**Deplyment**
- Live Deployment on Vercel: https://lazycart.vercel.app


**Tech Stack**
- Next.js (App Router) + React
- Tailwind CSS
- Prisma + PostgreSQL
- Clerk (authentication)
- Redux Toolkit (state) + Axios (HTTP)
- ImageKit (media upload, with graceful fallback)

**Key Features**
- Multi-vendor stores: create, manage products, view orders
- Customer flows: product listing, cart, checkout, orders
- Coupons: validation for new users, members, expiry
- Ratings & reviews tied to purchases
- Store dashboard: add products, manage discounts
- Admin dashboard: approve stores, manage coupons

**Environment Variables**
Create `.env` or `.env.local` with:
- `DATABASE_URL` — PostgreSQL connection string
- `IMAGEKIT_PUBLIC_KEY` — ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` — ImageKit private key
- `IMAGEKIT_URL_ENDPOINT` — ImageKit URL endpoint
- `DEFAULT_STORE_LOGO_URL` — optional fallback logo URL if uploads fail
- `NEXT_PUBLIC_CURRENCY_SYMBOL` — optional currency symbol for UI (e.g., `$`)

**Setup**
1. Install dependencies
	- `npm install`
2. Generate Prisma client
	- `npx prisma generate`
3. Apply database migrations (ensure `DATABASE_URL` is set)
	- `npx prisma migrate dev`
4. Run the dev server
	- `npm run dev`

**Development Notes**
- Special characters in store usernames: URLs treat `#` as a fragment. Client pages reconstruct and encode the full username before API requests; use `encodeURIComponent(username)` for links to `/shop/<username>`.
- ImageKit upload outages: store creation falls back to a placeholder logo (inline SVG or `DEFAULT_STORE_LOGO_URL`) so the route won’t fail if `upload.imagekit.io` is unreachable.
- Prisma enums/relations: `PaymentMethod` uses `COD` or `STRIPE`. `Order` relations require `connect` for `user`, `store`, `address`. `Coupon` uses `discount` (not `discountPercent`).

**Primary API Routes**
- `POST /api/store/create` — create a store (uploads logo to ImageKit; falls back on failure)
- `GET /api/store/data?username=<username>` — fetch store info + products
- `POST /api/orders` / `GET /api/orders` — place or list orders
- `POST /api/coupon` — validate coupon
- `POST /api/store/product` — add product (uploads images)

**Troubleshooting**
- Image uploads failing (DNS or network): confirm ImageKit env vars and connectivity; the app will still create stores with a fallback logo.
- Store not found when username has `#`: ensure links/navigations use encoded usernames; the shop page already handles hash fragments.

**Scripts**
- `npm run dev` — start development server
- `npx prisma studio` — open Prisma Studio (optional)

—
Project is a work in progress and will continue to evolve.
