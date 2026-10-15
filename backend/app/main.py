from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, content, practice, users
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(title="BEKALIN BISA API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(content.router, prefix="/api/v1")
app.include_router(practice.router, prefix="/api/v1")


@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}
