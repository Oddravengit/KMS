import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.config import Settings
from app.db import build_engine, build_session_factory

logger = logging.getLogger("odd_raven.api")


class Health(BaseModel):
    status: str = "ok"
    service: str = "odd-raven-api"
    version: str = "v1"


class Readiness(BaseModel):
    status: str
    database: str


def create_app(settings: Settings | None = None, engine=None) -> FastAPI:
    settings = settings or Settings()
    logging.basicConfig(level=settings.log_level)
    db_engine = engine if engine is not None else build_engine(settings)

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        yield
        db_engine.dispose()

    app = FastAPI(title="ODD RAVEN API", version="v1", lifespan=lifespan)
    app.state.engine = db_engine
    app.state.session_factory = build_session_factory(db_engine)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )

    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        started = time.monotonic()
        response = await call_next(request)
        # Exclude query strings and bodies to keep customer data out of logs.
        logger.info(
            "%s %s %s %.3fs",
            request.method,
            request.url.path,
            response.status_code,
            time.monotonic() - started,
        )
        return response

    @app.exception_handler(Exception)
    async def unexpected_error(request: Request, exc: Exception):
        logger.error("Unhandled API error (%s)", type(exc).__name__)
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})

    @app.get("/api/v1/health", response_model=Health, tags=["health"])
    def health():
        return Health()

    @app.get(
        "/api/v1/ready",
        response_model=Readiness,
        responses={503: {"model": Readiness}},
        tags=["health"],
    )
    def ready():
        try:
            with db_engine.connect() as connection:
                connection.execute(text("SELECT 1"))
        except SQLAlchemyError:
            logger.warning("Database readiness check failed")
            return JSONResponse(
                status_code=503, content={"status": "unavailable", "database": "unavailable"}
            )
        return Readiness(status="ok", database="ok")

    return app


app = create_app()
