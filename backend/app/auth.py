import sqlite3
from fastapi import HTTPException, Request
from jose import jwt, JWTError
from db import get_connection
from security import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)


def register_user(user_id: str, password: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (user_id, password_hash) VALUES (?, ?)",
            (user_id, hash_password(password))
        )
        conn.commit()
        conn.close()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(400, "Username already exists")


def login_user(user_id: str, password: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT user_id, password_hash FROM users WHERE user_id = ?",
        (user_id,)
    )
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(401, "User doesn't exist")
    elif not verify_password(password, row["password_hash"]):
        raise HTTPException(401,"Wrong password for given user")
    else:
        return create_access_token(row["user_id"])


def validate_user(request:Request):
    auth_header = request.headers.get("Authorization")
    # returns "Bearer db232irg72sVbBBs633vvjs..."

    if not auth_header:
        raise HTTPException(401, "Missing Authorization header")

    if not auth_header.startswith("Bearer "):
        raise HTTPException(401, "Invalid Authorization header")

    token = auth_header.split(" ")[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(401, "Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")
