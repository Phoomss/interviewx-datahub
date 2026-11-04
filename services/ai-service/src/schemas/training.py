from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class HyperparametersConfig(BaseModel):
    learning_rate: float = Field(default=2e-4, ge=1e-6, le=1e-2)
    batch_size: int = Field(default=4, ge=1, le=64)
    epochs: int = Field(default=3, ge=1, le=50)
    lora_r: int = Field(default=16, ge=4, le=128)
    lora_alpha: int = Field(default=32, ge=8, le=256)
    lora_dropout: float = Field(default=0.05, ge=0.0, le=0.5)
    target_modules: List[str] = Field(
        default_factory=lambda: ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]
    )
    quantization: str = Field(default="4bit", pattern="^(4bit|8bit|none)$")
    warmup_ratio: float = Field(default=0.03, ge=0.0, le=0.5)
    weight_decay: float = Field(default=0.01, ge=0.0, le=0.5)


class RunFinetuningRequest(BaseModel):
    job_id: str
    base_model: str = "Qwen/Qwen2.5-7B-Instruct"
    method: str = "QLORA"  # LORA, QLORA, FULL
    dataset_manifest_url: Optional[str] = None
    hyperparameters: HyperparametersConfig = Field(default_factory=HyperparametersConfig)


class TrainingStepMetric(BaseModel):
    epoch: float
    step: int
    train_loss: float
    eval_loss: Optional[float] = None
    learning_rate: float


class RunFinetuningResponse(BaseModel):
    job_id: str
    status: str
    base_model: str
    method: str
    checkpoint_uri: str
    training_steps: List[TrainingStepMetric]
    final_metrics: Dict[str, Any]
    peft_config_generated: Dict[str, Any]


class EvaluateModelRequest(BaseModel):
    model_checkpoint_uri: str
    benchmark_dataset_url: Optional[str] = None
    test_samples: Optional[List[Dict[str, Any]]] = None


class EvaluateModelResponse(BaseModel):
    model_checkpoint_uri: str
    rubric_score: float
    perplexity: float
    fluency_score: float
    json_format_adherence: float
    zero_pii_verified: bool
    overall_quality_pass: bool
    detailed_benchmarks: List[Dict[str, Any]]
