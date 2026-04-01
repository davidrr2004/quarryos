# QuarryOS - Backend Product Requirements Document (PRD)

## 1. Project Overview
QuarryOS is a full-stack operations management system designed for quarry worksites. The backend serves as the single source of truth for managing vehicle fleets, dynamic worker assignments per dispatch batch, tracking runs, auto-calculating wages, and handling financial ledgers for workers and vehicles.

### Core Architecture
- **Framework:** FastAPI (Python)
- **Database:** PostgreSQL (Relational, strictly typed)
- **ORM:** SQLAlchemy (Synchronous)
- **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
- **Design Pattern:** Modular API Design (Routers -> Services -> Models -> DB)

## 2. Business Rules & Logic (The "Why")

### 2.1 Worker & Vehicle Dynamics
- **No Fixed Vehicles:** Workers are assigned a different vehicle every time they are dispatched.
- **Vehicle Availability:** A vehicle can only have **ONE** active assignment. Only vehicles with `status = "working"` can be assigned.
- **Soft Deletions:** Workers and vehicles are never formally deleted from the database to preserve historical financial records. Instead, `is_active` is toggled.

### 2.2 Wage Calculation Engine
- **Snapshot Pricing:** The wage for a run is determined strictly by the **Vehicle Type** at the moment the dispatcher assigns the worker.
- **Immutability:** Once an assignment is created, that `wage_per_run` is permanently locked. If the company changes future rates in the `wage_rates` table, old assignments retain their historical rate.
- **Calculation:** `total_earned` = `runs_completed * wage_per_run`.

### 2.3 The Dispatch Lifecycle
1. **Open:** Dispatcher creates a `JobBatch` defining a route and distance.
2. **Assigning:** Dispatcher assigns specific workers to specific vehicles for this batch.
3. **Locked:** The Dispatcher "Locks" the batch. The workers depart.
4. **Returning:** As workers return, the Dispatcher logs their `runs_completed`.
5. **Completed:** Once all workers in the batch have returned, the batch closes.

### 2.4 Financial Management
- Payments to workers are grouped additively. A single payment covers the worker's running balance, not individual job assignments.
- `remaining_balance` = `SUM(assignments.total_earned) - SUM(worker_payments.amount)`.

## 3. Database Schema Mapping
The PostgreSQL database consists of 8 core tables using `UUID` primary keys:
1. `users`: Administrative accounts (Owners, Dispatchers, Viewers).
2. `workers`: The physical workforce on-site.
3. `vehicles`: The fleet of trucks, pickups, and minivans.
4. `wage_rates`: The historical ledger of what a run costs per vehicle type.
5. `job_batches`: The overarching dispatch cycles.
6. `assignments`: The bridge table linking a worker, vehicle, and batch with a snapshotted wage.
7. `worker_payments`: Financial payouts to workers.
8. `vehicle_costs`: Expenses logged against vehicles (fuel, maintenance).

## 4. API Endpoints Structure
All API responses follow a strict JSON envelope structure to ensure frontend predictability:
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

- `/api/v1/auth`: JWT Login and user session validation.
- `/api/v1/workers`: CRUD operations and specific `/finance` endpoints.
- `/api/v1/vehicles`: CRUD and `/available` filtering.
- `/api/v1/wage-rates`: Reading and appending new rate structures.
- `/api/v1/batches`: Managing the dispatch lifecycle.
- `/api/v1/assignments`: Individual worker-to-vehicle tracking per batch.
- `/api/v1/dashboard`: Aggregated stats for the frontend UI.

## 5. Security & Access Control
- **Owner (Admin):** Full mutable access to all endpoints, including finance ledgers.
- **Dispatcher:** Access constrained to creating batches, managing active assignments, and marking returns.
- **Viewer:** Strictly read-only `GET` access for dashboards and reporting.

---
*Generated for QuarryOS Development Team based on Backend Spec v1.0*
