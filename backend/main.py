# main.py - Improved version
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Annotated
from sqlalchemy.orm import Session
from database import engine
import models, schemas, crud
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Create tables on startup with error handling
@app.on_event("startup")
async def startup_event():
    try:
        logger.info("Creating database tables...")
        models.Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully!")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(crud.get_db)):
    try:
        return crud.create_user(db=db, user=user)
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        raise HTTPException(status_code=400, detail="Error creating user")

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(crud.get_db)):
    try:
        users = crud.get_users(db, skip=skip, limit=limit)
        return users
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        raise HTTPException(status_code=500, detail="Error fetching users")

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(crud.get_db)):
    try:
        db_user = crud.get_user(db, user_id=user_id)
        if db_user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return db_user
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching user")

# Add a health check endpoint
@app.get("/health")
async def health_check():
    try:
        # Test database connection
        db = next(crud.get_db())
        db.execute("SELECT 1")
        db.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}