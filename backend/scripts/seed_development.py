#!/usr/bin/env python3
"""
Seed PBX Exchange local development data.

This script is idempotent for fixed development records. It upserts fictional
users/profiles/friendships/conversations and uses the existing ledger helper for
the completed PBX-to-PBX transfer.
"""
import asyncio
import os
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from database.connection import connect_to_mongo, close_mongo_connection  # noqa: E402
from routes.auth import hash_password  # noqa: E402
from utils.ledger import create_transfer_atomic, setup_ledger_indexes  # noqa: E402
from utils.admin import setup_audit_indexes  # noqa: E402


SEED_TAG = "pbx-development-seed"
DEV_PASSWORD = "PBXDevPass123!"


def now():
    return datetime.now(timezone.utc)


USERS = [
    {
        "user_id": "dev-maria-santos",
        "email": "maria.santos@example.com",
        "phone": "+14155550101",
        "display_name": "Maria Santos",
        "handle": "mariasantos",
        "country": "US",
        "role": "sender",
        "wallet": {"usd_balance": 1250.00, "php_balance": 8500.00, "usd": 1250.00, "php": 8500.00, "usdc": 0.0},
    },
    {
        "user_id": "dev-jose-reyes",
        "email": "jose.reyes@example.com",
        "phone": "+639171110001",
        "display_name": "Jose Reyes",
        "handle": "josereyes",
        "country": "PH",
        "role": "recipient",
        "wallet": {"usd_balance": 320.00, "php_balance": 18400.00, "usd": 320.00, "php": 18400.00, "usdc": 0.0},
    },
    {
        "user_id": "dev-ana-cruz",
        "email": "ana.cruz@example.com",
        "phone": "+639181110002",
        "display_name": "Ana Cruz",
        "handle": "anacruz",
        "country": "PH",
        "role": "recipient",
        "wallet": {"usd_balance": 180.00, "php_balance": 6400.00, "usd": 180.00, "php": 6400.00, "usdc": 0.0},
    },
    {
        "user_id": "dev-miguel-garcia",
        "email": "miguel.garcia@example.com",
        "phone": "+14155550104",
        "display_name": "Miguel Garcia",
        "handle": "miguelgarcia",
        "country": "US",
        "role": "sender",
        "wallet": {"usd_balance": 940.00, "php_balance": 2200.00, "usd": 940.00, "php": 2200.00, "usdc": 0.0},
    },
]

BUSINESS_OWNER = {
    "user_id": "dev-luzon-bakery-owner",
    "email": "owner@luzonbakery.example.com",
    "phone": "+639191110003",
    "display_name": "Luzon Bakery Owner",
    "handle": "luzonbakeryowner",
    "country": "PH",
    "role": "sender",
    "wallet": {"usd_balance": 500.00, "php_balance": 50000.00, "usd": 500.00, "php": 50000.00, "usdc": 0.0},
}

LEGACY_TEST_USERS = [
    {
        "user_id": "legacy-user-e8769e",
        "email": "user.e8769e@example.com",
        "phone": "+14155550999",
        "display_name": "Test User",
        "handle": "user_e8769e",
        "country": "US",
        "role": "sender",
        "wallet": {"usd_balance": 600.00, "php_balance": 0.00, "usd": 600.00, "php": 0.00, "usdc": 0.0},
    },
    {
        "user_id": "test-token-123-456-789-abc",
        "email": "recipient.fixture@example.com",
        "phone": "+14155550888",
        "display_name": "Recipient Fixture",
        "handle": "recipient_fixture",
        "country": "PH",
        "role": "recipient",
        "wallet": {"usd_balance": 100.00, "php_balance": 1000.00, "usd": 100.00, "php": 1000.00, "usdc": 0.0},
    },
    {
        "user_id": "sender-token-123-456-789",
        "email": "sender.fixture@example.com",
        "phone": "+14155550777",
        "display_name": "Sender Fixture",
        "handle": "sender_fixture",
        "country": "US",
        "role": "sender",
        "wallet": {"usd_balance": 100.00, "php_balance": 1000.00, "usd": 100.00, "php": 1000.00, "usdc": 0.0},
    },
]


