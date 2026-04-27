from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.core.security import create_access_token
from app.crud.crud_user import user_crud
from app.schemas.token import Token
from app.schemas.user import User as UserSchema
from app.schemas.response import ApiResponse
from app.models.user import User

router = APIRouter()


@router.post("/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    user = user_crud.authenticate(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    return {
        "access_token": create_access_token(subject=str(user.id)),
        "token_type": "bearer",
    }


@router.get("/me", response_model=ApiResponse)
def read_current_user(
    current_user: User = Depends(get_current_user),
):
    return ApiResponse(data=UserSchema.model_validate(current_user))
