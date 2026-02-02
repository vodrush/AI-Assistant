from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from models import UserRegister, UserLogin, PromptRequest
from database import create_user, get_user_by_email, get_conversation_history, add_message_to_conversation
from security import hash_password, verify_password, create_access_token, verify_access_token

app = FastAPI(title="AI Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant")
    
    token = auth_header.split(" ")[1]
    user_id = verify_access_token(token)
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")
    
    return user_id


@app.post("/api/auth/register")
def register(user_data: UserRegister):
    user_existe = get_user_by_email(user_data.email)
    if user_existe:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
    password_hash = hash_password(user_data.password)
    user = create_user(user_data.email, password_hash)
    
    return {"id": user["id"], "email": user["email"]}

@app.post("/api/auth/login")
def login(user_data: UserLogin):
    user = get_user_by_email(user_data.email)
    if not user:
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    if not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    token = create_access_token(user["id"])
    return {"access_token": token, "token_type": "bearer"}

@app.post("/api/ai/ask")
def ask_ai(prompt: PromptRequest, user_id: str = Depends(get_current_user)):
    add_message_to_conversation(user_id, "user", prompt.text)
    ai_response = "Réponse IA simulée"
    add_message_to_conversation(user_id, "assistant", ai_response)
    
    return {
        "user_message": prompt.text,
        "ai_response": ai_response
    }

@app.get("/api/history")
def get_history(user_id: str = Depends(get_current_user)):
    messages = get_conversation_history(user_id)
    return {"messages": messages}

@app.get("/")
def read_root():
    return {"message": "API AI Assistant"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)