from fastapi import APIRouter
from app.api.v1.login import router as login_router
from app.api.v1.endpoints.workers import router as workers_router
from app.api.v1.endpoints.vehicles import router as vehicles_router
from app.api.v1.endpoints.wage_rates import router as wage_rates_router
from app.api.v1.endpoints.job_batches import router as job_batches_router
from app.api.v1.endpoints.assignments import router as assignments_router
from app.api.v1.endpoints.payments import router as payments_router
from app.api.v1.endpoints.costs import router as costs_router
from app.api.v1.endpoints.dashboard import router as dashboard_router

api_router = APIRouter()

api_router.include_router(login_router, prefix="/login", tags=["auth"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(workers_router, prefix="/workers", tags=["workers"])
api_router.include_router(vehicles_router, prefix="/vehicles", tags=["vehicles"])
api_router.include_router(wage_rates_router, prefix="/wage-rates", tags=["wage-rates"])
api_router.include_router(job_batches_router, prefix="/batches", tags=["job-batches"])
api_router.include_router(assignments_router, prefix="/assignments", tags=["assignments"])
api_router.include_router(payments_router, prefix="/payments", tags=["payments"])
api_router.include_router(costs_router, prefix="/costs", tags=["costs"])
