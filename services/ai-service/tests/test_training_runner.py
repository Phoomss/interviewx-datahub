import pytest
from src.schemas.training import RunFinetuningRequest, HyperparametersConfig, EvaluateModelRequest
from src.services.training_runner import TrainingRunnerService


def test_peft_config_generation():
    req = RunFinetuningRequest(
        job_id="job-test-01",
        base_model="Qwen/Qwen2.5-7B-Instruct",
        method="QLORA",
        hyperparameters=HyperparametersConfig(
            lora_r=32,
            lora_alpha=64,
            learning_rate=3e-4,
            epochs=2,
        ),
    )
    cfg = TrainingRunnerService.generate_peft_config(req)
    assert cfg["peft_type"] == "LORA"
    assert cfg["r"] == 32
    assert cfg["lora_alpha"] == 64
    assert cfg["training_args"]["learning_rate"] == 3e-4
    assert "q_proj" in cfg["target_modules"]


def test_execute_finetuning_metrics():
    req = RunFinetuningRequest(
        job_id="job-test-02",
        base_model="meta-llama/Llama-3.1-8B-Instruct",
        method="QLORA",
        hyperparameters=HyperparametersConfig(epochs=2),
    )
    resp = TrainingRunnerService.execute_finetuning(req)
    assert resp.status == "COMPLETED"
    assert len(resp.training_steps) == 20
    assert resp.final_metrics["epochs_completed"] == 2
    assert resp.final_metrics["eval_loss"] > 0
    assert resp.final_metrics["perplexity"] > 0
    assert "checkpoints/job-test-02" in resp.checkpoint_uri


def test_evaluate_checkpoint_benchmark():
    req = EvaluateModelRequest(model_checkpoint_uri="checkpoints/job-test-02/adapter")
    eval_resp = TrainingRunnerService.evaluate_checkpoint(req)
    assert eval_resp.rubric_score >= 0.80
    assert eval_resp.zero_pii_verified is True
    assert eval_resp.overall_quality_pass is True
    assert len(eval_resp.detailed_benchmarks) >= 4
