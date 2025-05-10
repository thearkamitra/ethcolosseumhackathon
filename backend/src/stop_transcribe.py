import os
import tempfile
import time
import sounddevice as sd
from scipy.io.wavfile import write
import numpy as np
import webrtcvad
from transcription.whisper_manager import WhisperManager
from src.insurance.insurance_agent import InsuranceAgent

class WhisperTranscriber:
    def __init__(self, model_name="base", sample_rate=16000, chunk_duration=0.5, vad_mode=1, silence_limit=1.0):
        self.model_name = model_name
        self.sample_rate = sample_rate
        self.chunk_duration = chunk_duration  # seconds
        self.silence_limit = silence_limit  # seconds of silence to consider end of speech
        self.model = None
        self.is_running = False
        self.vad = webrtcvad.Vad(vad_mode)
        self.insurance_agent = InsuranceAgent()

    def initialize(self):
        print(f"Loading Whisper model '{self.model_name}'...")
        self.model = WhisperManager(self.model_name)
        print("Model loaded.")

    def is_speech(self, audio_chunk):
        int_audio = (audio_chunk * 32767).astype(np.int16)
        bytes_audio = int_audio.tobytes()
        frame_size = int(self.sample_rate * self.chunk_duration)
        bytes_per_frame = frame_size * 2  # 16-bit mono = 2 bytes/sample

        if len(bytes_audio) < bytes_per_frame:
            return False

        return self.vad.is_speech(bytes_audio[:bytes_per_frame], self.sample_rate)

    def record_audio_frame(self):
        audio = sd.rec(int(self.chunk_duration * self.sample_rate), samplerate=self.sample_rate, channels=1, dtype='float32')
        sd.wait()
        return np.squeeze(audio)

    def transcribe_chunk(self, audio_buffer):
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmpfile:
            write(tmpfile.name, self.sample_rate, (audio_buffer * 32767).astype(np.int16))
            filepath = tmpfile.name

        result = self.model.transcribe(filepath)
        os.remove(filepath)
        return result

    def transcribe(self, callback=None):
        if not self.model:
            self.initialize()

        self.is_running = True
        print("Start speaking (Ctrl+C to stop)...")

        audio_buffer = []
        silence_counter = 0

        try:
            while self.is_running:
                frame = self.record_audio_frame()
                if self.is_speech(frame):
                    audio_buffer.append(frame)
                    silence_counter = 0
                else:
                    if audio_buffer:
                        silence_counter += self.chunk_duration
                        if silence_counter >= self.silence_limit:
                            combined = np.concatenate(audio_buffer)
                            text = self.transcribe_chunk(combined)
                            if text:
                                print("Recognized:", text)
                                if callback:
                                    callback(text)
                                self.insurance_agent.run(text)
                            audio_buffer = []
                            silence_counter = 0
        except KeyboardInterrupt:
            print("\nStopping...")
        finally:
            self.is_running = False


def main():
    transcriber = WhisperTranscriber(model_name="small", chunk_duration=0.03, silence_limit=1.0)
    transcriber.transcribe()

if __name__ == "__main__":
    main()
