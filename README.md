# TotalChainEcommerceMicroServicesApiNodeReact

Full-stack e-commerce platform with **9 Node.js/Express/TypeScript microservices** (Sequelize ORM, PostgreSQL each) and a **React 19 + Vite frontend**, featuring Stripe payments, WhatsApp notifications via OpenWA, and Brevo transactional emails.

---

## Tech Stack

### Backend (`TotalChainEcommerceMicroServicesApiNode/`)
- **Runtime:** Node.js 20 + TypeScript
- **Framework:** Express
- **ORM:** Sequelize 6 (PostgreSQL, MySQL, SQL Server, SQLite)
- **Auth:** JWT (bcryptjs + jsonwebtoken)
- **Workers:** Background polling for emails (5 min) and WhatsApp (15 s)
- **9 independent microservices** with their own databases

### Frontend (`TotalChainEcommerceReact/`)
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Routing:** React Router v7 (lazy-loaded)
- **State:** Zustand 5 with persist (localStorage)
- **UI:** Bootstrap 5, PrimeIcons, PrimeReact
- **Forms:** react-hook-form + Zod

---

## Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose

### One-Command Start
```bash
docker compose up -d
```

This starts **11 containers**:

| Service | Port | Database |
|---------|------|----------|
| PostgreSQL | `5432` | — |
| UsersManager | `5001` | UsersManagerMS |
| Products | `5002` | ProductsMS |
| Shopings | `5003` | ShopingsMS |
| Payments | `5004` | PaymentsMS |
| Shipments | `5005` | ShipmentsMS |
| Kardex | `5006` | KardexMS |
| AuditLogs | `5007` | AuditLogsMS |
| Mails | `5008` | MailsMS |
| Messages | `5009` | MessagesMS |
| Frontend (Nginx) | `4200` | — |

Migrations and seed data run automatically on first start.

### Access
- **Frontend:** http://localhost:4200
- **API docs (Swagger):** http://localhost:5001/api-docs through http://localhost:5009/api-docs

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `luis@mail.com` | `123456` |

---

## Microservices

| Port | Service | DB | Purpose |
|------|---------|-----|---------|
| 5001 | UsersManagerMicroService | UsersManagerMS | Auth (JWT), CRUD usuarios |
| 5002 | ProductsMicroService | ProductsMS | Catálogo: categorías, subcategorías, referencias, productos, stocks |
| 5003 | ShopingsMicroService | ShopingsMS | Carrito (Cart, CartDetail) + Órdenes (Order, OrderDetail) |
| 5004 | PaymentsMicroService | PaymentsMS | Stripe Checkout Sessions |
| 5005 | ShipmentsMicroService | ShipmentsMS | Envíos con tracking |
| 5006 | KardexMicroService | KardexMS | Kardex / movimientos de inventario |
| 5007 | AuditLogsMicroService | AuditLogsMS | Auditoría de operaciones CRUD |
| 5008 | MailsMicroService | MailsMS | Cola de emails + worker Brevo |
| 5009 | MessagesMicroService | MessagesMS | Cola de notificaciones + worker OpenWA WhatsApp |

### Inter-service Communication
HTTP síncrono vía **axios** con JWT compartido como Bearer token.

```
UsersManager ──► Mails, AuditLogs
Products ──► Kardex, AuditLogs
Shopings ──► Products, UsersManager, Payments, Mails, Messages, AuditLogs
Payments ──► Shopings, Mails, AuditLogs
Shipments ──► Shopings, Mails, Messages, AuditLogs
Kardex ──► AuditLogs
```

---

## Frontend Pages

### Public
- `/login`, `/register` — Auth pages
- `/list-categories` — Browse categories
- `/list-subcategories/:categoryId` — Browse subcategories
- `/list-references/:subCategoryId` — Browse references
- `/list-products/:subCategoryId` / `/all-products` — Browse products
- `/payment/success`, `/payment/cancel` — Stripe redirect pages

### Authenticated (User)
- `/cart-details` — Shopping cart
- `/payment` — Checkout
- `/orders` — Order history
- `/my-shipments` — Shipment tracking with map

### Admin
- `/categories`, `/subcategories`, `/references`, `/products` — CRUD management
- `/carts`, `/admin-orders`, `/users` — User & order management
- `/audit-logs` — Activity audit trail
- `/kardex` — Inventory ledger
- `/messages` — WhatsApp gateway + QR linking
- `/mails` — Email queue log
- `/shipments` — All shipments with tracking

