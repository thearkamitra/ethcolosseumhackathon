from gtts import gTTS
from pathlib import Path
import os

def generate_test_audio():
    """Generate a test audio file for WhisperX testing"""
    # Create test audio directory if it doesn't exist
    test_dir = Path("test_audio")
    test_dir.mkdir(exist_ok=True)
    
    # Text to convert to speech
    text = """
    Hello, this is a test audio file for WhisperX transcription testing.
    The weather is beautiful today, and I'm testing the speech recognition system.
    This audio will be used to verify that our transcription service is working correctly.
    """
    
    # Generate speech
    tts = gTTS(text=text, lang='en', slow=False)
    
    # Save the audio file
    output_path = test_dir / "test.wav"
    tts.save(str(output_path))
    
    print(f"Test audio file generated at: {output_path}")
    print("You can now run the integration tests.")

if __name__ == "__main__":
    generate_test_audio() 