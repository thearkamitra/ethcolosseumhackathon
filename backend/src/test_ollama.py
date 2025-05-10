import asyncio
from llm.chain import LangChainManager
from llm.config import OllamaConfig

async def test_ollama():
    # Initialize the manager with specific model
    config = OllamaConfig(model_name="llama3.2")
    manager = LangChainManager(config=config)
    
    # Test getting available models
    print("Fetching available models...")
    try:
        models = await manager.get_available_models()
        # Filter out models with 'latest' tag
        exact_models = [model for model in models if ':latest' not in model]
        print("Available exact models:", exact_models)
    except Exception as e:
        print("Error fetching models:", str(e))
    
    # Test a simple generation
    print("\nTesting model generation with llama3.2...")
    try:
        response = await manager.generate_response("Say hello!")
        print("Response:", response)
    except Exception as e:
        print("Error generating response:", str(e))

if __name__ == "__main__":
    asyncio.run(test_ollama()) 