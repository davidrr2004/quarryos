# QuarryOS — Operations Management System

A production-ready full-stack web application for quarry worksite operations management. Built with **Next.js 16** (frontend), **FastAPI** (backend), and **PostgreSQL** (database).

## Architecture

```
quarryos/
├── frontend/           # Next.js 16 (React 19, Tailwind CSS 4)
│   ├── app/
│   │   ├── (protected)/   # Auth-guarded pages
│   │   │   ├── jobs/      # Job batch management & worker assignments
│   │   │   ├── work-status/ # Real-time worker return tracking
│   │   │   ├── workers/   # Worker CRUD & profiles
│   │   │   ├── finance/   # Payments, expenses, revenue
│   │   │   ├── fleet/     # Vehicle management & costs
│   │   │   └── reports/   # Analytics, charts, exports
│   │   ├── login/         # JWT authentication
│   │   └── lib/           # API client & auth context
│   └── ...
├── backend/            # FastAPI (Python 3.12)
│   ├── app/
│   │   ├── api/v1/        # REST endpoints
│   │   ├── core/          # Config, security
│   │   ├── crud/          # Database operations
│   │   ├── db/            # SQLAlchemy session
│   │   ├── models/        # ORM models (8 tables)
│   │   ├── schemas/       # Pydantic validation
│   │   └── services/      # Business logic
│   ├── alembic/           # Database migrations
│   └── init_db.py         # Seed data script
└── README.md
```

## Features

- **Job Management**: Create batches, assign workers to vehicles, track runs
- **Worker Tracking**: Real-time return status (pending/returned/issue)
- **Fleet Management**: Vehicle inventory with maintenance status and cost logging
- **Finance**: Revenue tracking, driver payments, expense breakdowns
- **Reports**: Performance analytics with charts (Recharts), CSV/PDF export
- **Auth**: JWT-based authentication with role-based access (admin/dispatcher/viewer)

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.12+
- PostgreSQL 15+

### Database Setup

```bash
# Create database
createdb quarryos
# Or with psql:
psql -c "CREATE DATABASE quarryos;"
```

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Initialize database & seed data
python init_db.py

# Run migrations (for future schema changes)
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Credentials

| Role       | Email                    | Password       |
|------------|--------------------------|----------------|
| Admin      | admin@quarryos.com       | admin123       |
| Dispatcher | dispatcher@quarryos.com  | dispatcher123  |

## API Documentation

With the backend running, visit:
- **Swagger UI**: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- **ReDoc**: [http://localhost:8000/api/redoc](http://localhost:8000/api/redoc)

### API Endpoints

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | `/api/v1/login/access-token`      | Get JWT token            |
| GET    | `/api/v1/login/me`                | Current user info        |
| GET    | `/api/v1/dashboard/stats`         | Dashboard statistics     |
| GET    | `/api/v1/workers`                 | List workers             |
| POST   | `/api/v1/workers`                 | Create worker            |
| PATCH  | `/api/v1/workers/{id}`            | Update worker            |
| DELETE | `/api/v1/workers/{id}`            | Soft-delete worker       |
| GET    | `/api/v1/vehicles`                | List vehicles            |
| POST   | `/api/v1/vehicles`                | Create vehicle           |
| PATCH  | `/api/v1/vehicles/{id}`           | Update vehicle           |
| DELETE | `/api/v1/vehicles/{id}`           | Soft-delete vehicle      |
| GET    | `/api/v1/wage-rates`              | List wage rates          |
| POST   | `/api/v1/wage-rates`              | Create wage rate         |
| GET    | `/api/v1/batches`                 | List job batches         |
| POST   | `/api/v1/batches`                 | Create batch             |
| PATCH  | `/api/v1/batches/{id}`            | Update batch status      |
| GET    | `/api/v1/assignments`             | List assignments         |
| POST   | `/api/v1/assignments`             | Create assignment        |
| PATCH  | `/api/v1/assignments/{id}`        | Update runs/status       |
| GET    | `/api/v1/payments`                | List worker payments     |
| POST   | `/api/v1/payments`                | Record payment           |
| GET    | `/api/v1/costs`                   | List vehicle costs       |
| POST   | `/api/v1/costs`                   | Log vehicle cost         |

All authenticated endpoints return a standardized response:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

## Design System

- **Primary**: Slate-900 (`#1e293b`) — professional, dark neutral
- **Surface**: Slate-50 (`#f8fafc`) — clean, light background
- **Typography**: Inter (sans-serif), Roboto Mono (monospace)
- **Border Radius**: 12px (cards), 8px (fields), 6px (selectors)
- **Shadows**: Subtle, minimal (`0 1px 3px rgba(0,0,0,0.06)`)

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | Next.js 16, React 19, Tailwind CSS 4 |
| Backend    | FastAPI, SQLAlchemy, Pydantic |
| Database   | PostgreSQL, Alembic         |
| Auth       | JWT (python-jose, bcrypt)   |
| Charts     | Recharts                    |
