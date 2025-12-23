import uvicorn
from fastapi import FastAPI,Depends
from db import init_db
from schemas import PostCreate,UserCreate
from auth import register_user,login_user,validate_user
from services import get_from_db,create_to_db,delete_from_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
init_db()

@app.post("/register")
def register(user:UserCreate):
    register_user(user.user_id,user.password)
    access_token= login_user(user.user_id,user.password)
    return {"access_token": access_token, "token_type":"bearer"}

@app.post("/login")
def login(user:UserCreate):
    access_token= login_user(user.user_id,user.password)
    return {"access_token": access_token, "token_type":"bearer"}

@app.get("/posts")
def get_posts(user_id:str=Depends(validate_user)):
    return get_from_db()

@app.post("/create_post")
def create_post(post:PostCreate,user_id:str=Depends(validate_user)):
    return create_to_db(post.title,post.content,user_id)

@app.delete("/delete_post/{post_id}")
def delete_post(post_id:int,user_id:str=Depends(validate_user)):
    return delete_from_db(post_id,user_id)


if __name__=="__main__":
    uvicorn.run("main:app", host="0.0.0.0",port=8000, reload=True)