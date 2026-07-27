# PBX Exchange Integration Status

Date: 2026-07-27  
Scope: FastAPI backend, Netlify Functions, frontend API clients, and documented deployment variables.

Status meanings:

- Implemented: code exists and is wired to a route or client.
- Partially implemented: code exists but has gaps, duplicate paths, or limited coverage.
- Mocked: uses fake/generated/local/demo data.
- Sandbox: designed for provider sandbox credentials.
- Disabled: code path exists but is not reachable or active by default.
- Requires API credentials: needs environment variables to call a provider.
- Production-ready: suitable for live usage after configuration and operational review.
- Not production-ready: should not be represented as live money movement or live provider behavior.

## Summary

PBX Exchange has meaningful integration scaffolding, but most financial-provider paths currently default to mock, sandbox, or simulated behavior unless credentials and production routing are configured. The UI must label development, demo, sandbox, and indicative rates clearly.

## MongoDB

| Field | Status |
| --- | --- |
| Implemented | Yes |
| Partially implemented | Yes |
| Mocked | No, but some routes create demo records |
| Sandbox | No |
| Disabled | No |
| Requires API credentials | Requires `MONGODB_URI` or `MONGO_URL` |
| Production-ready | Partially |
| Not production-ready concerns | Wallet schema fragmentation and duplicate FastAPI/Netlify access patterns need consolidation. |

Code paths:

- `backend/database/connection.py`
- `netlify/functions/_mongoClient.js`

Notes:

- FastAPI and Netlify Functions both access MongoDB.
- Wallet records use mixed field conventions (`userId`/`usd`/`php`/`usdc` and `user_id`/`usd_balance`/`php_balance`).
- Several endpoints seed demo balances or development records.

## Plaid

| Field | Status |
| --- | --- |
| Implemented | Yes |
| Partially implemented | Yes |
| Mocked | Yes |
| Sandbox | Yes |
| Disabled | No |
| Requires API credentials | `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`, and mode variables for sandbox/live |
| Production-ready | No |
| Not production-ready concerns | Bank linking is metadata/mock oriented; transfer/ACH settlement is stubbed. |

Code paths:

- `backend/routes/plaid.py`
- `backend/services/plaid_service.py`
- `backend/utils/plaid_mock.py`
- Legacy mock routes in `backend/server.py`
- Netlify functions including `create-link-token.js`, `exchange-public-token.js`, `plaid-status.js`, `sandbox-public-token.js`, `accounts-auth.js`, `accounts-balance.js`, `transactions-sync.js`, `identity.js`
- Frontend: `frontend/src/lib/bankApi.js`, `frontend/src/components/PlaidLinkButton.jsx`, `frontend/src/pages/onboarding/ConnectBank.jsx`, `frontend/src/pages/sender/BanksAndPayments.jsx`

Notes:

- FastAPI supports `PLAID_MODE=MOCK` and sandbox behavior.
- Netlify functions may default differently from FastAPI.
- UI must not imply live bank transfers unless provider credentials and transfer rails are configured.

## PayMongo

| Field | Status |
| --- | --- |
| Implemented | Partially |
| Partially implemented | Yes |
| Mocked | Yes / simulated in current payout functions |
| Sandbox | Possible if credentials are configured |
| Disabled | Partly; functions are not mapped into `/api/*` redirects |
| Requires API credentials | `PAYMONGO_SECRET_KEY` |
| Production-ready | No |
| Not production-ready concerns | Not part of FastAPI route inventory; Netlify functions are not fully routed; behavior is stub/sandbox oriented. |

Code paths:

- `netlify/functions/pbx-create-transfer.js`
- `netlify/functions/create-gcash-payout.js`
- `netlify/functions/quote-remittance.js`
- `netlify/paymongoClient.js`
- `paymongoClient.js`
- Docs: `PAYMONGO_INTEGRATION.md`, `TEST_PLAN_PAYMONGO.md`

Notes:

- External payout paths must remain secondary to PBX-to-PBX social payments.
- Any PayMongo-related UI should explicitly show sandbox or unavailable states until credentials and routing are validated.

## Circle

| Field | Status |
| --- | --- |
| Implemented | Yes |
| Partially implemented | Yes |
| Mocked | Yes |
| Sandbox | Yes |
| Disabled | No |
| Requires API credentials | `CIRCLE_API_KEY`, `CIRCLE_ENTITY_SECRET`, wallet set/treasury variables, environment variables |
| Production-ready | No |
| Not production-ready concerns | Mock defaults, wallet creation/minting are not full live-funds workflows, webhook coverage requires operational validation. |

Code paths:

- `backend/routes/circle.py`
- `backend/utils/circle_client.py`
- `backend/utils/circle_mock.py`
- Legacy `POST /api/circle/sendFunds` in `backend/server.py`
- Netlify functions including `circle-status.js`, `circle-webhook.js`, `circle-transfer.js`, `circle-balances.js`, `circle-ping.js`, `circle-auth-check.js`
- Frontend: `frontend/src/lib/circleApi.js`, `frontend/src/pages/sender/AddMoney.jsx`

Notes:

- Circle routes default to mock behavior when keys are missing.
- The UI should only show USDC/digital-dollar balances if the integration is enabled and the API reports support.

## Resend

| Field | Status |
| --- | --- |
| Implemented | Yes |
| Partially implemented | Yes |
| Mocked | Skips/logs when unset |
| Sandbox | Provider dependent |
| Disabled | Disabled when `RESEND_API_KEY` is absent |
| Requires API credentials | `RESEND_API_KEY`, `SENDER_EMAIL` |
| Production-ready | Partially |
| Not production-ready concerns | Email deliverability, templates, and compliance content require review. |

