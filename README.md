# PBX Exchange

PBX Exchange is a social wallet and cross-border payment network for Filipinos,
their families, and their businesses.

## Local development

### 1. Start MongoDB

The FastAPI backend requires MongoDB and performs a real ping during startup.
Install MongoDB locally or run a local MongoDB-compatible service, then confirm:

```bash
mongosh --eval 'db.adminCommand({ ping: 1 })'
```

For a local manual MongoDB process:

```bash
mkdir -p .local/mongodb/data .local/mongodb/log
mongod \
  --dbpath .local/mongodb/data \
  --bind_ip 127.0.0.1 \
  --port 27017 \
  --logpath .local/mongodb/log/mongod.log \
  --logappend
```

### 2. Configure backend environment

```bash
cp backend/.env.example backend/.env
```

For basic local operation, ensure at least:

```bash
MONGODB_URI=mongodb://localhost:27017
DB_NAME=pbx_exchange_dev
JWT_SECRET=replace-with-a-long-local-development-secret
APP_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
```

### 3. Start the FastAPI backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Health check:

```bash
curl http://localhost:8000/api/health
```

Canonical API convention: backend routes are served under `/api/...`.

### 4. Seed development data

```bash
cd backend
source .venv/bin/activate
MONGODB_URI=mongodb://localhost:27017 DB_NAME=pbx_exchange_dev python scripts/seed_development.py
```

### 5. Start the frontend

```bash
cd frontend
yarn install --frozen-lockfile
yarn start
```

The CRA dev server runs on `http://localhost:3000` and proxies relative `/api`
requests to `http://localhost:8000`.

### 6. Run tests

```bash
# Backend/integration tests against local FastAPI
REACT_APP_BACKEND_URL=http://localhost:8000 python3 -m pytest tests backend/tests

# Frontend production build
cd frontend
yarn build
```

External-provider tests should be skipped or treated as sandbox-only unless
Plaid, Circle, Twilio, Resend, PayMongo, and FX credentials are explicitly
configured.
