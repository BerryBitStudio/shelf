#!/usr/bin/env python3
"""Create a new user or list existing users."""

import sys
import getpass

import bcrypt

from db import init_db, SessionLocal
from models import User


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against a hash."""
    return bcrypt.checkpw(password.encode(), hashed.encode())


def main():
    init_db()

    if len(sys.argv) > 1 and sys.argv[1] == "list":
        session = SessionLocal()
        try:
            users = session.query(User).all()
            if not users:
                print("No users")
            for u in users:
                print(f"  User {u.id} (created {u.created_at})")
        finally:
            session.close()
        return

    if len(sys.argv) > 1:
        password = sys.argv[1]
    else:
        password = getpass.getpass("Enter password: ")
        confirm = getpass.getpass("Confirm password: ")
        if password != confirm:
            print("Passwords don't match")
            sys.exit(1)

    session = SessionLocal()
    try:
        # Check password is unique
        for user in session.query(User).all():
            if verify_password(password, user.password_hash):
                print("Password is already in use by another user")
                sys.exit(1)

        password_hash = hash_password(password)
        user = User(password_hash=password_hash)
        session.add(user)
        session.commit()
        session.refresh(user)
        print(f"User {user.id} created")
    finally:
        session.close()


if __name__ == "__main__":
    main()
