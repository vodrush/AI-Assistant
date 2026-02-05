import os
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY non definie dans .env")

ALGORITHM = os.getenv("ALGORITHM", "HS256")
TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


def hash_password(password):
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    return hashed.decode()


def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_token(user_id):
    expiration = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    payload = {'user_id': user_id, 'exp': expiration}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get('user_id')
    except JWTError:
        return None
