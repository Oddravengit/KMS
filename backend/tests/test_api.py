from typing import Annotated
from unittest.mock import MagicMock

import pytest
from fastapi import Depends
from fastapi.testclient import TestClient
from pydantic import ValidationError
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from app.config import Settings
from app.db import get_session
from app.main import create_app


@pytest.fixture
def engine():
    return MagicMock()


@pytest.fixture
def client(engine):
    with TestClient(create_app(Settings(_env_file=None), engine)) as client:
        yield client


def test_health_contract_does_not_require_database(client, engine):
    assert client.get("/api/v1/health").json() == {
        "status": "ok",
        "service": "odd-raven-api",
        "version": "v1",
    }
    engine.connect.assert_not_called()


def test_ready_checks_database(client, engine):
    assert client.get("/api/v1/ready").json() == {"status": "ok", "database": "ok"}
    engine.connect.return_value.__enter__.return_value.execute.assert_called_once()


def test_ready_returns_503_without_leaking_credentials(client, engine):
    engine.connect.side_effect = OperationalError("secret-password", {}, Exception("secret"))
    response = client.get("/api/v1/ready")
    assert response.status_code == 503
    assert response.json() == {"status": "unavailable", "database": "unavailable"}
    assert "secret" not in response.text


@pytest.mark.parametrize(
    "origin,allowed", [("http://localhost:5173", True), ("https://untrusted.example", False)]
)
def test_cors(client, origin, allowed):
    response = client.options(
        "/api/v1/health", headers={"Origin": origin, "Access-Control-Request-Method": "GET"}
    )
    assert ("access-control-allow-origin" in response.headers) is allowed


def test_invalid_database_configuration():
    with pytest.raises(ValidationError):
        Settings(database_url="sqlite:///wrong.db", _env_file=None)


def test_session_dependency_closes_session(engine):
    app = create_app(Settings(_env_file=None), engine)
    factory = MagicMock()
    app.state.session_factory = factory

    @app.get("/session-test")
    def session_test(session: Annotated[Session, Depends(get_session)]):
        return {"available": session is not None}

    with TestClient(app) as client:
        assert client.get("/session-test").json() == {"available": True}
    factory.return_value.__exit__.assert_called_once()
    engine.dispose.assert_called_once()


def test_error_response_hides_internal_details(engine):
    app = create_app(Settings(_env_file=None), engine)

    @app.get("/error-test")
    def fail():
        raise RuntimeError("private-customer-data")

    with TestClient(app, raise_server_exceptions=False) as client:
        response = client.get("/error-test")
        assert response.status_code == 500
        assert response.json() == {"detail": "Internal server error"}


def test_openapi(client):
    schema = client.get("/openapi.json").json()
    assert "/api/v1/health" in schema["paths"]
    assert "/api/v1/ready" in schema["paths"]
