from langchain_community.llms import Ollama
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.agents import AgentExecutor, initialize_agent, AgentType
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from typing import List, Optional
import aiohttp
from .config import OllamaConfig
from .tools import get_default_tools
from langchain.memory import ConversationBufferWindowMemory

class LangChainManager:
    def __init__(self, config: Optional[OllamaConfig] = None, buffer_size: int = 5, tools: Optional[List] = None):
        self.config = config or OllamaConfig()
        self.llm = self._setup_llm()
        self.conversation_buffer = ConversationBufferWindowMemory(k=buffer_size, return_messages=True)
        self.agent = self._setup_agent(tools)
    
    def _setup_llm(self) -> Ollama:
        """Initialize the Ollama LLM with configuration"""
        callback_manager = CallbackManager([StreamingStdOutCallbackHandler()])
        
        return Ollama(
            model=self.config.model_name,
            base_url=self.config.base_url,
            temperature=self.config.temperature,
            callback_manager=callback_manager
        )
    
    def _setup_agent(self, tools: Optional[List] = None) -> AgentExecutor:
        if tools is None:
            tools = get_default_tools()

        return initialize_agent(
            tools=tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            memory=self.conversation_buffer,
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=3
        )
    
    async def run_agent(self, input_text: str) -> str:
        """Run the agent with the given input text"""
        if not input_text.strip():
            raise ValueError("Input text cannot be empty")
            
        try:
            result = await self.agent.ainvoke({
                "input": input_text
            })
            return result["output"]
        except Exception as e:
            raise Exception(f"Error running agent: {str(e)}")

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