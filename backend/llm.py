import requests
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL")

def appeler_ia(messages):
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    
    data = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 2000
    }
    
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        result = response.json()
        
        if 'choices' in result and len(result['choices']) > 0:
            content = result['choices'][0]['message'].get('content', '')
            
            if not content:
                return "Désolé, je n'ai pas pu générer de réponse. Essayez un autre modèle."
            
            return content
        else:
            return "Erreur: Réponse vide du modèle"
    else:
        print(f"ERREUR OPENROUTER: {response.status_code}")
        print(response.text)
        return f"Erreur OpenRouter: {response.status_code}"