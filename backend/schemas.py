# schemas.py - Clean version
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    name: str
    email: str  # Consider using EmailStr for email validation

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True