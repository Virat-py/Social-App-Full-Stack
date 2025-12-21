from pydantic import BaseModel

class PostCreate(BaseModel):
    title: str
    content: str
        
class UserCreate(BaseModel):
    user_id:str
    password:str