from fastapi import APIRouter
import time

router = APIRouter(tags=["Health"])

start_time = time.time()

@router.get("/health")
def health_check():
    return {
        "success": True,
        "service": "interviewx-ai-service",
        "status": "healthy",
        "uptime": round(time.time() - start_time, 2)
    }
