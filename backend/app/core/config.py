from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "QuarryOS"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    DATABASE_URL: str
    
    # SECURITY
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Configuration to read from .env file
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
