import os
import tempfile
import time
import sounddevice as sd
from scipy.io.wavfile import write
import numpy as np
from transcription.whisper_manager import WhisperManager
class WhisperTranscriber:
    def __init__(self, model_name="base", sample_rate=16000, chunk_duration=3):
        self.model_name = model_name
        self.sample_rate = sample_rate
        self.chunk_duration = chunk_duration  # in seconds
        self.model = None
        self.is_running = False

    def initialize(self):
        print(f"Loading Whisper model '{self.model_name}'...")
        self.model = WhisperManager(self.model_name)
        print("Model loaded.")

    def record_audio_chunk(self):
        print(f"Recording {self.chunk_duration} second(s)...")
        audio = sd.rec(int(self.chunk_duration * self.sample_rate), samplerate=self.sample_rate, channels=1, dtype='float32')
        sd.wait()
        return np.squeeze(audio)

    def transcribe_chunk(self, audio_chunk):
        # Save to temp file
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmpfile:
            write(tmpfile.name, self.sample_rate, (audio_chunk * 32767).astype(np.int16))
            filepath = tmpfile.name

        result = self.model.transcribe(filepath)
        os.remove(filepath)
        return result

    def transcribe(self, callback=None):
        if not self.model:
            self.initialize()

        self.is_running = True
        print("Start speaking (Ctrl+C to stop)...")

        try:
            while self.is_running:
                audio_chunk = self.record_audio_chunk()
                text = self.transcribe_chunk(audio_chunk)
                if text:
                    print("Recognized:", text)
                    if callback:
                        callback(text)
        except KeyboardInterrupt:
            print("\nStopping...")
        finally:
            self.is_running = False

def main():
    transcriber = WhisperTranscriber(model_name="small", chunk_duration=5)
    transcriber.transcribe()

if __name__ == "__main__":
    main()