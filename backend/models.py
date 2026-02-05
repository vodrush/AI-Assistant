"""
from pydantic import BaseModel


class UserCredentials(BaseModel):
    email: str
    password: str


UserRegister = UserCredentials
UserLogin = UserCredentials


class PromptRequest(BaseModel):
    text: str
