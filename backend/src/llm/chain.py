from langchain_community.llms import Ollama
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from typing import List, Optional, Deque
from collections import deque
import aiohttp
from .config import OllamaConfig
from .tools import get_default_tools
from langchain_core.outputs import ChatGeneration
from langchain_core.messages import AIMessage
from langchain.memory import ConversationBufferWindowMemory

class LangChainManager:
    def __init__(self, config: Optional[OllamaConfig] = None, buffer_size: int = 5, tools: Optional[List] = None):
        self.config = config or OllamaConfig()
        self.llm = self._setup_llm()
        self.conversation_buffer = ConversationBufferWindowMemory(k=5, return_messages=True)  # Set window size to 5
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

        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful AI assistant with access to various tools. Use them when appropriate to help answer questions."),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])

        agent = create_openai_tools_agent(self.llm, tools, prompt)
        return AgentExecutor(agent=agent, tools=tools, memory=self.conversation_buffer, verbose=True)

    
    async def generate_response(self, prompt: str) -> str:
        """Generate a response using the LLM with conversation history"""
        if not prompt.strip():
            raise ValueError("Prompt cannot be empty")
            
        self.conversation_buffer.append(prompt)
        context = "\n".join(self.conversation_buffer)
        
        try:
            response = await self.llm.agenerate([context])
            response_text = response.generations[0][0].text
            
            self.conversation_buffer.append(response_text)
            return response_text
        except aiohttp.ClientError as e:
            raise ConnectionError(f"Failed to connect to Ollama server: {str(e)}")
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")
    
    async def run_agent(self, input_text: str) -> str:
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