---

## External Integrations

### Stripe (Payments)
- Checkout Sessions API (test mode)
- Webhook for `checkout.session.completed`
- On completion: creates order + shipment + notifications
- Config: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`

### OpenWA (WhatsApp)
- Self-hosted NestJS gateway at `http://localhost:2785`
- QR code linking via `/api/messages/link`
- Worker polls every 15s
- Config: `OPENWA_BASE_URL`, `OPENWA_API_KEY`, `OPENWA_SESSION_ID`

### Brevo / Sendinblue (Email)
- Transactional email API — order confirmations, low-stock alerts, delivery updates
- Immediate send with fallback to queued retry (worker every 5 min)
- Config: `EMAIL_BREVO_API_KEY`, `EMAIL_FROM_EMAIL`

---

## Project Structure

```
TotalChainEcommerceMicroServicesApiNodeReact/
├── docker-compose.yml               # Orchestrates all 11 containers
├── init-databases.sql               # Creates all 9 databases
├── TotalChainEcommerceMicroServicesApiNode/
│   ├── UsersManagerMicroService/    # Port 5001
│   ├── ProductsMicroService/        # Port 5002
│   ├── ShopingsMicroService/        # Port 5003
│   ├── PaymentsMicroService/        # Port 5004
│   ├── ShipmentsMicroService/       # Port 5005
│   ├── KardexMicroService/          # Port 5006
│   ├── AuditLogsMicroService/       # Port 5007
│   ├── MailsMicroService/           # Port 5008
│   └── MessagesMicroService/        # Port 5009
├── TotalChainEcommerceReact/        # Frontend (React 19 + Vite)
│   └── src/
│       ├── pages/                   # shop/ (user) + admin/
│       ├── components/              # Layout, common components
│       ├── stores/                  # Zustand (auth, cart)
│       ├── utils/                   # FetchAPI, api-mapper
│       └── App.tsx                  # Router with lazy-loaded pages
├── OpenWA/                          # WhatsApp gateway (external)
└── AGENTS.md                        # Agent guide
```

### Per-Microservice Structure
```
XxxMicroService/
├── src/
│   ├── api/
│   │   ├── routes/          # Route definitions + Swagger JSDoc
│   │   ├── controllers/     # Async handlers
│   │   └── middleware/      # auth, internalAuth, errorHandler, rateLimiter
│   ├── core/
│   │   ├── config/          # database, swagger config
│   │   └── helpers/         # ApiResponse, ResponseHelper
│   ├── database/
│   │   ├── models/          # Sequelize models
│   │   ├── migrations/      # Sequelize migrations
│   │   └── repositories/    # BaseRepository + specific repos
│   └── services/
│       ├── XxxService.ts    # Business logic
│       └── httpClients/     # Axios calls to other microservices
├── .env
├── Dockerfile
└── package.json
```

---

## Environment Variables (Docker)

Key overrides in `docker-compose.yml`:

| Variable | Value |
|----------|-------|
| `DB_HOST` | `postgres` |
| `OPENWA_BASE_URL` | `http://host.docker.internal:2785/api` |
| `STRIPE_SUCCESS_URL` | `http://localhost:4200/payment/success?session_id={CHECKOUT_SESSION_ID}` |
| `STRIPE_CANCEL_URL` | `http://localhost:4200/payment/cancel` |

Full per-service config in each `.env` file.

---

## Security

- JWT auth (Bearer token or cookie)
- Role-based access: `"Admin"` or `"User"`
- Rate limiting: 100 req/min per IP (in-memory)
- bcryptjs password hashing
- Stripe webhook signature verification
- CORS configured per service

---

## Development

### All services via Docker
```bash
docker compose up -d
docker compose logs -f   # Watch all logs
```

### Single service rebuild
```bash
docker compose build <service>
docker compose up -d <service>
```

### Local (without Docker)

Each microservice independently:
```bash
cd TotalChainEcommerceMicroServicesApiNode/<MicroService>
npm install
npm run migrate
npm run dev
```

Frontend:
```bash
cd TotalChainEcommerceReact
npm install
npm run dev   # Vite on port 5173, proxies /api to localhost:5001-5009
```

### Databases
```bash
node create-databases.js   # Create all 9 databases
```

