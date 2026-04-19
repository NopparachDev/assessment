from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/assessment"
    cors_origins: list[str] = ["http://localhost:3000"]
    anthropic_api_key: str = ""

    model_config = {"env_file": ".env"}


settings = Settings()
