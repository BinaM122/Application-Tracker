from flask import jsonify, request
import logging
from firebase_admin import auth
from functools import wraps


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'missing header'}), 401
        
        token = auth_header.split(' ')[1]
        uid = verify_token_and_get_uid(token)

        if not uid:
            return jsonify({'error':'invalid UID'}), 401
        return f(uid, *args, **kwargs)
    return decorated

def verify_token_and_get_uid(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        logging.info(f"Successfully verified token for user: {uid}")
        return uid
    except Exception as e:
        logging.error(f"Error verifying Firebase ID token: {e}")
        return None
