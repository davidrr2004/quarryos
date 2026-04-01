from app.db.session import engine
from app.models.base import Base
from app.db.session import SessionLocal
from app.crud.crud_user import user_crud
from app.schemas.user import UserCreate
from app.models.user import UserRole
import app.models  # Import all models to register them with Base
import sys

def init():
    print("Dropping old tables (to convert to UUIDs)...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin_email = "admin@quarryos.com"
        user = user_crud.get_by_email(db, email=admin_email)
        if not user:
            print(f"Creating superuser {admin_email}...")
            user_in = UserCreate(
                email=admin_email,
                password="adminpassword123",
                full_name="System Administrator",
                role=UserRole.owner
            )
            user_crud.create(db, obj_in=user_in)
            print("Superuser created successfully.")
        else:
            print("Superuser already exists.")
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init()
    print("Database initialization completed.")
