FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    git \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create directory for temporary audio files
RUN mkdir -p /app/temp_audio && chmod 777 /app/temp_audio

# Create test audio directory
RUN mkdir -p /app/test_audio && chmod 777 /app/test_audio

# Add the src directory to PYTHONPATH
ENV PYTHONPATH=/app/src

# Expose the port the app runs on
EXPOSE 8000

# Command to run a random log
CMD ["tail", "-f", "/dev/null"]