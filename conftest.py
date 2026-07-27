"""Pytest defaults for local PBX Exchange verification.

Tests may still override ``REACT_APP_BACKEND_URL`` explicitly, but the default
should be the local FastAPI service used during restoration work rather than an
obsolete remote preview deployment.
"""
import os


os.environ.setdefault("REACT_APP_BACKEND_URL", "http://localhost:8000")

