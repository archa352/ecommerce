from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1 import api_router
from app.core.cache import close_redis
from app.core.config import get_settings
from app.core.database import dispose_engine
from app.core.error_handlers import register_exception_handlers
from app.core.request_context import sanitize_request_id, set_request_id

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await dispose_engine()
    await close_redis()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        docs_url="/docs" if settings.api_docs_enabled else None,
        redoc_url="/redoc" if settings.api_docs_enabled else None,
        openapi_url="/openapi.json" if settings.api_docs_enabled else None,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-Id", "Content-Disposition"],
    )

    @app.middleware("http")
    async def add_request_id(request: Request, call_next):
        """Give every request an id that error responses and the client share."""
        request_id = sanitize_request_id(request.headers.get("X-Request-Id"))
        set_request_id(request_id)
        request.state.request_id = request_id

        response = await call_next(request)
        response.headers["X-Request-Id"] = request_id
        return response

    # Local storage keeps files on disk, so the app serves them itself. An
    # object-store backend would hand out its own URLs and skip this.
    uploads = Path(settings.storage_local_path)
    uploads.mkdir(parents=True, exist_ok=True)
    app.mount(
        settings.storage_public_base_url,
        StaticFiles(directory=uploads),
        name="media",
    )

    register_exception_handlers(app)

    app.include_router(api_router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
