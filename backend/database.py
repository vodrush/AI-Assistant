from tinydb import TinyDB, Query
from datetime import datetime
from uuid import uuid4

db = TinyDB('db.json')
users_table = db.table('users')
conversations_table = db.table('conversations')
User = Query()
Conversation = Query()


def create_user(email, hashed_password):
    user = {
        'id': str(uuid4()),
        'email': email,
        'hashed_password': hashed_password,
        'created_at': datetime.now().isoformat()
    }
    users_table.insert(user)
    return user


def get_user_by_email(email):
    return users_table.get(User.email == email)


def get_user_by_id(user_id):
    return users_table.get(User.id == user_id)


def add_message(user_id, role, content):
    message = {
        'id': str(uuid4()),
        'role': role,
        'content': content,
        'timestamp': datetime.now().isoformat()
    }
    
    conversation = conversations_table.get(Conversation.user_id == user_id)
    
    if conversation:
        messages = conversation.get('messages', [])
        messages.append(message)
        conversations_table.update({'messages': messages}, Conversation.user_id == user_id)
    else:
        conversations_table.insert({
            'user_id': user_id,
            'messages': [message],
            'created_at': datetime.now().isoformat()
        })


def get_history(user_id):
    conversation = conversations_table.get(Conversation.user_id == user_id)
    return conversation.get('messages', []) if conversation else []


def delete_history(user_id):
    conversations_table.remove(Conversation.user_id == user_id)
