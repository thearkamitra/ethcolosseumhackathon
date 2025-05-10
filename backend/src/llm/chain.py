from langchain_community.llms import Ollama
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from typing import List, Optional
import aiohttp
from .config import OllamaConfig

class LangChainManager:
    def __init__(self, config: Optional[OllamaConfig] = None):
        self.config = config or OllamaConfig()
        self.llm = self._setup_llm()
    
    def _setup_llm(self) -> Ollama:
        """Initialize the Ollama LLM with configuration"""
        callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
        
        return Ollama(
            model=self.config.model_name,
            base_url=self.config.base_url,
            temperature=self.config.temperature,
            callback_manager=callback_manager
        )
    
    async def generate_response(self, prompt: str) -> str:
        """Generate a response using the LLM"""
        if not prompt.strip():
            raise ValueError("Prompt cannot be empty")
            
        try:
            response = await self.llm.agenerate([prompt])
            return response.generations[0][0].text
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to Ollama server: {str(e)}")
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")
    
    async def get_available_models(self) -> List[str]:
        """Get list of available Ollama models"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.config.base_url}/api/tags") as response:
                    if response.status == 200:
                        data = await response.json()
                        return [model["name"] for model in data.get("models", [])]
                    else:
                        raise Exception(f"Failed to fetch models: {response.status}")
        except Exception as e:
            raise Exception(f"Error fetching available models: {str(e)}") 