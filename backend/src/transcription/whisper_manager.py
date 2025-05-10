import whisperx
import torch
import numpy as np
import wave
import io

class WhisperManager:
    def __init__(self, model_size="base"):
        """Initialize the WhisperX model with specified size"""
        # Load WhisperX model with float32 compute type
        self.model = whisperx.load_model(
            model_size,
            device="cuda" if torch.cuda.is_available() else "cpu",
            compute_type="float32"
        )
    
    def transcribe_audio_chunk(self, audio_data):
        """Transcribe audio data using WhisperX"""
        try:
            # Save the audio data to a temporary file
            with open("temp_audio.wav", "wb") as f:
                f.write(audio_data)
            
            # Transcribe the audio
            result = self.model.transcribe("temp_audio.wav")
            
            return {
                "language": result["language"],
                "segments": [{
                    "text": segment["text"],
                    "confidence": segment.get("confidence", 1.0),
                    "start": segment["start"],
                    "end": segment["end"]
                } for segment in result["segments"]]
            }
        except Exception as e:
            print(f"Error in transcription: {str(e)}")
            return {"error": str(e)} 