Code paths:

- `backend/services/notifications.py`
- `backend/services/magic_link.py`
- `backend/routes/auth.py`
- `backend/routes/admin.py`

Notes:

- Magic-link resend and notification emails depend on this path.
- Admin resend magic-link route is documented in code as incomplete/audit-oriented.

## Twilio

| Field | Status |
| --- | --- |
| Implemented | Yes |
| Partially implemented | Yes |
| Mocked | Yes when credentials are missing |
| Sandbox | Provider dependent |
| Disabled | Disabled/mock when Twilio variables are absent |
| Requires API credentials | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` |
| Production-ready | Partially |
| Not production-ready concerns | Phone verification/notification compliance and deliverability need validation. |

Code paths:

- `backend/services/notifications.py`
- `backend/routes/notification_prefs.py`

Notes:

- Notification preferences are implemented.
- SMS delivery should be clearly represented as configured/unconfigured.

## FX-rate provider

| Field | Status |
| --- | --- |
| Implemented | Yes |
| Partially implemented | Yes |
| Mocked | Yes via fallback rates |
| Sandbox | No |
| Disabled | Falls back when credentials missing |
| Requires API credentials | `OPENEXCHANGERATES_API_KEY` or `OXR_API_KEY` |
| Production-ready | Partially |
| Not production-ready concerns | Rate source, spread, expiry, and fee display must be consistent and factual. |

Code paths:

- `backend/routes/wallet.py`
- `backend/routes/recipient.py`
- `netlify/functions/get-fx-quote.js`
- `netlify/functions/fx-convert.js`
- `frontend/src/lib/fxApi.js`
- `frontend/src/lib/recipientApi.js`
- `frontend/src/components/LiveFXRate.jsx`
- `frontend/src/components/FXSimulator.jsx`
- `frontend/src/components/FXQuoteSimulator.jsx`
- `frontend/src/components/RatePreview.jsx`

Notes:

- Fallback rates must be labeled as indicative/development.
- Do not invent live rates or hide mock/fallback sources.

## Bank-transfer and payout services

| Field | Status |
| --- | --- |
| Implemented | Partially |
| Partially implemented | Yes |
| Mocked | Yes |
| Sandbox | Yes for Plaid-related bank link pieces |
| Disabled | Some functions not routed through `/api/*` |
| Requires API credentials | Plaid credentials, payout-provider credentials, MongoDB |
| Production-ready | No |
| Not production-ready concerns | ACH add-money/withdraw routes are stubs; PH payouts are simulated; settlement states are simplified. |

Code paths:

- `backend/routes/banks.py`
- `backend/routes/recipient.py`
- `backend/routes/internal_transfers.py`
- `netlify/functions/banks-add-money.js`
- `netlify/functions/banks-withdraw.js`
- `netlify/functions/add-money-unified.js`
- `netlify/functions/recipient-transfers.js`
- `netlify/functions/create-gcash-payout.js`

Notes:

- `backend/routes/banks.py` creates pending transfers and can debit balances but is not a complete ACH settlement integration.
- Recipient transfers and external payout flows must show pending/processing states and avoid instant-delivery claims.

## Magic links

| Field | Status |
| --- | --- |
| Implemented | Yes |
| Partially implemented | Yes |
| Mocked | Email sending may be skipped when provider unset |
| Sandbox | No |
| Disabled | No |
| Requires API credentials | Email provider credentials for actual delivery; `JWT_SECRET`; `APP_URL` |
| Production-ready | Partially |
| Not production-ready concerns | Deep-link routing and resend operational behavior need route fixes and provider validation. |

Code paths:

- `backend/services/magic_link.py`
- `backend/routes/auth.py`
- `frontend/src/pages/auth/MagicLinkHandler.jsx`

Notes:

- Tokens are hashed, expiring, and single-use.
- Some frontend fallback paths point to stale onboarding routes.

## Administrative tooling

| Field | Status |
| --- | --- |
| Implemented | Yes |
| Partially implemented | Yes |
| Mocked | Demo mint exists |
| Sandbox | Not applicable |
| Disabled | Frontend admin page is not active in `App.jsx` |
| Requires API credentials | Admin user roles/session, `ADMIN_PASSWORD`, `ADMIN_MINT_KEY` for demo mint |
| Production-ready | Partially |
| Not production-ready concerns | Admin UI routing and auth guard need repair; demo mint must remain nonproduction. |

Code paths:

- `backend/routes/admin.py`
- `backend/utils/admin.py`
- `backend/auth/basic_auth.py`
- `frontend/src/pages/Admin.jsx`
- `frontend/src/components/DemoTools.jsx`

## Frontend mock/local-only behavior

| Area | Status | Notes |
| --- | --- | --- |
| `frontend/src/lib/mockApi.js` | Mocked | LocalStorage transfers, recipients, payment methods, and FX-like helpers. |
| `pages/app/Send.jsx` | Partially mocked | External transfer flow uses mock/local behavior. |
| `pages/app/Activity.jsx` | Partially mocked | Reads local transfer history. |
| `pages/app/Manage.jsx` | Partially mocked | Local recipient/payment-method style behavior. |
| Demo wallet/fund tools | Mocked | Must remain development-only and clearly labeled. |

## Required product labeling

The UI must visibly identify:

- Development-only balance mint/fund tools.
- Mock Plaid, Circle, payout, and FX behavior.
- Sandbox provider status.
- Indicative rates and unavailable live rates.
- Pending/processing payment and withdrawal states.

The UI must not claim:

- Live banking, instant settlement, licensed remittance, insurance, government approval, or guaranteed delivery unless backed by configured production integrations and legal/compliance approval.

