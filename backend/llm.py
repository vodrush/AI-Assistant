import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = os.getenv("OPENROUTER_MODEL")
API_URL = "https://openrouter.ai/api/v1/chat/completions"
TIMEOUT = 30


def ask_ai(messages):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    
    data = {
        "model": MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 2000
    }
    
    try:
        response = requests.post(API_URL, json=data, headers=headers, timeout=TIMEOUT)
    except requests.exceptions.RequestException as e:
        return f"Erreur reseau: {e}"
    
    if response.status_code != 200:
        return f"Erreur API: {response.status_code}"
    
    result = response.json()
    choices = result.get('choices', [])
    
    if not choices:
        return "Erreur: Reponse vide du modele"
    
    content = choices[0].get('message', {}).get('content', '')
    return content or "Desole, je n ai pas pu generer de reponse."
