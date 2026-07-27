# API Routing Restoration

Date: 2026-07-27  
Branch: `cursor/pbx-rebuild-audit-brand-80a3`

## Canonical convention

PBX Exchange backend routes are canonical under `/api/...`.

Local development:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- CRA proxy: `frontend/package.json` proxies relative `/api` calls to `http://localhost:8000`.
- `REACT_APP_BACKEND_URL` should be unset/empty for local proxy mode.

Production:

- Same-origin `/api/...` is preferred when a reverse proxy or Netlify redirect targets the FastAPI service.
- If the FastAPI API is hosted on a separate domain, set `REACT_APP_BACKEND_URL` to that domain and configure FastAPI `CORS_ORIGINS`.
- Do not hardcode the Emergent preview URL in source.

## Backend entry point

| Item | Finding |
| --- | --- |
| FastAPI module | `backend/server.py` |
| ASGI app | `server:app` |
| `FastAPI()` instantiation | `app = FastAPI(title="PBX API", version="1.0.0")` |
| Inline global router | `api_router = APIRouter(prefix="/api")` |
| Startup | Connects to MongoDB, creates ledger and audit indexes |
| Shutdown | Closes MongoDB connection |
| CORS | Configured in `backend/server.py`; wildcard by default with credentials disabled, explicit `CORS_ORIGINS` enables credentials |
| Required startup env | `MONGODB_URI` or `MONGO_URL`; `DB_NAME` optional default `pbx_database`; `JWT_SECRET` strongly recommended |
| Startup failure behavior | Fails loudly if MongoDB URI is absent or MongoDB ping fails |

## Registered routers

| Router | Prefix | Effective routes |
| --- | --- | --- |
| Inline `api_router` | `/api` | `/api/`, `/api/health`, leads, demo Plaid/Circle/session state |
| `routes.plaid` | absolute `/api/plaid/...` paths | Plaid config and link token |
| `routes.recipient` | `/api/recipient` | recipient wallet, conversion, bills, transfers, statements |
| `routes.users` | `/api/users` | role, current user, user search |
| `routes.internal_transfers` | `/api/internal` | lookup, transfer, incoming, invite |
| `routes.auth` | `/api/auth` | login, register, me, magic links |
| `routes.notification_prefs` | `/api/notifications` | preferences and status |
| `routes.social` | `/api/social` | friends, invites, conversations, messages, chat payments, payment requests |
| `routes.profiles` | `/api/profiles` | personal/business profiles and search |
| `routes.businesses` | `/api/businesses` | discovery, categories, chat, pay |
| `routes.admin` | `/api/admin` | admin RBAC/audit/ledger endpoints |
| `routes.banks` | `/api/banks` | linked banks, link, add money, withdraw |
| `routes.circle` | `/api/circle` | wallet, mint, balance, status |
| `routes.wallet` | `/api` | wallet balance and FX quote/convert |

## Local backend startup result

Command:

```bash
cd backend
MONGODB_URI=mongodb://localhost:27017 \
DB_NAME=pbx_exchange_dev \
JWT_SECRET=dev-jwt-secret \
APP_URL=http://localhost:3000 \
uvicorn server:app --host 0.0.0.0 --port 8000
```

Result:

- FastAPI imports successfully.
- Plaid initializes in `MOCK` mode without real Plaid credentials.
- CORS config loads.
- MongoDB connection succeeds when local MongoDB is running.
- Ledger and audit indexes are created.
- `GET /api/health` returns `200` with MongoDB status `connected`.

When MongoDB is unavailable, startup fails loudly with `ServerSelectionTimeoutError`; it does not silently run with a fake connected database.

## Frontend call to backend route map

