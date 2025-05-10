from pydantic_settings import BaseSettings

class OllamaConfig(BaseSettings):
    """Configuration for Ollama integration"""
    model_name: str = "llama3.2"  # Default model
    base_url: str = "http://localhost:11434"  # Default Ollama URL
    temperature: float = 0.7
    max_tokens: int = 2000

    class Config:
        env_prefix = "OLLAMA_" 