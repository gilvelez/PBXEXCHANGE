"""
Authentication context helpers shared by legacy and JWT-backed routes.

Several PBX routes historically accepted ``X-Session-Token`` as a raw user id
for integration tests and early demos. The authenticated frontend now stores a
JWT in the same header. This helper preserves the raw-id behavior while
correctly resolving JWT-backed sessions.
"""
from typing import Optional
import os
import jwt
from fastapi import Request


JWT_SECRET = os.environ.get("JWT_SECRET", "pbx-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"


def _decode_user_id_from_jwt(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None
    return payload.get("user_id")


def get_request_user_id(request: Request) -> Optional[str]:
    """Return the authenticated user id from Bearer JWT or legacy raw token."""
    authorization = request.headers.get("Authorization") or request.headers.get("authorization")
    token = None

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()

    token = token or request.headers.get("X-Session-Token") or request.headers.get("x-session-token")
    if not token:
        return None

    jwt_user_id = _decode_user_id_from_jwt(token)
    if jwt_user_id:
        return jwt_user_id

    # Preserve legacy/test behavior where the token itself is the user id.
    return token[:36] if len(token) > 36 else token

