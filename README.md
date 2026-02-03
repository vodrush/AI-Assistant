AI Assistant

Une app web pour discuter avec une IA. Il y a un backend Python et un frontend React.

INSTALLATION BACKEND

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Créer un fichier .env:
SECRET_KEY=test_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENROUTER_API_KEY=ta_clé
OPENROUTER_MODEL=mistralai/mistral-7b-instruct:free

Lancer: python main.py
Le serveur tourne sur http://localhost:8000

INSTALLATION FRONTEND

cd frontend
npm install
npm run dev
L'app s'ouvre sur http://localhost:5173

LES ROUTES API

POST /api/auth/register - Créer un compte
POST /api/auth/login - Se connecter
POST /api/ai/ask - Envoyer un message à l'IA
GET /api/history - Voir l'historique 

COMMENT ÇA MARCHE

1. L'utilisateur s'inscrit et se connecte
2. Il reçoit un token JWT
3. Il peut envoyer des messages à l'IA via le dashboard
4. Les messages sont sauvegardés dans la BDD
5. Il peut voir tout son historique

TECHNOS UTILISÉES

Backend: FastAPI, TinyDB, bcrypt, JWT
Frontend: React, axios, React Router
IA: OpenRouter API


