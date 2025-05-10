import os
import zipfile
import urllib.request
import sounddevice as sd
import queue
import json
from vosk import Model, KaldiRecognizer

class VoiceTranscriber:
    def __init__(self, model_name="vosk-model-en-us-0.22-lgraph", sample_rate=16000):
        self.model_name = model_name
        self.model_url = f"https://alphacephei.com/vosk/models/{self.model_name}.zip"
        self.sample_rate = sample_rate
        self.queue = queue.Queue()
        self.model = None
        self.recognizer = None
        self.stream = None
        self.is_running = False
        
    def download_and_extract_model(self):
        print("Downloading model. This may take a few minutes...")
        zip_path = f"{self.model_name}.zip"
        urllib.request.urlretrieve(self.model_url, zip_path)

        print("Extracting model...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall()
        os.remove(zip_path)
        print("Model ready.")
        
    def ensure_model_exists(self):
        if not os.path.exists(self.model_name):
            self.download_and_extract_model()
        else:
            print("Model already exists.")
            
    def audio_callback(self, indata, frames, time, status):
        if status:
            print(status)
        self.queue.put(bytes(indata))
        
    def initialize(self):
        self.ensure_model_exists()
        print("Loading model...")
        self.model = Model(self.model_name)
        self.recognizer = KaldiRecognizer(self.model, self.sample_rate)
        
    def transcribe(self, callback=None):
        """
        Start transcription process
        
        Args:
            callback: Optional function that will be called with transcription text
        """
        if not self.model or not self.recognizer:
            self.initialize()
            
        self.is_running = True
        
        self.stream = sd.RawInputStream(
            samplerate=self.sample_rate,
            blocksize=8000,
            dtype='int16',
            channels=1,
            callback=self.audio_callback
        )
        
        self.stream.start()
        print("Start speaking (press Ctrl+C to stop)...")
        
        try:
            while self.is_running:
                data = self.queue.get()
                if self.recognizer.AcceptWaveform(data):
                    result = json.loads(self.recognizer.Result())
                    text = result.get("text", "")
                    if text:
                        print("Recognized:", text)
                        if callback:
                            callback(text)
        except KeyboardInterrupt:
            pass
        finally:
            return self.stop()
    
    def stop(self):
        """Stop the transcription process and return final result"""
        self.is_running = False
        if self.stream:
            self.stream.stop()
            self.stream.close()
            self.stream = None
        
        if self.recognizer:
            final_result = json.loads(self.recognizer.FinalResult())
            final_text = final_result.get("text", "")
            print("\nStopping...")
            print("Final Result:", final_text)
            return final_text
        return ""

def main():
    transcriber = VoiceTranscriber()
    transcriber.transcribe()

if __name__ == "__main__":
    main()