---
## Screenshots

### Backend (Swagger)

<img src="TotalChainEcommerceMicroServicesApiNode/img/AuditLogsMicroService.png" width="90%" alt="AuditLogsMicroService">
<img src="TotalChainEcommerceMicroServicesApiNode/img/KardexMicroService.png" width="90%" alt="KardexMicroService">
<img src="TotalChainEcommerceMicroServicesApiNode/img/MailsMicroService.png" width="90%" alt="MailsMicroService">
<img src="TotalChainEcommerceMicroServicesApiNode/img/MessagesMicroService.png" width="90%" alt="MessagesMicroService">
<img src="TotalChainEcommerceMicroServicesApiNode/img/PaymentsMicroService.png" width="90%" alt="PaymentsMicroService">
<img src="TotalChainEcommerceMicroServicesApiNode/img/ProductsMicroService_1.png" width="90%" alt="ProductsMicroService_1">
<img src="TotalChainEcommerceMicroServicesApiNode/img/ProductsMicroService_2.png" width="90%" alt="ProductsMicroService_2">
<img src="TotalChainEcommerceMicroServicesApiNode/img/ShipmentsMicroService.png" width="90%" alt="ShipmentsMicroService">
<img src="TotalChainEcommerceMicroServicesApiNode/img/ShopingsMicroService.png" width="90%" alt="ShopingsMicroService">
<img src="TotalChainEcommerceMicroServicesApiNode/img/UsersManagerMicroService.png" width="90%" alt="UsersManagerMicroService">


### Frontend

| | | |
| :---: | :---: | :---: |
| <kbd><img src="TotalChainEcommerceMicroServicesReact/img/01.png" width="60%" height="90%" alt="01"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/02.png" width="60%" height="90%" alt="02"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/03.png" width="90%" height="90%" alt="03"></kbd> |
| <kbd><img src="TotalChainEcommerceMicroServicesReact/img/04.png" width="80%" height="90%" alt="04"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/05.png" width="60%" height="90%" alt="05"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/06.png" width="90%" height="90%" alt="06"></kbd> |
| <kbd><img src="TotalChainEcommerceMicroServicesReact/img/07.png" width="90%" height="90%" alt="07"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/08.png" width="60%" height="90%" alt="08"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/09.png" width="90%" height="90%" alt="09"></kbd> |
| <kbd><img src="TotalChainEcommerceMicroServicesReact/img/10.png" width="90%" height="90%" alt="10"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/11.png" width="90%" height="90%" alt="11"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/12.png" width="60%" height="90%" alt="12"></kbd> |
| <kbd><img src="TotalChainEcommerceMicroServicesReact/img/13.png" width="90%" height="90%" alt="13"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/14.png" width="90%" height="90%" alt="14"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/15.png" width="60%" height="90%" alt="15"></kbd> |
| <kbd><img src="TotalChainEcommerceMicroServicesReact/img/16.png" width="90%" height="90%" alt="16"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/17.png" width="90%" height="90%" alt="17"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/18.png" width="60%" height="90%" alt="18"></kbd> |
| <kbd><img src="TotalChainEcommerceMicroServicesReact/img/19.png" width="90%" height="90%" alt="19"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/20.png" width="90%" height="90%" alt="20"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/21.png" width="60%" height="90%" alt="21"></kbd> |
| <kbd><img src="TotalChainEcommerceMicroServicesReact/img/22.png" width="90%" height="90%" alt="22"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/23.png" width="90%" height="90%" alt="23"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/24.png" width="60%" height="90%" alt="24"></kbd> |
| <kbd><img src="TotalChainEcommerceMicroServicesReact/img/25.png" width="90%" height="90%" alt="25"></kbd> | <kbd><img src="TotalChainEcommerceMicroServicesReact/img/26.png" width="90%" height="90%" alt="26"></kbd> | 

---

## Links

- [Frontend README](TotalChainEcommerceReact/README.md)
- [Backend README](TotalChainEcommerceMicroServicesApiNode/README.md)
- [OpenWA Gateway](https://github.com/rmyndharis/OpenWA)
- [DeepWiki Project Page](https://deepwiki.com/moraisLuismNet/TotalChainEcommerceMicroServicesApiNodeReact)

---

Developed by [moraisLuismNet](https://github.com/moraisLuismNet)
