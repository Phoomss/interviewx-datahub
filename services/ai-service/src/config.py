from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "InterviewX AI Service"
    environment: str = "development"
    port: int = 8000
    internal_service_key: str = "interviewx_internal_service_secret_key_2026"
    minio_endpoint: str = "localhost:9000"
    minio_root_user: str = "minioadmin"
    minio_root_password: str = "minioadmin"
    minio_use_ssl: bool = False
    gemini_api_key: str = ""
    openai_api_key: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
