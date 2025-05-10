import asyncio
from .chain import LangChainManager
from .config import OllamaConfig

async def test_llm_integration():
    print("Testing LangChain integration with llama2...")
    
    # Initialize the manager
    manager = LangChainManager()
    
    try:
        # Test 1: Get available models
        print("\n1. Testing model listing...")
        models = await manager.get_available_models()
        print(f"Available models: {models}")
        
        # Test 2: Simple prompt
        print("\n2. Testing simple prompt...")
        prompt1 = "What is the capital of France? Answer in one word."
        response1 = await manager.generate_response(prompt1)
        print(f"Prompt: {prompt1}")
        print(f"Response: {response1}")
        
        # Test 3: More complex prompt
        print("\n3. Testing complex prompt...")
        prompt2 = """Explain the concept of recursion in programming.
        Give a simple example in Python."""
        response2 = await manager.generate_response(prompt2)
        print(f"Prompt: {prompt2}")
        print(f"Response: {response2}")
        
    except Exception as e:
        print(f"\nError during testing: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(test_llm_integration()) 