async def upsert_users(db):
    password_hash = hash_password(DEV_PASSWORD)
    for user in [*USERS, BUSINESS_OWNER, *LEGACY_TEST_USERS]:
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {
                "$set": {
                    "user_id": user["user_id"],
                    "email": user["email"],
                    "phone": user["phone"],
                    "display_name": user["display_name"],
                    "role": user["role"],
                    "country": user["country"],
                    "password_hash": password_hash,
                    "seed_tag": SEED_TAG,
                    "updated_at": now(),
                },
                "$setOnInsert": {"created_at": now()},
            },
            upsert=True,
        )
        await db.wallets.update_one(
            {"user_id": user["user_id"]},
            {
                "$set": {
                    "user_id": user["user_id"],
                    "userId": user["user_id"],
                    **user["wallet"],
                    "demoSeeded": True,
                    "seed_tag": SEED_TAG,
                    "updated_at": now(),
                    "updatedAt": now(),
                },
                "$setOnInsert": {"created_at": now(), "createdAt": now()},
            },
            upsert=True,
        )


async def upsert_profiles(db):
    for user in [*USERS, *LEGACY_TEST_USERS]:
        await db.profiles.update_one(
            {"profile_id": f"profile-{user['user_id']}"},
            {
                "$set": {
                    "profile_id": f"profile-{user['user_id']}",
                    "user_id": user["user_id"],
                    "type": "personal",
                    "handle": user["handle"],
                    "display_name": user["display_name"],
                    "avatar_url": None,
                    "country": user["country"],
                    "bio": "Development test profile for PBX Exchange.",
                    "discoverable": True,
                    "seed_tag": SEED_TAG,
                    "updated_at": now(),
                },
                "$setOnInsert": {"created_at": now()},
            },
            upsert=True,
        )

    await db.profiles.update_one(
        {"profile_id": "profile-luzon-bakery"},
        {
            "$set": {
                "profile_id": "profile-luzon-bakery",
                "user_id": BUSINESS_OWNER["user_id"],
                "type": "business",
                "handle": "luzonbakery",
                "business_name": "Luzon Bakery",
                "category": "Food & Dining",
                "description": "Fictional Filipino bakery for local PBX development.",
                "logo_url": None,
                "verified": False,
                "seed_tag": SEED_TAG,
                "updated_at": now(),
            },
            "$setOnInsert": {"created_at": now()},
        },
        upsert=True,
    )


async def upsert_friendships(db):
    friendships = [
        ("fr-dev-maria-jose", "dev-maria-santos", "dev-jose-reyes", "accepted"),
        ("fr-dev-maria-ana", "dev-maria-santos", "dev-ana-cruz", "pending"),
        ("fr-dev-miguel-jose", "dev-miguel-garcia", "dev-jose-reyes", "accepted"),
    ]
    for friendship_id, requester, addressee, status in friendships:
        await db.friendships.update_one(
            {"friendship_id": friendship_id},
            {
                "$set": {
                    "friendship_id": friendship_id,
                    "requester_user_id": requester,
                    "addressee_user_id": addressee,
                    "status": status,
                    "seed_tag": SEED_TAG,
                    "updated_at": now(),
                },
                "$setOnInsert": {"created_at": now()},
            },
            upsert=True,
        )


