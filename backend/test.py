from database import create_user, get_user_by_email, get_user_by_id, add_message_to_conversation, get_conversation_history
from security import hash_password, verify_password, create_access_token, verify_access_token

print("=== TEST DATABASE ===")

print("\n1. Créer un utilisateur")
user = create_user("test_user@example.com", hash_password("password123"))
print(f"Utilisateur créé: {user}")

print("\n2. Chercher par email")
found_user = get_user_by_email("test_user@example.com")
print(f"Trouvé: {found_user}")

print("\n3. Chercher par ID")
found_by_id = get_user_by_id(user['id'])
print(f"Trouvé par ID: {found_by_id}")

print("\n=== TEST SECURITY ===")

print("\n4. Hasher et vérifier password")
password = "mon_password"
hashed = hash_password(password)
print(f"Hash: {hashed}")

is_correct = verify_password(password, hashed)
print(f"Password correct: {is_correct}")

is_wrong = verify_password("wrong_password", hashed)
print(f"Wrong password: {is_wrong}")

print("\n5. Créer et vérifier JWT")
token = create_access_token(user['id'])
print(f"Token créé: {token}")

user_id_from_token = verify_access_token(token)
print(f"User ID du token: {user_id_from_token}")

wrong_token_result = verify_access_token("token_invalide")
print(f"Token invalide: {wrong_token_result}")

print("\n=== TEST CONVERSATIONS ===")

print("\n6. Ajouter des messages")
add_message_to_conversation(user['id'], "user", "Bonjour!")
add_message_to_conversation(user['id'], "assistant", "Salut! Comment ça va?")
add_message_to_conversation(user['id'], "user", "Ça va bien merci!")

print("Messages ajoutés")

print("\n7. Récupérer l'historique")
historique = get_conversation_history(user['id'])
print(f"Historique ({len(historique)} messages):")
for msg in historique:
    print(f"  [{msg['role']}] {msg['content']}")

print("\n=== TOUS LES TESTS PASSÉS ===")
