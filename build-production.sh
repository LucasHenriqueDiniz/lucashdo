#!/bin/bash

# Ensure script execution in bash
set -e

# Display colorful messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display progress messages
function show_message() {
  echo -e "${GREEN}==>${NC} $1"
}

# Function to display warning messages
function show_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to display error messages
function show_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  show_error "Docker is not installed. Please install Docker first."
  exit 1
fi

# Welcome message
show_message "Next.js Portfolio Website Production Docker Builder"
show_message "This script will create a production-ready Docker image for your portfolio"

# Generate unique tag based on date
TAG="portfolio-$(date +%Y%m%d-%H%M%S)"
IMAGE_NAME="lucas-portfolio:$TAG"

# Check if .env file exists and load environmental variables
if [ -f .env ]; then
  show_message "Loading environment variables from .env file"
  export $(grep -v '^#' .env | xargs)
else
  show_warning "No .env file found. Make sure to provide environment variables in Docker Compose"
fi

# Build the Docker image with proper tags
show_message "Building production Docker image: $IMAGE_NAME"
docker build \
  --build-arg NODE_ENV=production \
  --build-arg NEXT_TELEMETRY_DISABLED=1 \
  --build-arg NEXT_OUTPUT_STANDALONE=true \
  -t $IMAGE_NAME .

# Check if build was successful
if [ $? -ne 0 ]; then
  show_error "Build failed. Check the logs above for errors."
  exit 1
fi

# Display success message and next steps
show_message "Build completed successfully!"
show_message "The image has been tagged as: $IMAGE_NAME"
show_message ""
show_message "To run this image:"
show_message "docker run -p 3000:3000 -e NODE_ENV=production $IMAGE_NAME"
show_message ""
show_message "To push to a registry:"
show_message "1. Tag the image: docker tag $IMAGE_NAME your-registry/lucas-portfolio:latest"
show_message "2. Push the image: docker push your-registry/lucas-portfolio:latest"

# Ask if user wants to run the container
read -p "Do you want to run the container now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  show_message "Starting container..."
  docker run --name lucas-portfolio-prod -p 3000:3000 -d $IMAGE_NAME
  
  # Wait for container to be ready
  show_message "Waiting for the application to start..."
  sleep 5
  
  # Get the container's status
  CONTAINER_STATUS=$(docker ps --filter "name=lucas-portfolio-prod" --format "{{.Status}}")
  
  if [[ $CONTAINER_STATUS == *"Up"* ]]; then
    show_message "Container is running!"
    show_message "You can access the application at: http://localhost:3000"
  else
    show_warning "Container may not have started properly. Check logs with: docker logs lucas-portfolio-prod"
  fi
fi