| Frontend call | Expected method | Actual backend route | Exists | Auth required | Required fix |
| ------------- | --------------- | -------------------- | ------ | ------------- | ------------ |
| Health | GET | `/api/health` | Yes | No | None. Canonical local health route confirmed. |
| Register | POST | `/api/auth/register` | Yes | No | None. |
| Login | POST | `/api/auth/login` | Yes | No | None. |
| Magic link verify | POST | `/api/auth/magic/verify` | Yes | No token, valid magic token required | None. |
| Magic link resend | POST | `/api/auth/magic/resend` | Yes | No | Requires email provider for actual delivery; mock/log behavior otherwise. |
| Current user | GET | `/api/auth/me` | Yes | JWT or legacy session token | Frontend now uses canonical API helper. |
| Profile list/current | GET | `/api/profiles/me`, `/api/profiles/active` | Yes | Yes | JWT-aware user extraction restored. |
| Profile by handle | GET | `/api/profiles/by-handle/{handle}` | Yes | No | None. |
| People search | GET | `/api/profiles/search/people?q=...` | Yes | Header currently expected by client; backend allows search route behavior | JWT-aware user extraction restored where applicable. |
| Business search | GET | `/api/profiles/search/businesses?q=...`, `/api/businesses/discover` | Yes | Mixed; discovery public, paid/chat require auth | None for discovery. |
| Friend request | POST | `/api/social/friends/request` | Yes | Yes | JWT-aware user extraction restored. |
| Friend request acceptance/decline/block | POST | `/api/social/friends/action` | Yes | Yes | JWT-aware user extraction restored. |
| Friends list/status | GET | `/api/social/friends/list`, `/api/social/friends/status/{id}` | Yes | Yes | JWT-aware user extraction restored. |
| Conversations | GET | `/api/social/conversations`, `/api/social/conversations/{other_user_id}` | Yes | Yes | JWT-aware user extraction restored. |
| Chat messages | GET/POST | `/api/social/messages/{conversation_id}`, `/api/social/messages/send` | Yes | Yes | Message history now includes `payment_request` payloads. |
| PBX internal transfer | POST | `/api/internal/transfer` | Yes | Yes | JWT-aware user extraction restored; existing endpoint remains. |
| In-chat PBX payment | POST | `/api/social/payments/send-in-chat` | Yes | Yes | Verified locally with ledger/idempotency. |
| Payment request create | POST | `/api/social/payments/request-in-chat` | Yes | Yes | Added in this phase. |
| Payment request action | POST | `/api/social/payments/requests/action` | Yes | Yes | Added in this phase; accept uses ledger transfer. |
| Wallet balances | GET | `/api/wallet/balance`, `/api/recipient/wallet` | Yes | Yes | JWT-aware extraction restored for recipient wallet. |
| Activity | GET | `/api/recipient/statements`, local `mockApi` activity in older sender page | Partially | Yes for statements | Unified activity remains a follow-up. |
| Add Money | POST | `/api/banks/add-money`, `/api/circle/mint-usdc`, `/api/recipient/wallet/fund` | Yes | Yes | Mock/sandbox behavior must stay labeled. |
| Convert | GET/POST | `/api/fx/quote`, `/api/fx/convert`, `/api/recipient/convert*` | Yes | Yes | FX may use mock fallback without provider credentials. |
| Withdraw | POST | `/api/banks/withdraw` | Yes | Yes | Stub ACH behavior documented as not production-ready. |
| External recipient lookup/invite | POST | `/api/internal/lookup`, `/api/internal/invite` | Yes | Yes | JWT-aware extraction restored. |
| Sender bills pay | POST | `/api/recipient/bills/pay` | Yes | Yes | Fixed frontend sender bills call from nonexistent `/api/bills/pay`. |
| Business chat/pay | POST | `/api/businesses/chat/{id}`, `/api/businesses/pay` | Yes | Yes | Business pay UI remains follow-up; API route exists. |

## Netlify routing findings

Current deployment uses:

- `netlify.toml` build command at repo root.
- Publish directory: `frontend/build`.
- Functions directory: `netlify/functions`.
- SPA/API redirects in `frontend/public/_redirects`.

`_redirects` currently maps a subset of `/api/*` to Netlify functions, then falls back to `/* /index.html 200`.

Covered by Netlify functions:

- Auth login/me/register
- Plaid subset
- Circle subset
- Banks subset
- Wallet balance
- Recipient coarse routes
- FX quote/convert

Not covered by Netlify redirects:

- `/api/social/*`
- `/api/profiles/*`
- `/api/businesses/*`
- `/api/internal/*`
- `/api/users/*`
- `/api/notifications/*`
- `/api/admin/*`
- `/api/auth/magic/*`
- several recipient subroutes

Required production fix: either deploy FastAPI separately and add an explicit `/api/*` proxy before SPA fallback, or set `REACT_APP_BACKEND_URL` to a reachable FastAPI host and configure CORS. No production backend URL is invented in this branch.

