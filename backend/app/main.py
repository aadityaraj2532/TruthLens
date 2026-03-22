from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.analyze import router as analyze_router
from app.core.database import engine, Base
from app.core.logger import logger
from app.core.security import limiter

# Create SQLite database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TruthLens API",
    description="AI-Powered Fake News Detection & Credibility Platform",
    version="1.0.0"
)

# Apply Rate Limiting Protections
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Allow CORS for React frontend and Chrome Extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Logging Middleware to track API Calls
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming API Call: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"API Response Status: {response.status_code}")
    return response

app.include_router(analyze_router, prefix="/api", tags=["Analysis"])

@app.get("/")
@limiter.limit("10/minute")
def read_root(request: Request):
    return {"message": "Welcome to TruthLens. Documentation is available at /docs"}