async def upsert_conversation_and_messages(db):
    conversation_id = "conv-dev-maria-jose"
    await db.conversations.update_one(
        {"conversation_id": conversation_id},
        {
            "$set": {
                "conversation_id": conversation_id,
                "user1_id": "dev-maria-santos",
                "user2_id": "dev-jose-reyes",
                "last_message_at": now(),
                "seed_tag": SEED_TAG,
            },
            "$setOnInsert": {"created_at": now()},
        },
        upsert=True,
    )

    messages = [
        {
            "message_id": "msg-dev-001",
            "sender_user_id": "dev-maria-santos",
            "type": "text",
            "text": "Hi Jose, I sent this through PBX.",
            "created_at": now() - timedelta(minutes=20),
        },
        {
            "message_id": "msg-dev-002",
            "sender_user_id": "dev-jose-reyes",
            "type": "text",
            "text": "Thanks, Maria. I can see it here.",
            "created_at": now() - timedelta(minutes=18),
        },
    ]
    for message in messages:
        await db.messages.update_one(
            {"message_id": message["message_id"]},
            {
                "$set": {
                    **message,
                    "conversation_id": conversation_id,
                    "seed_tag": SEED_TAG,
                }
            },
            upsert=True,
        )

    tx_doc, _ = await create_transfer_atomic(
        db=db,
        from_user_id="dev-maria-santos",
        to_user_id="dev-jose-reyes",
        amount=25.00,
        currency="USD",
        note="Groceries for Sunday dinner",
        idempotency_key="seed-dev-maria-jose-payment",
        transfer_type="pbx_transfer",
        metadata={"conversation_id": conversation_id, "seed_tag": SEED_TAG, "source": "seed"},
    )
    await db.messages.update_one(
        {"message_id": "msg-dev-payment-001"},
        {
            "$set": {
                "message_id": "msg-dev-payment-001",
                "conversation_id": conversation_id,
                "sender_user_id": "dev-maria-santos",
                "type": "payment",
                "text": "Groceries for Sunday dinner",
                "payment": {
                    "tx_id": tx_doc["tx_id"],
                    "amount_usd": 25.00,
                    "status": "completed",
                    "sender_name": "Maria Santos",
                },
                "seed_tag": SEED_TAG,
                "created_at": now() - timedelta(minutes=12),
            }
        },
        upsert=True,
    )

    request_id = "preq-dev-jose-maria-001"
    await db.payment_requests.update_one(
        {"request_id": request_id},
        {
            "$set": {
                "request_id": request_id,
                "conversation_id": conversation_id,
                "requester_user_id": "dev-jose-reyes",
                "payer_user_id": "dev-maria-santos",
                "amount_usd": 15.00,
                "currency": "USD",
                "note": "Palengke vegetables",
                "status": "pending",
                "message_id": "msg-dev-request-001",
                "seed_tag": SEED_TAG,
                "updated_at": now(),
            },
            "$setOnInsert": {"created_at": now()},
        },
        upsert=True,
    )
    await db.messages.update_one(
        {"message_id": "msg-dev-request-001"},
        {
            "$set": {
                "message_id": "msg-dev-request-001",
                "conversation_id": conversation_id,
                "sender_user_id": "dev-jose-reyes",
                "type": "payment_request",
                "text": "Palengke vegetables",
                "payment_request": {
                    "request_id": request_id,
                    "amount_usd": 15.00,
                    "status": "pending",
                    "requester_user_id": "dev-jose-reyes",
                    "payer_user_id": "dev-maria-santos",
                    "requester_name": "Jose Reyes",
                },
                "seed_tag": SEED_TAG,
                "created_at": now() - timedelta(minutes=5),
            }
        },
        upsert=True,
    )


async def upsert_activity_records(db):
    await db.transactions.update_one(
        {"transaction_id": "txn-dev-maria-add-money"},
        {
            "$set": {
                "transaction_id": "txn-dev-maria-add-money",
                "userId": "dev-maria-santos",
                "user_id": "dev-maria-santos",
                "type": "deposit",
                "amount": 250.00,
                "currency": "USD",
                "status": "completed",
                "description": "Development seed add money",
                "seed_tag": SEED_TAG,
                "createdAt": now() - timedelta(days=1),
                "created_at": now() - timedelta(days=1),
            }
        },
        upsert=True,
    )


async def main():
    os.environ.setdefault("MONGODB_URI", "mongodb://localhost:27017")
    os.environ.setdefault("DB_NAME", "pbx_database")

    db = await connect_to_mongo()
    await setup_ledger_indexes(db)
    await setup_audit_indexes(db)
    await db.users.create_index("user_id", unique=True, name="dev_user_id_unique")
    await db.users.create_index("email", unique=True, sparse=True, name="dev_email_unique_sparse")
    await db.profiles.create_index("profile_id", unique=True, name="dev_profile_id_unique")
    await db.profiles.create_index("handle", unique=True, sparse=True, name="dev_profile_handle_unique_sparse")

    await upsert_users(db)
    await upsert_profiles(db)
    await upsert_friendships(db)
    await upsert_conversation_and_messages(db)
    await upsert_activity_records(db)

    print("PBX Exchange development seed complete.")
    print(f"Users: {', '.join(user['email'] for user in USERS)}")
    print(f"Password for all seeded personal users: {DEV_PASSWORD}")
    print("Primary test pair: maria.santos@example.com -> jose.reyes@example.com")

    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(main())

