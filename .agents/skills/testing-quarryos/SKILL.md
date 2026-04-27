# QuarryOS Local Testing

## Prerequisites

- PostgreSQL 14+
- Python 3.10+ with pip
- Node.js 18+ with npm

## Setup

### 1. PostgreSQL

If PostgreSQL is not running:
```bash
sudo pg_ctlcluster 14 main start
```

Create the database:
```bash
sudo -u postgres createuser quarryos --createdb
sudo -u postgres psql -c "ALTER USER quarryos WITH PASSWORD 'quarryos';"
sudo -u postgres createdb quarryos -O quarryos
```

### 2. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt -q
python init_db.py          # Creates tables + seeds sample data
uvicorn app.main:app --reload --port 8000
```

Verify: `curl http://localhost:8000/api/health` → `{"status":"ok","service":"quarryos"}`

### 3. Frontend (Next.js 16)

```bash
cd frontend
npm install
npm run dev                # Starts on :3000
```

Build check: `npm run build` (no separate lint command configured)

## Devin Secrets Needed

No external secrets required. The app uses local PostgreSQL with hardcoded dev credentials.

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@quarryos.com` | `admin123` |
| Dispatcher | `dispatcher@quarryos.com` | `dispatcher123` |

## Key Test Flows

### Auth Flow
1. Clear `localStorage` in browser
2. Navigate to any protected route (e.g., `/jobs`) → should redirect to `/login`
3. Enter invalid credentials → red error banner "Incorrect email or password"
4. Enter valid admin credentials → redirect to `/jobs` with JWT in localStorage key `quarryos_token`

### UI Verification
- 6 pages via bottom nav: Jobs, Work Status, Workers, Finance, Fleet, Reports
- Color palette should be slate-based (primary `#1e293b`), NOT royal blue (`#4169E1`)
- Avatar circles on Workers page should be monochrome slate gradients
- Border radius on cards should be 12px (not 24px)

### Backend API
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/login/access-token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@quarryos.com&password=admin123" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# List workers
curl -s http://localhost:8000/api/v1/workers -H "Authorization: Bearer $TOKEN"

# Dashboard stats
curl -s http://localhost:8000/api/v1/dashboard/stats -H "Authorization: Bearer $TOKEN"
```

All API responses use envelope: `{"success": bool, "data": ..., "error": ...}`

## Known Issues / Gotchas

- **Hydration mismatch**: If `useSyncExternalStore` in `auth-context.tsx` uses the same snapshot function for server and client, a hydration error will appear as "1 Issue" badge in dev mode. The fix is to use a separate `getServerSnapshot()` that returns `{ user: null, loading: true }`.
- **Port conflicts**: If port 3000 or 8000 is already in use, kill the existing process first. Next.js will suggest an alternative port but might fail if another `next dev` is running.
- **PostgreSQL permission errors**: The `could not change directory to "/home/ubuntu": Permission denied` warnings from `sudo -u postgres` are harmless — the commands still succeed.
- **AGENTS.md warning**: Next.js 16 has breaking changes from standard training data. Check `node_modules/next/dist/docs/` before writing frontend code.
- **No CI configured**: The repo has no GitHub Actions CI. Verify builds locally with `npm run build`.
- **Frontend pages use mock data**: Pages display static/mock data. The API layer (`lib/api.ts`) and all backend endpoints are ready, but pages are not yet connected to live API calls.
