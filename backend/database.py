from tinydb import TinyDB, Query
from datetime import datetime
from uuid import uuid4

db = TinyDB('db.json')
users_table = db.table('users')
conversations_table = db.table('conversations')
User = Query()
Conversation = Query()

def create_user(email, hashed_password):
    user_id = str(uuid4())
    user = {
        'id': user_id,
        'email': email,
        'hashed_password': hashed_password,
        'created_at': datetime.now().isoformat()
    }
    users_table.insert(user)
    return user

def get_user_by_email(email):
    result = users_table.search(User.email == email)
    return result[0] if result else None

def get_user_by_id(user_id):
    result = users_table.search(User.id == user_id)
    return result[0] if result else None

def add_message_to_conversation(user_id, role, content):
    timestamp = datetime.now().isoformat()
    message = {
        'id': str(uuid4()),
        'role': role,
        'content': content,
        'timestamp': timestamp
    }
    
    result = conversations_table.search(Conversation.user_id == user_id)
    
    if result:
        conversation = result[0]
        if 'messages' not in conversation:
            conversation['messages'] = []
        conversation['messages'].append(message)
        conversations_table.update(conversation, Conversation.user_id == user_id)
    else:
        conversation = {
            'user_id': user_id,
            'messages': [message],
            'created_at': datetime.now().isoformat()
        }
        conversations_table.insert(conversation)

def get_conversation_history(user_id):
    result = conversations_table.search(Conversation.user_id == user_id)
    if result and 'messages' in result[0]:
        return result[0]['messages']
    return []

def delete_conversation(user_id):
    removed = conversations_table.remove(Conversation.user_id == user_id)
    return len(removed) > 0
    return False
    removed = conversations_table.remove(Conversation.user_id == user_id)
    return len(removed) > 0
