# PBX Exchange Rebuild Audit

Date: 2026-07-27  
Branch: `cursor/pbx-rebuild-audit-brand-80a3`

## Executive summary

PBX Exchange is not a landing-page prototype. The repository contains a React social-payment application, a FastAPI backend, a parallel Netlify Functions API layer, MongoDB persistence, and tests covering social graph, wallets, transfers, ledgers, recipient flows, banks, notifications, profiles, and businesses.

The rebuild should preserve the existing backend and tested behavior while consolidating duplicated frontend flows and replacing the older visual language with a single PBX Exchange design system. The main stabilization risks are:

- Active frontend routes are in `frontend/src/App.jsx`; `frontend/src/App.js` is a legacy stub and should not become the app entry.
- Netlify redirects cover only a subset of backend APIs. Social, profiles, businesses, internal transfers, notifications, and admin currently depend on `REACT_APP_BACKEND_URL` pointing at FastAPI.
- Three data/API modes coexist: FastAPI, Netlify Functions, and frontend `mockApi`/localStorage.
- Wallet schemas are fragmented between `usd`/`php`/`usdc` and `usd_balance`/`php_balance`.
- Several flows are duplicated or unrouted, especially People pickers, wallet cards, FX previews, transfer forms, bills, and navigation shells.
- The current brand system is inconsistent and still uses older `#0A2540`, `#061C33`, `#F6C94B`, amber, red, and generic white-card patterns.

## A. Application architecture

### Frontend

- Framework: React 19.
- Router: React Router DOM 7 via `BrowserRouter`, `Routes`, `Route`, `Navigate`.
- Active entry point: `frontend/src/index.js` imports `frontend/src/App.jsx`.
- Legacy inactive entry: `frontend/src/App.js` only wires `/`, `/admin`, and `/link-demo`; do not use as the primary app.
- Build tooling: Create React App with CRACO (`frontend/craco.config.js`).
- Styling: Tailwind CSS, shadcn/Radix primitives in `frontend/src/components/ui`, `frontend/src/index.css`, `frontend/src/styles/design-system.css`, and `frontend/src/lib/theme.js`.
- HTTP clients: mostly native `fetch`; `axios` appears in `frontend/src/pages/Admin.jsx`.
- Main frontend API wrappers:
  - `frontend/src/contexts/SessionContext.jsx`
  - `frontend/src/lib/socialApi.js`
  - `frontend/src/lib/profilesApi.js`
  - `frontend/src/lib/businessesApi.js`
  - `frontend/src/lib/internalApi.js`
  - `frontend/src/lib/bankApi.js`
  - `frontend/src/lib/circleApi.js`
  - `frontend/src/lib/recipientApi.js`
  - `frontend/src/lib/fxApi.js`
  - `frontend/src/lib/netlify-api.js`
  - `frontend/src/lib/mockApi.js`

### Backend

- Framework: FastAPI.
- Main entry point: `backend/server.py`.
- App title/version: `PBX API`, `1.0.0`.
- ASGI server dependency: `uvicorn` in `backend/requirements.txt`.
- Database: MongoDB through Motor/PyMongo.
- Database connection: `backend/database/connection.py`.
- Backend routers included in `backend/server.py`:
  - `routes.plaid`
  - `routes.recipient`
  - `routes.users`
  - `routes.internal_transfers`
  - `routes.auth`
  - `routes.notification_prefs`
  - `routes.social`
  - `routes.profiles`
  - `routes.businesses`
  - `routes.admin`
  - `routes.banks`
  - `routes.circle`
  - `routes.wallet`

### Database and persistence

MongoDB collections inferred from code:

- `users`
- `wallets`
- `sessions`
- `session_states`
- `profiles`
- `friendships`
- `conversations`
- `messages`
- `invites`
- `ledger`
- `ledger_tx`
- `transactions`
- `linked_banks`
- `banks`
- `pending_transfers`
- `saved_billers`
- `magic_links`
- `notification_preferences`
- `notification_logs`
- `audit_log`
- `leads`

Important schema issue: wallet code uses two conventions:

- Netlify/wallet router convention: `userId`, `usd`, `php`, `usdc`, `demoSeeded`.
- Recipient/social/internal convention: `user_id`, `usd_balance`, `php_balance`.

### Authentication model and session handling

The repository contains multiple auth/session systems:

