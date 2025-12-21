from db import get_connection
from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import HTTPException

def get_from_db():
    conn=get_connection()
    cursor=conn.cursor()
    cursor.execute("SELECT * FROM posts")
    data=cursor.fetchall()
    conn.close()
    return [dict(row) for row in data]

def create_to_db(title,content,user_id):
    conn=get_connection()
    cursor=conn.cursor()
    curr_time=datetime.now(ZoneInfo("Asia/Kolkata")).strftime("%H:%M %d/%m/%Y")
    cursor.execute("INSERT INTO posts (user_id,title,content,created_at) VALUES (?,?,?,?)",
                   (user_id,title,content,curr_time))
    conn.commit()
    conn.close()

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
        
    