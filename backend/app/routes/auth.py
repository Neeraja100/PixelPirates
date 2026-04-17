import hashlib
import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.database import SessionLocal
from app.models.db_models import UserModel
from app.services.auth_service import create_access_token

router = APIRouter(tags=["auth"])


class SignUpRequest(BaseModel):
    email: str = Field(pattern=r"^[^@]+@[^@]+\.[^@]+$", max_length=320)
    password: str = Field(min_length=6, max_length=128)
    name: str = Field(default="", max_length=100)


class SignInRequest(BaseModel):
    email: str = Field(pattern=r"^[^@]+@[^@]+\.[^@]+$", max_length=320)
    password: str = Field(min_length=1, max_length=128)


class AuthResponse(BaseModel):
    token: str
    user_id: str
    email: str
    name: str


def _hash_password(password: str) -> str:
    """PBKDF2-HMAC-SHA256 with random salt — no external dependency."""
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 260000)
    return salt.hex() + ":" + key.hex()


def _verify_password(plain: str, stored: str) -> bool:
    try:
        salt_hex, key_hex = stored.split(":")
        salt = bytes.fromhex(salt_hex)
        key = hashlib.pbkdf2_hmac("sha256", plain.encode(), salt, 260000)
        return key.hex() == key_hex
    except Exception:
        return False


@router.post("/auth/signup", response_model=AuthResponse)
def signup(payload: SignUpRequest):
    db = SessionLocal()
    try:
        existing = db.query(UserModel).filter(UserModel.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=409, detail="An account with this email already exists.")

        user = UserModel(
            email=payload.email,
            hashed_password=_hash_password(payload.password),
            name=payload.name or payload.email.split("@")[0],
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token(user.id, user.email)
        return AuthResponse(token=token, user_id=user.id, email=user.email, name=user.name or "")
    finally:
        db.close()


@router.post("/auth/signin", response_model=AuthResponse)
def signin(payload: SignInRequest):
    db = SessionLocal()
    try:
        user = db.query(UserModel).filter(UserModel.email == payload.email).first()
        if not user or not _verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect email or password.")

        token = create_access_token(user.id, user.email)
        return AuthResponse(token=token, user_id=user.id, email=user.email, name=user.name or "")
    finally:
        db.close()


@router.get("/auth/me")
def get_me(token: str):
    from app.services.auth_service import decode_token
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    return {"user_id": payload["sub"], "email": payload["email"]}
