# 🚀 Lucas Portfolio Website

This is a modern portfolio website built with Next.js, React 19, Tailwind CSS 4, and more.

## 🐳 Docker Setup

This project includes Docker configuration for easy deployment and consistent builds across different environments.

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine
- Docker Compose (comes with Docker Desktop)

### Quick Start

#### Using the Helper Scripts

**On Linux/macOS:**
```bash
# Make the script executable
chmod +x build-and-run.sh

# Run the script
./build-and-run.sh
```

**On Windows:**
```
# Double-click the batch file or run in Command Prompt
build-and-run.bat
```

#### Manual Setup

1. Create a `.env` file with your API keys (see `.env.example` for reference)

2. Build the Docker image:
```bash
docker compose build
```

3. Run the container:
```bash
docker compose up -d
```

4. Access the website at http://localhost:3000

### Environment Variables

Make sure to set up the following environment variables:

- `NEXT_PUBLIC_LASTFM_API_KEY`: Last.fm API key
- `NEXT_PUBLIC_STEAM_API_KEY`: Steam API key
- `NEXT_PUBLIC_STEAM_ID`: Your Steam ID
- `NEXT_PUBLIC_LYFTA_API_KEY`: Lyfta API key

## 🛠️ Development

For local development without Docker:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## 📦 Production Build

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 🧪 Testing and Linting

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```
