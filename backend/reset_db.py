"""Reset database - drop all tables and re-seed with fresh data."""
import logging
from datetime import date
from decimal import Decimal

from app.db.session import engine, SessionLocal
from app.models.base import Base
from app.models.user import User, UserRole
from app.models.worker import Worker
from app.models.vehicle import Vehicle, VehicleType, VehicleStatus
from app.models.wage_rate import WageRate
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def reset_db():
    logger.info("=== FLUSHING DATABASE ===")
    
    logger.info("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    logger.info("Tables dropped.")
    
    logger.info("Creating fresh tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables created.")
    
    logger.info("Seeding fresh data...")
    db = SessionLocal()
    try:
        # Admin and dispatcher users
        admin = User(
            email="admin@quarryos.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            role=UserRole.owner,
        )
        dispatcher = User(
            email="dispatcher@quarryos.com",
            hashed_password=get_password_hash("dispatcher123"),
            full_name="Dispatcher User",
            role=UserRole.dispatcher,
        )
        db.add_all([admin, dispatcher])
        logger.info("  - Users created")

        # Workers
        workers = [
            Worker(name="Ahmad Raza", employee_id="EMP-001", phone="+60 12-334 9090"),
            Worker(name="Siti Nora", employee_id="EMP-002", phone="+60 19-774 2291"),
            Worker(name="Muthu Kumar", employee_id="EMP-003", phone="+60 16-800 4511"),
            Worker(name="Ravi Shankar", employee_id="EMP-004", phone="+60 11-220 9930"),
        ]
        db.add_all(workers)
        logger.info("  - Workers created (Ahmad, Siti, Muthu, Ravi)")

        # Vehicles
        vehicles = [
            Vehicle(plate_number="KL-2341", vehicle_type=VehicleType.pickup, status=VehicleStatus.working),
            Vehicle(plate_number="KL-3301", vehicle_type=VehicleType.truck, status=VehicleStatus.working),
            Vehicle(plate_number="KL-5590", vehicle_type=VehicleType.minivan, status=VehicleStatus.working),
            Vehicle(plate_number="KL-1142", vehicle_type=VehicleType.truck, status=VehicleStatus.working),
            Vehicle(plate_number="KL-7730", vehicle_type=VehicleType.pickup, status=VehicleStatus.maintenance),
            Vehicle(plate_number="KL-5510", vehicle_type=VehicleType.truck, status=VehicleStatus.working),
        ]
        db.add_all(vehicles)
        logger.info("  - Vehicles created (6 vehicles)")

        # Wage rates
        wage_rates = [
            WageRate(vehicle_type=VehicleType.truck, rate_per_run=Decimal("85.00"), effective_from=date(2026, 1, 1)),
            WageRate(vehicle_type=VehicleType.pickup, rate_per_run=Decimal("75.00"), effective_from=date(2026, 1, 1)),
            WageRate(vehicle_type=VehicleType.minivan, rate_per_run=Decimal("45.00"), effective_from=date(2026, 1, 1)),
        ]
        db.add_all(wage_rates)
        logger.info("  - Wage rates created")

        db.commit()
        logger.info("")
        logger.info("=== DATABASE RESET COMPLETE ===")
        logger.info("Login credentials:")
        logger.info("  admin@quarryos.com / admin123")
        logger.info("  dispatcher@quarryos.com / dispatcher123")
    finally:
        db.close()


if __name__ == "__main__":
    reset_db()
