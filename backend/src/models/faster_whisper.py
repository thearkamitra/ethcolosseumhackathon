import torch
from transformers import pipeline
from transformers.utils import is_flash_attn_2_available

class WhisperFaster:
    def __init__(self):
        self.device = "cuda:0" if torch.cuda.is_available() else "cpu"
        self.pipe = pipeline(
            "automatic-speech-recognition",
            model="openai/whisper-tiny",  # select checkpoint from https://huggingface.co/openai/whisper-large-v3#model-details
            device=self.device,  # or mps for Mac devices
            model_kwargs={"attn_implementation": "flash_attention_2"}
            if is_flash_attn_2_available()
            else {"attn_implementation": "sdpa"},
        )

    def transcribe(self, audio_file):
        outputs = self.pipe(
            audio_file,
            return_timestamps=True,
        )
        return outputs["text"]


if __name__ == "__main__":
    WhisperFaster()