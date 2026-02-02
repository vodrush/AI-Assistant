from tinydb import TinyDB
from datetime import datetime
from uuid import uuid4

db = TinyDB('db.json')

def create_user(email, hashed_password):
    user_id = str(uuid4())
    user = {
        'id': user_id,
        'email': email,
        'hashed_password': hashed_password,
        'created_at': datetime.now().isoformat()
    }
    db.insert(user)
    return user

def get_user_by_email(email):
    tous_les_docs = db.all()
    for doc in tous_les_docs:
        if doc.get('email') == email:
            return doc
    return None

def get_user_by_id(user_id):
    tous_les_docs = db.all()
    for doc in tous_les_docs:
        if doc.get('id') == user_id:
            return doc
    return None

def add_message_to_conversation(user_id, role, content):
    timestamp = datetime.now().isoformat()
    message = {
        'id': str(uuid4()),
        'role': role,
        'content': content,
        'timestamp': timestamp
    }
    
    tous_les_docs = db.all()
    trouve = False
    
    for doc in tous_les_docs:
        if doc.get('user_id') == user_id and doc.get('type') == 'conversation':
            if 'messages' not in doc:
                doc['messages'] = []
            doc['messages'].append(message)
            db.update(doc)
            trouve = True
            break
    
    if not trouve:
        conversation = {
            'type': 'conversation',
            'user_id': user_id,
            'messages': [message]
        }
        db.insert(conversation)

def get_conversation_history(user_id):
    tous_les_docs = db.all()
    for doc in tous_les_docs:
        if doc.get('user_id') == user_id and doc.get('type') == 'conversation':
            if 'messages' in doc:
                return doc['messages']
    return []
