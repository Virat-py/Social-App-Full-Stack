from db import get_connection
from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import HTTPException

def get_from_db():
    conn=get_connection()
    cursor=conn.cursor()
    cursor.execute("SELECT * FROM posts ORDER BY id DESC")
    data=cursor.fetchall()
    conn.close()
    return [dict(row) for row in data]

def create_to_db(title, content, user_id):
    conn = get_connection()
    cursor = conn.cursor()

    created_at = datetime.now().strftime("%Y-%m-%d %H:%M")

    cursor.execute(
        """
        INSERT INTO posts (user_id, title, content, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (user_id, title, content, created_at)
    )
    conn.commit()

    post_id = cursor.lastrowid

    cursor.execute(
        "SELECT id, title, content, user_id, created_at FROM posts WHERE id=?",
        (post_id,)
    )
    post = cursor.fetchone()
    conn.close()

    return dict(post)

def delete_from_db(post_id: int, user_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM posts WHERE id = ? AND user_id = ?",
        (post_id, user_id)
    )

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(
            status_code=404,
            detail="Post not found or not authorized"
        )

    conn.commit()
    conn.close()
        
    