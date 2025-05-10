import asyncio
import pytest
from pathlib import Path
from ..llm.chain import LangChainManager
from ..transcription.whisper_manager import WhisperManager

@pytest.mark.asyncio
async def test_system_integration():
    print("\n=== Testing System Integration ===")
    
    # Test 1: LLM Integration
    print("\n1. Testing LLM (Ollama) Integration...")
    try:
        llm_manager = LangChainManager()
        
        # Test basic prompt
        prompt = "What is 2+2? Answer in one word."
        response = await llm_manager.generate_response(prompt)
        print(f"Prompt: {prompt}")
        print(f"Response: {response}")
        
        # Test agent with calculator
        agent_prompt = "Calculate 15 * 7"
        agent_response = await llm_manager.run_agent(agent_prompt)
        print(f"\nAgent Prompt: {agent_prompt}")
        print(f"Agent Response: {agent_response}")
        
        print("✓ LLM Integration Test Passed")
    except Exception as e:
        print(f"✗ LLM Integration Test Failed: {str(e)}")
        raise
    
    # Test 2: WhisperX Integration
    print("\n2. Testing WhisperX Integration...")
    try:
        whisper = WhisperManager(model_size="tiny")  # Using tiny model for quick testing
        
        # Create a test audio file path
        test_audio_dir = Path("test_audio")
        test_audio_dir.mkdir(exist_ok=True)
        test_audio_path = test_audio_dir / "test.wav"
        
        # Check if test audio exists
        if not test_audio_path.exists():
            print("! No test audio file found. Please place a WAV file at test_audio/test.wav")
            print("  Skipping WhisperX test...")
        else:
            # Test transcription
            result = await whisper.transcribe_audio(str(test_audio_path))
            print("\nTranscription Result:")
            print(f"Detected Language: {result['language']}")
            print(f"Language Probability: {result['language_probability']:.2f}")
            print("\nSegments:")
            for segment in result['segments']:
                print(f"- {segment['text']} ({segment['start']:.1f}s - {segment['end']:.1f}s)")
            
            print("✓ WhisperX Integration Test Passed")
    except Exception as e:
        print(f"✗ WhisperX Integration Test Failed: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(test_system_integration()) 