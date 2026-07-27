# Core Functional Verification

Date: 2026-07-27  
Local backend: `http://localhost:8000`  
Local database: MongoDB `pbx_database`  
Seed script: `backend/scripts/seed_development.py`

## Local verification summary

The local backend was started from the actual FastAPI app entry point:

```bash
cd backend
MONGODB_URI=mongodb://localhost:27017 \
DB_NAME=pbx_database \
JWT_SECRET=dev-jwt-secret \
APP_URL=http://localhost:3000 \
uvicorn server:app --host 0.0.0.0 --port 8000
```

`GET /api/health` returned `200` with MongoDB connected.

Seeded fictional users:

- Maria Santos: `maria.santos@example.com`
- Jose Reyes: `jose.reyes@example.com`
- Ana Cruz: `ana.cruz@example.com`
- Miguel Garcia: `miguel.garcia@example.com`

Shared local password: `PBXDevPass123!`

## Feature status table

| Feature | Local frontend | Local backend | Database | End-to-end result | Notes |
| ------- | -------------: | ------------: | -------: | ----------------: | ----- |
| Registration | Not run in browser | Passing | Passing | Passing via API | Existing `POST /api/auth/register` verified by route and test target; seeded login used for core run. |
| Login | Not run in browser | Passing | Passing | Passing via API | `POST /api/auth/login` returned JWT for seeded users. |
| Session restoration | Not run in browser | Passing | Passing | Passing via API | `GET /api/auth/me` returned current user using JWT. Browser refresh not manually verified in this phase. |
| People search | Not run in browser | Passing | Passing | Passing via API | Search by name/handle and profile-by-handle verified. |
| Friend requests | Not run in browser | Passing | Passing | Passing via API | Duplicate pending request prevention verified with Maria -> Ana. |
| Friends | Not run in browser | Passing | Passing | Passing via API | Maria/Jose seeded accepted friendship allowed conversation. |
| Blocking | Not run in browser | Partially passing | Partially passing | Not run | Existing `block` action exists; blocked interaction verification remains follow-up. |
| Conversation creation | Not run in browser | Passing | Passing | Passing via API | Maria/Jose conversation resolved successfully. |
| Text message | Not run in browser | Passing | Passing | Passing via API | Text send and history load verified. |
| PBX payment | Not run in browser | Passing | Passing | Passing via API | Maria -> Jose payment completed through ledger helper with idempotency replay. |
| Payment request | Not run in browser | Passing | Passing | Passing via API | Added create/action endpoints; accept completes ledger transfer; duplicate accept returns 409; decline works. |
| Wallet update | Not run in browser | Passing | Passing | Passing via API | Sender decreased and recipient increased by the payment amount. |
| Activity update | Not run in browser | Partially passing | Passing | Partially passing | Ledger entries and transactions exist; unified frontend activity feed remains incomplete. |
| Currency conversion | Not run in browser | Partially passing | Not run | Not run | Routes exist; FX provider not configured, mock fallback documented. |
| Add Money | Not run in browser | Mocked | Not run | Not run | Bank/Circle/add-money paths exist but are mock/stub/sandbox. |
| Withdraw | Not run in browser | Mocked | Not run | Not run | ACH withdraw route exists as stub; not production-ready. |
| External recipient | Not run in browser | Partially passing | Not run | Not run | Internal lookup/invite routes exist; full external payout not verified locally. |
| Business profile | Not run in browser | Passing | Passing | Passing via API | Fictional Luzon Bakery seeded and `/api/businesses/discover` returned 200. |

## Verified API workflow

The following local API workflow completed successfully:

1. Login Maria, Jose, and Ana through `POST /api/auth/login`.
2. Resolve Maria with `GET /api/auth/me`.
3. Search people by name and handle.
4. Resolve Jose by PBX handle.
5. Resolve Maria/Jose conversation.
6. Send a text message.
7. Load conversation history.
8. Read Maria and Jose wallet balances.
9. Send a PBX-to-PBX payment from Maria to Jose with an idempotency key.
10. Replay the same payment request with the same idempotency key and receive the original transaction result.
11. Confirm Maria balance decreased and Jose balance increased by the payment amount.
12. Create a Jose -> Maria payment request.
13. Accept it as Maria; server created a ledger-backed transfer.
14. Attempt duplicate accept and receive `409`.
15. Create a second Jose -> Maria payment request.
16. Decline it as Maria.
17. Verify duplicate pending friend request prevention.
18. Discover seeded business profiles.

Observed successful transaction ids:

- PBX payment: generated during local run.
- Accepted payment request: generated during local run.

## Chat implementation status

Chat is HTTP request/refresh based. Current implementation uses:

- `GET /api/social/conversations`
- `GET /api/social/conversations/{other_user_id}`
- `GET /api/social/messages/{conversation_id}`
- `POST /api/social/messages/send`
- `POST /api/social/payments/send-in-chat`
- `POST /api/social/payments/request-in-chat`
- `POST /api/social/payments/requests/action`

No WebSocket implementation was found or verified. Do not describe chat as realtime until polling/WebSocket behavior is implemented and tested.

## Mocked or sandbox integrations during verification

- Plaid: `MOCK`
- Circle: mock/sandbox-capable but no live credentials configured
- FX: fallback/mock rate when provider key is absent
- Add Money/Withdraw: bank routes are stubs for ACH movement
- Email/SMS: Resend/Twilio credentials absent, notification delivery not verified
- PayMongo/external payouts: not configured or verified

## Remaining blockers

1. Browser-level frontend verification still needs a running CRA dev server and manual/browser automation for refresh/session behavior.
2. The unified Activity surface is not yet connected to all ledger/payment-request records.
3. Blocking behavior exists but was not fully exercised against chat/payment prevention in this run.
4. Add Money, Withdraw, FX conversion, and external recipient payout remain mock/sandbox/stubbed unless provider credentials are configured.
5. Netlify production routing remains split; FastAPI-only routes need a production API host/proxy before production can rely on same-origin `/api/*`.

