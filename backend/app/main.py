import uvicorn
from fastapi import FastAPI,HTTPException
from app.db import init_db,get_connection
from app.schemas import PostCreate

app = FastAPI()
init_db()

@app.get("/get_data")
def get_posts(id: int | None = None):
    conn = get_connection()
    cursor = conn.cursor()

    if id is None:
        cursor.execute("SELECT * FROM posts")
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

    cursor.execute("SELECT * FROM posts WHERE id = ?", (id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Post not found")

    return dict(row)


@app.post("/create_post")
def create_post(post:PostCreate):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO posts (title, content) VALUES (?, ?)",
        (post.title, post.content)
    )
    conn.commit()
    conn.close()

    return {"message": "Post created"}

@app.delete("/delete_post")
def create_post(id:int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM posts WHERE id=?",
        (id,)
    )
    conn.commit()
    conn.close()

    return {"message": "Post deleted"}


