from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, require_dispatcher
from app.crud.crud_job_batch import job_batch_crud
from app.schemas.job_batch import JobBatchCreate, JobBatchUpdate, JobBatchOut
from app.schemas.response import ApiResponse
from app.models.user import User
from app.models.job_batch import BatchStatus

router = APIRouter()


@router.get("", response_model=ApiResponse)
def list_batches(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[BatchStatus] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    batches = job_batch_crud.get_multi(db, skip=skip, limit=limit, status=status_filter)
    return ApiResponse(data=[JobBatchOut.model_validate(b) for b in batches])


@router.get("/{batch_id}", response_model=ApiResponse)
def get_batch(
    batch_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    batch = job_batch_crud.get(db, batch_id=batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return ApiResponse(data=JobBatchOut.model_validate(batch))


@router.post("", response_model=ApiResponse, status_code=status.HTTP_201_CREATED)
def create_batch(
    batch_in: JobBatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    batch = job_batch_crud.create(db, obj_in=batch_in, created_by=current_user.id)
    return ApiResponse(data=JobBatchOut.model_validate(batch))


@router.patch("/{batch_id}", response_model=ApiResponse)
def update_batch(
    batch_id: UUID,
    batch_in: JobBatchUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dispatcher),
):
    batch = job_batch_crud.get(db, batch_id=batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    batch = job_batch_crud.update(db, db_obj=batch, obj_in=batch_in)
    return ApiResponse(data=JobBatchOut.model_validate(batch))
