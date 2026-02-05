import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

from models import UserRegister, UserLogin, PromptRequest
from database import create_user, get_user_by_email, get_history, add_message, delete_history
from security import hash_password, verify_password, create_token, verify_token
from llm import ask_ai

load_dotenv()

app = FastAPI(title="AI Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant")
    
    token = auth_header.split(" ")[1]
    user_id = verify_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Token invalide ou expire")
    
    return user_id


@app.post("/api/auth/register")
def register(data: UserRegister):
    if get_user_by_email(data.email):
        raise HTTPException(status_code=400, detail="Email deja utilise")
    
    user = create_user(data.email, hash_password(data.password))
    return {"id": user["id"], "email": user["email"]}


@app.post("/api/auth/login")
def login(data: UserLogin):
    user = get_user_by_email(data.email)
    
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    return {"access_token": create_token(user["id"]), "token_type": "bearer"}


@app.post("/api/ai/ask")
def ask(prompt: PromptRequest, user_id: str = Depends(get_current_user)):
    add_message(user_id, "user", prompt.text)
    
    history = get_history(user_id)
    messages = [{"role": m["role"], "content": m["content"]} for m in history]
    
    response = ask_ai(messages)
    add_message(user_id, "assistant", response)
    
    return {"user_message": prompt.text, "ai_response": response}


@app.get("/api/history")
def history(user_id: str = Depends(get_current_user)):
    return {"messages": get_history(user_id)}


@app.delete("/api/history")
def clear_history(user_id: str = Depends(get_current_user)):
    delete_history(user_id)
    return {"message": "Historique supprime"}


@app.get("/")
def root():
    return {"message": "API AI Assistant"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
