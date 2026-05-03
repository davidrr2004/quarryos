from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_dispatcher
from app.crud.crud_worker_payment import worker_payment_crud
from app.crud.crud_worker import worker_crud
from app.schemas.worker_payment import WorkerPaymentCreate, WorkerPaymentUpdate, WorkerPaymentOut
from app.schemas.response import ApiResponse
from app.models.user import User

router = APIRouter()


@router.get("", response_model=ApiResponse)
def list_payments(
    skip: int = 0,
    limit: int = 100,
    worker_id: Optional[UUID] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payments = worker_payment_crud.get_multi(db, skip=skip, limit=limit, worker_id=worker_id)
    return ApiResponse(data=[WorkerPaymentOut.model_validate(p) for p in payments])


@router.get("/{payment_id}", response_model=ApiResponse)
def get_payment(
    payment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = worker_payment_crud.get(db, payment_id=payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return ApiResponse(data=WorkerPaymentOut.model_validate(payment))


@router.post("", response_model=ApiResponse, status_code=201)
def create_payment(
    payment_in: WorkerPaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    worker = worker_crud.get(db, worker_id=payment_in.worker_id)
    if not worker or not worker.is_active:
        raise HTTPException(status_code=404, detail="Worker not found or inactive")
    payment = worker_payment_crud.create(db, obj_in=payment_in, paid_by=current_user.id)
    return ApiResponse(data=WorkerPaymentOut.model_validate(payment))


@router.patch("/{payment_id}", response_model=ApiResponse)
def update_payment(
    payment_id: UUID,
    payment_in: WorkerPaymentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    payment = worker_payment_crud.get(db, payment_id=payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    payment = worker_payment_crud.update(db, db_obj=payment, obj_in=payment_in)
    return ApiResponse(data=WorkerPaymentOut.model_validate(payment))
