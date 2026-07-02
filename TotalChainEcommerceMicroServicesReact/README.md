# TotalChainEcommerceMicroServicesReact

Frontend for the TotalChain e-commerce platform. Built with React 19 + TypeScript + Vite 8. Communicates with the [TotalChainEcommerceMicroServicesApiNode](https://github.com/moraisLuismNet/TotalChainEcommerceMicroServicesApiNode) backend.

## Key Features

### For General Users
- Browse products by category / subcategory / reference hierarchy
- Product catalog with images, prices, and stock info
- Shopping cart management (add, update, remove items)
- Stripe Checkout payment integration
- Order history with status tracking
- Real-time shipment tracking with GPS map
- Responsive design (Bootstrap 5)

### For Administrators
- Full CRUD management for categories, subcategories, references, products
- User management (edit, delete)
- Cart monitoring with enable/disable
- Order management with status filtering
- Shipment tracking and management
- Kardex inventory ledger
- Email queue viewer
- Messages/notifications viewer
- Audit logs with expandable change details
- Search, pagination, and sorting across all admin pages

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build | Vite 8 |
| Routing | React Router v7 |
| State | Zustand 5 (with persist middleware) |
| Forms | react-hook-form + Zod |
| UI | Bootstrap 5, PrimeIcons 7, PrimeReact |
| Payments | Stripe.js |
| HTTP | Custom FetchAPI wrapper |

## Project Structure

```
src/
├── components/
│   ├── common/          # ProtectedRoute, Pagination, LoadingSpinner
│   ├── layout/          # Layout, Navbar, Footer
│   └── shop/            # ProductCard, CartItem, etc.
├── hooks/               # useAuth, useCart, useCategories, useProducts, etc.
├── environments/        # environment.ts (API base URL, Stripe key)
├── interfaces/          # TypeScript interfaces (IUser, IProduct, ICart, etc.)
├── pages/
│   ├── admin/           # Categories, SubCategories, References, Products,
│   │                    # Carts, AdminOrders, Users, AuditLogs, Kardex,
│   │                    # Messages, Mails, Shipments
│   └── shop/            # ListCategories, ListSubCategories, ListReferences,
│                        # ListProducts, CartDetails, Payment, Orders, MyShipments
├── services/            # API service classes (one per resource)
├── stores/              # Zustand stores (auth, cart)
├── utils/               # fetch-api.ts (HTTP client), api-mapper.ts (PascalCase↔camelCase)
├── App.tsx              # Router definition with lazy-loaded pages
├── main.tsx             # Entry point (Bootstrap, PrimeIcons, app CSS)
└── index.css            # Global styles
```

## Pages & Routes

### Public
| Route | Page |
|---|---|
| `/login` | Login |
| `/register` | Register |
| `/list-categories` | Browse categories |
| `/list-subcategories/:categoryId` | Browse subcategories |
| `/list-references/:subCategoryId` | Browse references |
| `/all-products` | All products |
| `/list-products/:subCategoryId` | Products by subcategory |
| `/payment/success` | Payment success |
| `/payment/cancel` | Payment cancelled |

### Authenticated (User)
| Route | Page |
|---|---|
| `/cart-details` | Shopping cart |
| `/payment` | Stripe Checkout |
| `/orders` | Order history |
| `/my-shipments` | My shipments tracking |

### Authenticated (Admin)
| Route | Page |
|---|---|
| `/categories` | Manage categories |
| `/subcategories` | Manage subcategories |
| `/references` | Manage references |
| `/products` | Manage products |
| `/carts` | Monitor carts |
| `/admin-orders` | Manage orders |
| `/users` | Manage users |
| `/audit-logs` | Audit trail viewer |
| `/kardex` | Inventory ledger |
| `/messages` | Notification messages |
| `/mails` | Email queue viewer |
| `/shipments` | Manage shipments |

## Setup & Installation

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd TotalChainEcommerceReact
npm install
```

### Configuration

Environment variables are defined in `src/environments/environment.ts`:

| Variable | Source | Description |
|---|---|---|
| `urlAPI` | hardcoded | Backend API base path (`/api/`) |
| `stripePublishableKey` | `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

Create a `.env` file in the project root (or set in the shell):

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Running

```bash
# Development server (port 3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The dev server proxies `/api/` requests to `http://localhost:5000` (configured in `vite.config.ts`).

## Key Conventions

- **API mapping** — Backend returns PascalCase JSON; `extractData<T>()` / `extractItem<T>()` in `src/utils/api-mapper.ts` converts keys to camelCase automatically
- **Auth** — JWT token stored in localStorage. `auth-storage` and `cart-storage` use Zustand persist middleware. On 401 the app redirects to `/login`
- **Admin guard** — Admin-only pages check `user.role === "ADMIN"` inside the component; routes are wrapped in `<ProtectedRoute>`
- **Lazy loading** — All page components are lazy-loaded with `React.lazy()` + `Suspense`
- **Forms** — `react-hook-form` with Zod schema validation

## Screenshots

| | | |
| :---: | :---: | :---: |
| <kbd><img src="img/01.png" width="60%" height="90%" alt="01"></kbd> | <kbd><img src="img/02.png" width="60%" height="90%" alt="02"></kbd> | <kbd><img src="img/03.png" width="90%" height="90%" alt="03"></kbd> |
| <kbd><img src="img/04.png" width="80%" height="90%" alt="04"></kbd> | <kbd><img src="img/05.png" width="60%" height="90%" alt="05"></kbd> | <kbd><img src="img/06.png" width="90%" height="90%" alt="06"></kbd> |
| <kbd><img src="img/07.png" width="90%" height="90%" alt="07"></kbd> | <kbd><img src="img/08.png" width="60%" height="90%" alt="08"></kbd> | <kbd><img src="img/09.png" width="90%" height="90%" alt="09"></kbd> |
| <kbd><img src="img/10.png" width="90%" height="90%" alt="10"></kbd> | <kbd><img src="img/11.png" width="90%" height="90%" alt="11"></kbd> | <kbd><img src="img/12.png" width="60%" height="90%" alt="12"></kbd> |
| <kbd><img src="img/13.png" width="90%" height="90%" alt="13"></kbd> | <kbd><img src="img/14.png" width="90%" height="90%" alt="14"></kbd> | <kbd><img src="img/15.png" width="60%" height="90%" alt="15"></kbd> |
| <kbd><img src="img/16.png" width="90%" height="90%" alt="16"></kbd> | <kbd><img src="img/17.png" width="90%" height="90%" alt="17"></kbd> | <kbd><img src="img/18.png" width="60%" height="90%" alt="18"></kbd> |
| <kbd><img src="img/19.png" width="90%" height="90%" alt="19"></kbd> | <kbd><img src="img/20.png" width="90%" height="90%" alt="20"></kbd> | <kbd><img src="img/21.png" width="60%" height="90%" alt="21"></kbd> |
| <kbd><img src="img/22.png" width="90%" height="90%" alt="22"></kbd> | <kbd><img src="img/23.png" width="90%" height="90%" alt="23"></kbd> | <kbd><img src="img/24.png" width="60%" height="90%" alt="24"></kbd> |
| <kbd><img src="img/25.png" width="90%" height="90%" alt="25"></kbd> | <kbd><img src="img/26.png" width="90%" height="90%" alt="26"></kbd> | 

[DeepWiki moraisLuismNet/TotalChainEcommerceMicroServicesReact](https://deepwiki.com/moraisLuismNet/TotalChainEcommerceMicroServicesReact)
