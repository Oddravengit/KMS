from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import models  # noqa: F401 - register ORM tables
from app.config import Settings
from app.db import Base
from app.main import create_app


def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    app = create_app(Settings(_env_file=None), engine)
    app.state.session_factory = sessionmaker(bind=engine, expire_on_commit=False)
    return TestClient(app)


def test_customer_crud_and_duplicate_email():
    with client() as api:
        created = api.post(
            "/api/v1/customers",
            json={"full_name": "Ava Raven", "email": "ava@example.com", "phone": "555-0100"},
        )
        assert created.status_code == 201
        customer = created.json()
        assert customer["full_name"] == "Ava Raven"
        assert customer["id"] == 1

        duplicate = api.post(
            "/api/v1/customers", json={"full_name": "Another", "email": "ava@example.com"}
        )
        assert duplicate.status_code == 409

        updated = api.patch(
            f"/api/v1/customers/{customer['id']}", json={"notes": "Preferred contact"}
        )
        assert updated.status_code == 200
        assert updated.json()["notes"] == "Preferred contact"
        assert api.get("/api/v1/customers").json()[0]["email"] == "ava@example.com"

        deleted = api.delete(f"/api/v1/customers/{customer['id']}")
        assert deleted.status_code == 204
        assert api.get(f"/api/v1/customers/{customer['id']}").status_code == 404


def test_customer_validation_and_pagination():
    with client() as api:
        assert api.post("/api/v1/customers", json={"full_name": ""}).status_code == 422
        api.post("/api/v1/customers", json={"full_name": "First"})
        api.post("/api/v1/customers", json={"full_name": "Second"})
        response = api.get("/api/v1/customers?offset=1&limit=1")
        assert response.status_code == 200
        assert [item["full_name"] for item in response.json()] == ["Second"]
