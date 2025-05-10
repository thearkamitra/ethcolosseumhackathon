import pytest
import os
from pathlib import Path
from ..whisper_manager import WhisperManager

@pytest.fixture
def whisper_manager():
    return WhisperManager(model_size="tiny")  # Use tiny model for testing

@pytest.fixture
def sample_audio_path():
    # Create a test audio file (you'll need to provide a real audio file for testing)
    test_dir = Path("test_audio")
    test_dir.mkdir(exist_ok=True)
    return str(test_dir / "test.wav")

@pytest.mark.asyncio
async def test_transcribe_audio(whisper_manager, sample_audio_path):
    """Test transcription of an audio file"""
    try:
        result = await whisper_manager.transcribe_audio(sample_audio_path)
        
        # Check the structure of the result
        assert "language" in result
        assert "language_probability" in result
        assert "segments" in result
        assert isinstance(result["segments"], list)
        
        # Check segment structure
        if result["segments"]:
            segment = result["segments"][0]
            assert "text" in segment
            assert "start" in segment
            assert "end" in segment
            assert "confidence" in segment
            
    except FileNotFoundError:
        pytest.skip("Test audio file not found")
    except Exception as e:
        pytest.fail(f"Transcription failed: {str(e)}")

@pytest.mark.asyncio
async def test_transcribe_audio_chunk(whisper_manager):
    """Test transcription of an audio chunk"""
    # Create a dummy audio chunk (you'll need real audio data for proper testing)
    dummy_chunk = b"dummy audio data"
    
    try:
        result = await whisper_manager.transcribe_audio_chunk(dummy_chunk)
        
        # Check the structure of the result
        assert "language" in result
        assert "language_probability" in result
        assert "segments" in result
        assert isinstance(result["segments"], list)
        
    except Exception as e:
        pytest.fail(f"Chunk transcription failed: {str(e)}")

@pytest.mark.asyncio
async def test_invalid_audio_path(whisper_manager):
    """Test handling of invalid audio file path"""
    with pytest.raises(FileNotFoundError):
        await whisper_manager.transcribe_audio("nonexistent.wav")

@pytest.mark.asyncio
async def test_language_detection(whisper_manager, sample_audio_path):
    """Test automatic language detection"""
    try:
        result = await whisper_manager.transcribe_audio(sample_audio_path)
        assert result["language"] is not None
        assert result["language_probability"] > 0
        
    except FileNotFoundError:
        pytest.skip("Test audio file not found")
    except Exception as e:
        pytest.fail(f"Language detection failed: {str(e)}") 