- FastAPI JWT auth in `backend/routes/auth.py`.
- Legacy session-token lookup in `backend/routes/auth.py`, `backend/routes/wallet.py`, and `backend/routes/circle.py`.
- Header-trust auth in several routes that read `X-Session-Token` as a user id.
- Anonymous demo cookie `pbx_uid` in `backend/utils/user_helper.py`.
- Netlify HMAC auth in `netlify/functions/auth-login.js`, `auth-register.js`, and `auth-me.js`.
- Magic links through `backend/services/magic_link.py` and `backend/routes/auth.py`.
- Admin basic auth for leads in `backend/auth/basic_auth.py`.
- Admin RBAC and audit helpers in `backend/utils/admin.py`.

Security preservation requirement: do not weaken route guards, transfer validation, ledger checks, idempotency, admin RBAC, magic-link expiry, or sensitive-data masking during the redesign.

### API structure

Primary API surfaces:

- FastAPI under `/api/*`.
- Netlify Functions under `/.netlify/functions/*`, with selected `/api/*` redirects in `frontend/public/_redirects`.
- Frontend local mock API in `frontend/src/lib/mockApi.js`.

### Deployment structure

- Root package: `package.json`.
- Frontend package: `frontend/package.json`.
- Netlify config: `netlify.toml`.
- Netlify functions directory: `netlify/functions`.
- Static SPA output: `frontend/build`.
- Static redirects: `frontend/public/_redirects`.

### Netlify configuration

`netlify.toml` currently contains:

- Build command: `npm install && cd frontend && yarn install --frozen-lockfile && yarn build`
- Publish directory: `frontend/build`
- Functions directory: `netlify/functions`
- Environment: `NODE_VERSION=20`, `SECRETS_SCAN_ENABLED=false`

Deployment risk: no `yarn.lock` or `package-lock.json` was found, yet the Netlify build uses `yarn install --frozen-lockfile`.

### Environment variables

Main variables referenced by code/docs:

