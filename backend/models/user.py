from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str
    hashed_password: str
    created_at: datetime