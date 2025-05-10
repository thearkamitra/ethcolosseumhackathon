.PHONY: build run test clean pull-models download-whisper generate-test-audio

# Build the Docker containers
build:
	docker compose build

# Run the system
run:
	docker compose up

# Run the system in detached mode
run-detached:
	docker compose up -d

# Stop the system
stop:
	docker compose down

# Run tests
test:
	docker compose run --rm backend pytest

# Clean up Docker resources
clean:
	docker compose down -v
	docker system prune -f

# Pull required Ollama models
pull-models:
	docker compose exec ollama ollama pull llama3.2

# Download Whisper model
download-whisper:
	docker compose run --rm backend python -c "from faster_whisper import WhisperModel; WhisperModel('base')"

# Generate test audio file
generate-test-audio:
	docker compose run --rm backend python src/tests/generate_test_audio.py

# Show logs
logs:
	docker compose logs -f

# Restart the system
restart: stop run

# Setup everything
setup: build run-detached pull-models download-whisper 