- Frontend: `REACT_APP_BACKEND_URL`, `REACT_APP_NETLIFY_URL`, `REACT_APP_DEMO_MODE`, `REACT_APP_ADMIN_MINT_KEY`, `REACT_APP_ENABLE_VISUAL_EDITS`.
- FastAPI: `MONGODB_URI`, `MONGO_URL`, `DB_NAME`, `JWT_SECRET`, `ADMIN_PASSWORD`, `ADMIN_MINT_KEY`, `CORS_ORIGINS`, `PLAID_MODE`, `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`, `OPENEXCHANGERATES_API_KEY`, `OXR_API_KEY`, `CIRCLE_API_KEY`, `CIRCLE_ENTITY_SECRET`, `CIRCLE_WALLET_SET_ID`, `CIRCLE_ENVIRONMENT`, `CIRCLE_TREASURY_WALLET_ID`, `CIRCLE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `SENDER_EMAIL`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, `APP_URL`.
- Netlify Functions: `MONGODB_URI`, `MONGO_URL`, `DB_NAME`, `AUTH_SECRET`, Plaid variables, Circle variables, `OPENEXCHANGERATES_API_KEY`, `OXR_API_KEY`, `APP_BASE_URL`, `PAYMONGO_SECRET_KEY`.

### Third-party integrations

- MongoDB: persistence.
- Plaid: link token/account mock and sandbox flows.
- Circle: USDC/wallet mock and sandbox/live paths depending credentials.
- OpenExchangeRates/OXR: FX quotes when configured.
- Resend: email notifications when configured.
- Twilio: SMS notifications when configured.
- PayMongo: Netlify function/client stubs for payout/payment work.
- Netlify Functions: serverless API bridge for deployment.

### Mock integrations

- Plaid mock routes and utilities.
- Circle mock routes/utilities.
- Local fallback FX rates.
- Recipient wallet fund endpoint marked development-only.
- ACH bank add-money/withdraw stubs.
- PH transfer/payout mocks.
- Frontend `mockApi.js` localStorage transfers/recipients/payment methods.
- Demo wallet seeding in auth and wallet routes.

### Production integrations

Production-capable code paths exist for MongoDB, FastAPI, JWT, magic links, ledger indexes, admin audit, Plaid sandbox/live mode, Circle SDK-backed paths, Resend, Twilio, and OpenExchangeRates. Several require credentials and should be treated as not production-ready until configured and tested end-to-end.

## B. Route inventory

Classification legend:

- Keep: preserve functionality and route.
- Redesign: keep route but update UI/UX.
- Merge: consolidate with a shared component/flow.
- Redirect: route should redirect to a maintained equivalent.
- Deprecate: route exists only for debug/legacy and should be removed from primary navigation after compatibility is handled.
- Repair: broken or incomplete route/link behavior.
- Admin-only: restrict to authorized admin users.

### Active public, marketing, and legal routes

| Route | Component | Classification | Notes |
| --- | --- | --- | --- |
| `/` | `pages/Landing.jsx` | Redesign | Must become full PBX Exchange marketing homepage centered on social payments and cross-border wallets. |
| `/pricing` | `pages/Pricing.jsx` | Redesign | Preserve factual pricing language; avoid unsupported claims. |
| `/business` | `pages/Business.jsx` | Redesign | Keep as public business marketing page; distinguish from in-app business discovery. |
| `/how-it-works` | `pages/HowItWorks.jsx` | Redesign | Align with People -> Profile -> Connection -> Chat -> Pay/Request. |
| `/roadmap` | `pages/Roadmap.jsx` | Deprecate | Not in requested public IA; either move under Help/About or remove from primary nav. |
| `/privacy` | `pages/Privacy.jsx` | Keep | Redesign shell only. |
| `/terms` | `pages/Terms.jsx` | Keep | Redesign shell only. |
| `/security` | `pages/Security.jsx` | Redesign | Must reflect implemented controls only. |
| `/data-retention` | `pages/DataRetention.jsx` | Keep | Legal/supporting route. |
| Missing `/personal` | none | Repair | Required public page. |
| Missing `/about` or `/about-pbx` | none | Repair | Required public page. |
| Missing `/help` | none | Repair | Required public page; also fix `/support` references. |

### Authentication and onboarding routes

| Route | Component | Classification | Notes |
| --- | --- | --- | --- |
| `/login` | `pages/Login.jsx` | Redesign | Preserve FastAPI/Netlify auth behavior. |
| `/register` | `pages/Register.jsx` | Redesign | Progressive registration should include handle/country/preferred currency only if backend supports or docs mark pending. |
| `/verify` | `pages/Verify.jsx` | Repair | Currently redirects to stale `/app/dashboard`. |
| `/auth/magic` | `pages/auth/MagicLinkHandler.jsx` | Keep/Repair | Preserve magic-link verification and deep links; fix stale `/onboarding/welcome`. |
| `/welcome` | `pages/onboarding/Welcome.jsx` | Redesign | Should become coherent onboarding entry. |
| `/onboarding/phone` | `pages/onboarding/PhoneOTP.jsx` | Redesign | Preserve role/session behavior. |
| `/onboarding/bank` | `pages/onboarding/ConnectBank.jsx` | Redesign | Funding method should be skippable unless required. |
| `/onboarding/recipient` | `pages/onboarding/AddRecipient.jsx` | Merge | External recipient setup should be secondary to People flow. |
| `/onboarding/people` | `pages/onboarding/PeoplePicker.jsx` | Merge | Duplicate of sender People picker. |
| `/onboarding/chat/:conversationId` | `pages/onboarding/OnboardingChat.jsx` | Merge/Repair | Align with core chat once user is authenticated. |
| `/onboarding/personal` | redirect | Redirect | Existing redirect to `/welcome`. |
| `/onboarding/business` | redirect | Redirect | Existing redirect to `/welcome`. |
| `/get-started` | redirect | Redirect | Existing redirect to `/welcome`. |

### Public deep-link routes

| Route | Component | Classification | Notes |
| --- | --- | --- | --- |
| `/pay/:handle` | `pages/pay/PayByHandle.jsx` | Keep/Redesign | Primary handle/QR payment link. Must prioritize PBX users before external rails. |

### Legacy app routes

| Route | Component | Classification | Notes |
| --- | --- | --- | --- |
| `/app/*` | redirect to `/sender/dashboard` | Repair | Current catch-all is too broad. Map legacy `/app/home`, `/app/dashboard`, `/app/send`, `/app/wallet`, `/app/activity`, and `/app/settings` to precise equivalents. |

### Sender/personal app routes

| Route | Component | Classification | Notes |
| --- | --- | --- | --- |
| `/sender` | redirect | Keep | Redirect to `/sender/dashboard`. |
| `/sender/dashboard` | `pages/app/Home.jsx` | Redesign | Home dashboard should emphasize balances, people, conversations, activity. |
| `/sender/people` | `pages/sender/People.jsx` | Redesign | Primary People experience. |
| `/sender/people/picker` | `pages/sender/PeoplePicker.jsx` | Merge/Redesign | Merge with onboarding picker. |
| `/sender/chat/:userId` | `pages/sender/Chat.jsx` | Redesign | Central chat/payment experience. Preserve social APIs. |
| `/sender/send` | `pages/app/Send.jsx` | Merge/Redesign | Should become unified Pay; external recipients secondary. |
| `/sender/send-external` | `pages/app/Send.jsx` | Redirect/Merge | Explicit external path can remain but route to a subflow in Pay. |
| `/sender/add-money` | `pages/sender/AddMoney.jsx` | Redesign | Preserve bank/Circle behavior and sandbox labels. |
| `/sender/withdraw` | `pages/sender/Withdraw.jsx` | Redesign | Preserve bank API behavior. |
| `/sender/banks` | `pages/sender/BanksAndPayments.jsx` | Redesign | Move under More as Banks and payment methods. |
| `/sender/businesses` | `pages/sender/Businesses.jsx` | Redesign | Keep business discovery. Repair pay-business link. |
| `/sender/bills` | `pages/sender/Bills.jsx` | Merge | Merge with recipient bill primitives where possible. |
| `/sender/activity` | `pages/app/Activity.jsx` | Redesign/Repair | Currently uses local mock transfers; should unify with transaction APIs. |
| `/sender/settings` | `pages/app/Manage.jsx` | Redesign/Merge | Should become More/Profile/Security/Recipients/Legal. |
| `/sender/recipients` | `pages/app/Manage.jsx` | Merge | Keep external recipients but secondary. |
| `/sender/*` unknown | redirect to dashboard | Repair | Use branded authenticated 404 or role-aware routing instead of blind dashboard redirect. |

### Recipient routes

| Route | Component | Classification | Notes |
| --- | --- | --- | --- |
| `/recipient/dashboard` | `pages/recipient/Dashboard.jsx` | Redesign | Use same PBX design system. |
| `/recipient/wallets` | `pages/recipient/Wallets.jsx` | Merge/Redesign | Merge shared wallet primitives with sender wallet. |
| `/recipient/convert` | `pages/recipient/Convert.jsx` | Merge/Redesign | Use shared conversion UI. |
| `/recipient/bills` | `pages/recipient/Bills.jsx` | Merge/Redesign | More complete than sender bills. |
| `/recipient/transfers` | `pages/recipient/Transfers.jsx` | Redesign | Preserve recipient transfer APIs. |
| `/recipient/statements` | `pages/recipient/Statements.jsx` | Redesign | Preserve statement export behavior. |
| `/recipient/notifications` | `pages/recipient/NotificationSettings.jsx` | Redesign/Repair | Fix `/support` link. |
| `/recipient/*` unknown | redirect to dashboard | Repair | Use branded authenticated 404 or role-aware routing. |

### Business routes

| Route | Component | Classification | Notes |
| --- | --- | --- | --- |
| `/business` | `pages/Business.jsx` | Redesign | Public business marketing page. |
| `/sender/businesses` | `pages/sender/Businesses.jsx` | Redesign | In-app business discovery. |
| `/sender/chat/:userId?type=business` | `pages/sender/Chat.jsx` | Keep/Repair | Used by business chat deep links. |
| Missing `/sender/pay-business/:id` | none | Repair | `Businesses.jsx` links here but route does not exist. |
| Business profile switching | `ProfileSwitcher` | Keep/Redesign | Active business profiles exist via profiles API. |
| Dedicated business dashboard | none | Repair | Required IA calls for Overview, Customers, Payments, Conversations, Activity, Business Profile, Settings. |

### Admin and debug routes

| Route | Component | Classification | Notes |
| --- | --- | --- | --- |
| `/admin` | `pages/Admin.jsx` only in legacy `App.js` | Admin-only/Repair | Should be explicitly routed with admin auth or removed from public bundle. |
| `/link-demo` | `pages/LinkDemo.jsx` only in legacy `App.js` | Deprecate | Debug route. |
| `/plaid-gate-test` | `pages/PlaidGateTest.jsx` unrouted | Deprecate | Debug route. |
| `frontend/public/pbx-demo.html` | static | Deprecate | Standalone demo bypasses React app. |

## C. Component inventory

### Duplicate dashboard components

- `pages/app/Home.jsx` and `pages/recipient/Dashboard.jsx` both provide dashboard snapshots with separate card styles.
- `pages/Dashboard.jsx` is an older unrouted dashboard and should not be restored as-is.

### Duplicate navigation systems

- `components/PublicShell.jsx`
- `components/SenderShell.jsx`
- `components/RecipientShell.jsx`
- `components/AppShell.jsx` (dead legacy `/app/*` shell)

Recommendation: replace with shared `AppShell`, `DesktopSidebar`, `MobileNav`, `PublicHeader`, and `PublicFooter` primitives.

### Duplicate wallet cards and wallet flows

- `pages/app/Home.jsx`
- `pages/sender/AddMoney.jsx`
- `pages/sender/Withdraw.jsx`
- `pages/sender/BanksAndPayments.jsx`
- `pages/recipient/Wallets.jsx`
- `pages/Wallet.jsx` (unrouted legacy)

Recommendation: create shared `BalanceCard`, `WalletCard`, `Amount`, and transaction primitives.

### Duplicate transaction/send components

- `pages/app/Send.jsx`
- `pages/onboarding/AddRecipient.jsx`
- `pages/sender/Chat.jsx` payment modal
- `pages/SendMoney.jsx` with `components/send/*` (unrouted)
- `pages/recipient/Transfers.jsx`

Recommendation: one unified Pay flow for PBX users first, with external recipient as a labeled secondary path.

### Duplicate People pickers

- `pages/onboarding/PeoplePicker.jsx`
- `pages/sender/PeoplePicker.jsx`

Recommendation: one reusable People search/select component with caller-provided post-select behavior.

### Duplicate recipient forms

- `pages/onboarding/AddRecipient.jsx`
- `pages/app/Manage.jsx`
- `pages/app/Send.jsx`
- `components/send/RecipientSelect.jsx`

Recommendation: one external-recipient form primitive and one recipient-management surface.

### Duplicate FX widgets

- `components/LiveFXRate.jsx`
- `components/FXSimulator.jsx`
- `components/FXQuoteSimulator.jsx`
- `components/RatePreview.jsx`
- `lib/fxApi.js`
- `lib/recipientApi.js`
- `lib/mockApi.js`

Recommendation: one rate display primitive that always shows source, age, and sandbox/indicative state.

### Hardcoded colors, spacing, typography

Common hardcoded values:

- `#0A2540`
- `#061C33`
- `#F6C94B`
- `#0B1F3B`
- `#C9A24D`
- Tailwind `amber-*`, `yellow-*`, `red-600`, `bg-white`, `rounded-2xl`, and ad hoc gradients.

Recommendation: migrate to tokens and semantic classes:

- `bg-app`
- `bg-surface`
- `bg-surface-elevated`
- `text-primary`
- `text-secondary`
- `text-accent`
- `border-subtle`
- `status-success`
- `status-warning`
- `status-danger`

### Components that should become reusable primitives

- Brand logo and app icon.
- Public header/footer.
- Desktop sidebar and mobile nav.
- Button, icon button, card, page header, section header.
- Avatar, profile row, status badge.
- Amount with tabular numbers.
- Wallet card and balance card.
- Transaction row/detail.
- Payment bubble and request bubble.
- Search field.
- Empty/loading/error states.
- Confirmation dialog.

## D. API inventory

### Authentication

- FastAPI:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `GET /api/auth/me`
  - `POST /api/auth/magic/verify`
  - `POST /api/auth/magic/resend`
  - `GET /api/auth/magic/info`
- Netlify:
  - `/.netlify/functions/auth-login`
  - `/.netlify/functions/auth-register`
  - `/.netlify/functions/auth-me`
  - `/.netlify/functions/verify-session`
  - `/.netlify/functions/session-status`

### Profiles and user search

- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /api/users/role`
- `GET /api/users/search`
- `GET /api/profiles/me`
- `GET /api/profiles/active`
- `GET /api/profiles/by-handle/{handle}`
- `POST /api/profiles/switch/{profile_id}`
- `POST /api/profiles/personal`
- `POST /api/profiles/business`
- `PUT /api/profiles/{profile_id}`
- `DELETE /api/profiles/{profile_id}`
- `GET /api/profiles/search/people`
- `GET /api/profiles/search/businesses`
- `GET /api/profiles/{profile_id}`

### Friendships, conversations, and messages

- `POST /api/social/friends/request`
- `POST /api/social/friends/action`
- `GET /api/social/friends/list`
- `GET /api/social/friends/status/{other_user_id}`
- `POST /api/social/quick-add`
- `GET /api/social/invites`
- `DELETE /api/social/invites/{invite_id}`
- `GET /api/social/invites/all`
- `POST /api/social/invites/process-on-signup`
- `GET /api/social/conversations`
- `GET /api/social/conversations/{other_user_id}`
- `GET /api/social/messages/{conversation_id}`
- `POST /api/social/messages/send`

### Payments and payment requests

- `POST /api/social/payments/send-in-chat`
- `POST /api/internal/lookup`
- `POST /api/internal/transfer`
- `GET /api/internal/incoming`
- `POST /api/internal/invite`
- Business payments: `POST /api/businesses/pay`

Payment requests are represented in frontend requirements and tests as needed behavior, but the audited backend has no dedicated payment-request router. This must be implemented or explicitly documented as backend work remaining.

### Wallets, FX, add money, and withdrawals

- `GET /api/wallet/balance`
- `GET /api/fx/quote`
- `POST /api/fx/convert`
- `GET /api/banks/linked`
- `POST /api/banks/link`
- `DELETE /api/banks/{bank_id}`
- `POST /api/banks/add-money`
- `POST /api/banks/withdraw`
- `GET /api/banks/transfers`
- `POST /api/circle/create-wallet`
- `POST /api/circle/mint-usdc`
- `GET /api/circle/balance`
- `GET /api/circle/status`

### Recipient domain

- `GET /api/recipient/wallet`
- `POST /api/recipient/wallet/fund`
- `GET /api/recipient/convert`
- `POST /api/recipient/convert/lock`
- `POST /api/recipient/convert/execute`
- `GET /api/recipient/bills/billers`
- `GET /api/recipient/bills/saved`
- `POST /api/recipient/bills/save`
- `GET /api/recipient/bills/history`
- `POST /api/recipient/bills/pay`
- `GET /api/recipient/transfers/methods`
- `GET /api/recipient/transfers/history`
- `POST /api/recipient/transfers/send`
- `GET /api/recipient/statements`
- `POST /api/recipient/statements/export`

### Businesses

- `GET /api/businesses/discover`
- `GET /api/businesses/categories`
- `GET /api/businesses/paid`
- `GET /api/businesses/{profile_id}`
- `POST /api/businesses/chat/{business_profile_id}`
- `POST /api/businesses/pay`

### Notifications and magic links

- `GET /api/notifications/preferences`
- `PUT /api/notifications/preferences`
- `GET /api/notifications/status`
- Magic-link endpoints listed under Authentication.
- Notification services in `backend/services/notifications.py` support email/SMS behavior through configured providers.

### Plaid, Circle, PayMongo, and Netlify bridge

- Plaid FastAPI:
  - `GET /api/plaid/config`
  - `POST /api/plaid/link-token`
  - Legacy mock: `/api/plaid/mock/create-link-token`, `/api/plaid/mock/exchange`, `/api/plaid/mock/accounts`, `/api/plaid/mock/transactions`
- Circle FastAPI:
  - `POST /api/circle/create-wallet`
  - `POST /api/circle/mint-usdc`
  - `GET /api/circle/balance`
  - `GET /api/circle/status`
  - Legacy mock: `POST /api/circle/sendFunds`
- PayMongo/Netlify:
  - `/.netlify/functions/pbx-create-transfer`
  - `/.netlify/functions/create-gcash-payout`
  - `/.netlify/functions/quote-remittance`

### Administrative functions

- `GET /api/admin/roles`
- `GET /api/admin/users`
- `GET /api/admin/users/{user_id}`
- `GET /api/admin/wallets`
- `GET /api/admin/ledger`
- `GET /api/admin/ledger-tx`
- `GET /api/admin/transfers/{tx_id}`
- `GET /api/admin/audit-logs`
- `GET /api/admin/reconciliation/wallet/{user_id}`
- `GET /api/admin/integrity/transfer/{tx_id}`
- `POST /api/admin/ops/resend-magic-link`
- `POST /api/admin/super/balance-adjustment`
- `POST /api/admin/mint`
- Leads admin: `GET /api/leads`

## E. Deployment audit

### Current deployment files

- `netlify.toml`
- `frontend/public/_redirects`
- `netlify/functions/*`
- `frontend/public/index.html`

### Root build command

`npm install && cd frontend && yarn install --frozen-lockfile && yarn build`

Issue: no committed lockfile was found, so frozen installs are not reproducible.

### Frontend build directory

`frontend/build`

### Netlify publish directory

`frontend/build`

### Netlify functions directory

`netlify/functions`

### Redirect rules

`frontend/public/_redirects` maps:

- Auth: `/api/auth/login`, `/api/auth/me`, `/api/auth/register`
- Plaid: `/api/plaid/link-token`, `/api/plaid/exchange-token`, `/api/plaid/status`
- Circle: `/api/circle/status`, `/api/circle/webhook`, `/api/circle/balance`
- Banks: linked/link/add-money/withdraw/delete
- Add Money: `/api/add-money`
- Wallet: `/api/wallet/balance`, `/api/wallet/balances`
- Recipient legacy: wallet/statements/transfers/convert/bills
- FX: convert/quote
- SPA fallback: `/* /index.html 200`

Important gap: `_redirects` does not map FastAPI social/profile/user/business/notifications/internal/admin endpoints. Production must set `REACT_APP_BACKEND_URL` or add equivalent API routing.

### SPA fallback rules

The fallback exists and should allow refresh on valid frontend routes. API redirects must remain above the fallback.

### Environment-variable usage

Production deployment must define API base URLs and integration credentials deliberately. Defaults and missing env vars can silently activate mock behavior.

### Whether production could be deploying an old or simplified build

Risks:

- `frontend/src/App.js` is a simplified legacy router. Current `frontend/src/index.js` imports `App.jsx`, but accidental entry changes could deploy the wrong app.
- Netlify build depends on `frontend/build`; dashboard overrides could point elsewhere.
- `_redirects` only covers a partial API surface, so a deployed frontend can look current while core social APIs hit a stale external FastAPI host.
- `frontend/public/pbx-demo.html` bypasses the React app and could be mistaken for a product page.

### Whether the current GitHub branch matches intended source

The work is on `cursor/pbx-rebuild-audit-brand-80a3`, created from the base branch as requested. The base branch should remain the PR target unless otherwise specified.

## Testing inventory

Existing Python tests:

- `tests/test_recipient_api.py`
- `tests/test_recipient_mongodb.py`
- `tests/test_bank_management.py`
- `tests/test_social_api.py`
- `tests/test_social_send_receive.py`
- `tests/test_invite_viral_loop.py`
- `tests/test_quick_add_api.py`
- `tests/test_add_recipient_api.py`
- `tests/test_internal_transfers.py`
- `tests/test_profiles_businesses_api.py`
- `tests/test_user_role_api.py`
- `tests/test_email_persistence.py`
- `tests/test_notifications_magic_link.py`
- `tests/test_phone_input_and_fund_wallet.py`
- `tests/test_ui_merge_navigation.py`
- `tests/test_ledger_hardening.py`
- `backend/tests/test_p1_wallet_fx.py`

Frontend has a test script but no audited frontend test files.

## Verification performed during this audit

- `yarn build` in `frontend/`: passed after installing the existing frontend dependencies with `yarn install --frozen-lockfile`.
- `python3 -m pytest tests backend/tests` without `REACT_APP_BACKEND_URL`: invalid run; several test files construct relative request URLs such as `/api/social/friends/request`, which `requests` cannot execute without a scheme/host.
- `REACT_APP_BACKEND_URL=https://pbx-social.preview.emergentagent.com python3 -m pytest tests backend/tests`: completed with `19 passed, 261 failed, 8 skipped, 13 errors`. Representative failures were 404 responses from the configured remote target, not frontend compile failures.
- Direct probes to the configured remote target returned 404 for `/api/health`, `/api/internal/lookup`, `/api/profiles/search/people?q=test`, and `/api/auth/register`.

Interpretation: the current test suite requires a reachable FastAPI backend URL exposing the full `/api/*` surface. The audited preview URL currently does not expose that surface, which reinforces the deployment finding that production/static Netlify routing and FastAPI backend routing are split.

## Restoration priorities

1. Keep FastAPI and ledger behavior intact.
2. Fix stale and overly broad routes before major UI moves.
3. Introduce PBX Exchange brand tokens and logo primitives centrally.
4. Consolidate shells and navigation.
5. Consolidate People and Pay flows around PBX users first.
6. Consolidate wallet/activity primitives and clearly label mock/sandbox integrations.
7. Add missing public pages and branded 404s.
8. Unify or explicitly route production API dependencies.

