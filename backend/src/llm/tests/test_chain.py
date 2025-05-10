import asyncio
from ..chain import LangChainManager
from ..config import OllamaConfig
import pytest

@pytest.mark.asyncio
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
        
        # Test 4: Empty prompt (should raise error)
        print("\n4. Testing empty prompt handling...")
        try:
            await manager.generate_response("")
            print("Warning: Empty prompt did not raise an error as expected")
        except ValueError as e:
            print(f"Successfully caught empty prompt error: {str(e)}")
        
        # Test 5: Long prompt
        print("\n5. Testing long prompt...")
        prompt3 = "Write a short story about a robot learning to paint." * 3
        response3 = await manager.generate_response(prompt3)
        print(f"Prompt length: {len(prompt3)} characters")
        print(f"Response length: {len(response3)} characters")
        
        # Test 6: Agent with calculator tool
        print("\n6. Testing agent with calculator tool...")
        agent_prompt1 = "What is 123 * 456?"
        agent_response1 = await manager.run_agent(agent_prompt1)
        print(f"Agent Prompt: {agent_prompt1}")
        print(f"Agent Response: {agent_response1}")
        
        # Test 7: Agent with search tool
        print("\n7. Testing agent with search tool...")
        agent_prompt2 = "What is the latest news about AI?"
        agent_response2 = await manager.run_agent(agent_prompt2)
        print(f"Agent Prompt: {agent_prompt2}")
        print(f"Agent Response: {agent_response2}")
        
    except Exception as e:
        print(f"\nError during testing: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(test_llm_integration()) 