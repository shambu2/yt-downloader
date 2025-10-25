# Use a Node.js base image with Python included for yt-dlp
FROM node:20-slim

# Install system dependencies: ffmpeg, Python, and pip
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip3 install --break-system-packages --no-cache-dir yt-dlp

# Set working directory
WORKDIR /app

# Copy package.json and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]