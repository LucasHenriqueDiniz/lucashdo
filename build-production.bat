@echo off
setlocal EnableDelayedExpansion

echo Next.js Portfolio Website Production Docker Builder
echo This script will create a production-ready Docker image for your portfolio

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Generate unique tag based on date
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TAG=portfolio-%datetime:~0,8%-%datetime:~8,6%
set IMAGE_NAME=lucas-portfolio:%TAG%

REM Build the Docker image with proper tags
echo Building production Docker image: %IMAGE_NAME%
docker build ^
  --build-arg NODE_ENV=production ^
  --build-arg NEXT_TELEMETRY_DISABLED=1 ^
  --build-arg NEXT_OUTPUT_STANDALONE=true ^
  -t %IMAGE_NAME% .

REM Check if build was successful
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed. Check the logs above for errors.
    pause
    exit /b 1
)

REM Display success message and next steps
echo Build completed successfully!
echo The image has been tagged as: %IMAGE_NAME%
echo.
echo To run this image:
echo docker run -p 3000:3000 -e NODE_ENV=production %IMAGE_NAME%
echo.
echo To push to a registry:
echo 1. Tag the image: docker tag %IMAGE_NAME% your-registry/lucas-portfolio:latest
echo 2. Push the image: docker push your-registry/lucas-portfolio:latest

REM Ask if user wants to run the container
set /p run_now="Do you want to run the container now? (y/n) "
if /i "%run_now%"=="y" (
    echo Starting container...
    docker run --name lucas-portfolio-prod -p 3000:3000 -d %IMAGE_NAME%
    
    REM Wait for container to be ready
    echo Waiting for the application to start...
    timeout /t 5 /nobreak > nul
    
    REM Check if container is running
    for /f "tokens=*" %%i in ('docker ps --filter "name=lucas-portfolio-prod" --format "{{.Status}}"') do set CONTAINER_STATUS=%%i
    
    if not "!CONTAINER_STATUS!"=="" (
        echo Container status: !CONTAINER_STATUS!
        if "!CONTAINER_STATUS:~0,2!"=="Up" (
            echo Container is running!
            echo You can access the application at: http://localhost:3000
        ) else (
            echo Container may not have started properly. Check logs with: docker logs lucas-portfolio-prod
        )
    ) else (
        echo Container not found. Something went wrong.
    )
)

pause
