from fastapi import APIRouter, Header, HTTPException, status
from src.config import settings
from src.schemas.training import (
    RunFinetuningRequest,
    RunFinetuningResponse,
    EvaluateModelRequest,
    EvaluateModelResponse,
)
from src.services.training_runner import TrainingRunnerService

router = APIRouter(prefix="/internal/v1/training", tags=["Training & Fine-Tuning"])


def verify_internal_key(x_internal_service_key: str = Header(...)):
    if x_internal_service_key != settings.internal_service_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal service key",
        )


@router.post("/run-finetuning", response_model=RunFinetuningResponse)
def run_finetuning(request: RunFinetuningRequest, x_internal_service_key: str = Header(...)):
    verify_internal_key(x_internal_service_key)
    try:
        return TrainingRunnerService.execute_finetuning(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Fine-tuning job execution error: {str(e)}",
        )


@router.post("/evaluate-model", response_model=EvaluateModelResponse)
def evaluate_model(request: EvaluateModelRequest, x_internal_service_key: str = Header(...)):
    verify_internal_key(x_internal_service_key)
    try:
        return TrainingRunnerService.evaluate_checkpoint(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model evaluation benchmark error: {str(e)}",
        )
