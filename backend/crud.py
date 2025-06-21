# crud.py - Improved version
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import SessionLocal, engine
import models, schemas

def create_tables():
    """Create all tables in the database"""
    models.Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_by_email(db: Session, email: str):
    """Get user by email"""
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Create a new user"""
    # Check if user with this email already exists
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise ValueError(f"User with email {user.email} already exists")
    
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise ValueError("Email already exists")

def get_user(db: Session, user_id: int):
    """Get user by ID"""
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Get all users with pagination"""
    return db.query(models.User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, user_update: schemas.UserCreate):
    """Update user"""
    db_user = get_user(db, user_id)
    if db_user:
        db_user.name = user_update.name
        db_user.email = user_update.email
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    """Delete user"""
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user