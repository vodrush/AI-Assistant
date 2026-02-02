AI Assistant Backend

C'est une API pour une application où l'IA peut discuter avec les utilisateurs.

COMMENT INSTALLER

1. Avoir Python 3.8+ sur l'ordinateur

2. Ouvrir un terminal dans le dossier backend

3. Créer un environnement virtuel avec: python -m venv venv

4. Activer l'environnement: venv\Scripts\activate

5. Installer les packages: pip install -r requirements.txt

6. Créer un fichier .env avec:
SECRET_KEY=test_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENROUTER_API_KEY=ta_clé_openrouter
OPENROUTER_MODEL=mistralai/mistral-7b-instruct

7. Lancer le serveur: python main.py

8. Aller sur http://localhost:8000/index.html pour tester

LES FICHIERS

main.py - Le serveur FastAPI avec toutes les routes
models.py - Les structures de données avec Pydantic
database.py - Gestion de la base de données avec TinyDB
security.py - Authentification avec bcrypt et JWT
llm.py - Appel à l'API OpenRouter pour l'IA
index.html - Page HTML/JavaScript pour tester l'app
test.py - Tests pour vérifier que tout fonctionne

CE QUE ÇA FAIT

- Les utilisateurs peuvent s'inscrire et se connecter
- L'API vérifie le password et donne un token JWT
- Avec ce token, l'utilisateur peut envoyer des messages à l'IA
- L'IA répond via OpenRouter
- Les messages sont sauvegardés dans la base de données
- L'utilisateur peut voir tout son historique de messages

COMMENT ÇA MARCHE TECHNIQUEMENT

- FastAPI fait tourner le serveur sur http://localhost:8000
- Tous les passwords sont hashés avec bcrypt avant d'être sauvegardés
- Les tokens JWT expirent après 30 minutes
- La base de données est en JSON dans db.json (TinyDB)
- L'API OpenRouter est appelée pour chaque message envoyé à l'IA

TESTER

Pour voir la documentation: http://localhost:8000/docs
Pour lancer les tests: python test.py

C'est tout ce qu'il faut savoir pour faire fonctionner le projet.

