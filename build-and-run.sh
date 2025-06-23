#!/bin/bash

# Ensure script execution in bash
set -e

# Display colorful messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display progress messages
function show_message() {
  echo -e "${GREEN}==>${NC} $1"
}

# Function to display warning messages
function show_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker first."
  exit 1
fi

# Print architecture info
show_message "Current architecture: $(uname -m)"

# Build the Docker image
show_message "Building Docker image..."
docker compose build --no-cache

# Check build result
if [ $? -ne 0 ]; then
  show_message "Build failed. Trying with additional native dependencies..."
  
  # Backup original Dockerfile
  cp Dockerfile Dockerfile.bak
  
  # Add more dependencies for potential compatibility issues
  sed -i 's/build-essential/build-essential gcc g++ make python3-dev/g' Dockerfile
  
  # Try building again
  show_message "Rebuilding with additional dependencies..."
  docker compose build --no-cache
  
  # Restore original Dockerfile
  mv Dockerfile.bak Dockerfile
  
  if [ $? -ne 0 ]; then
    echo "Build failed even with additional dependencies. Please check the logs above for errors."
    exit 1
  fi
fi

show_message "Build completed successfully!"

# Ask if user wants to run the container
read -p "Do you want to run the container now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  show_message "Starting container..."
  docker compose up -d
  
  # Wait for container to be ready
  show_message "Waiting for the application to start..."
  sleep 5
  
  # Get the container's status
  CONTAINER_STATUS=$(docker ps --filter "name=lucas-portfolio" --format "{{.Status}}")
  
  if [[ $CONTAINER_STATUS == *"Up"* ]]; then
    show_message "Container is running!"
    show_message "You can access the application at: http://localhost:3000"
  else
    show_warning "Container may not have started properly. Check logs with: docker compose logs"
  fi
fi

show_message "Done!"
