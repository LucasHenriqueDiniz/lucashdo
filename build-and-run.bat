@echo off
echo Building and running Docker container for portfolio website...

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Display architecture info
echo Current architecture: 
wmic os get OSArchitecture

REM Build the Docker image
echo Building Docker image...
docker compose build --no-cache
if %ERRORLEVEL% neq 0 (
    echo Build failed. Check the logs above for errors.
    pause
    exit /b 1
)

echo Build completed successfully!

REM Ask if user wants to run the container
set /p run_now="Do you want to run the container now? (y/n) "
if /i "%run_now%"=="y" (
    echo Starting container...
    docker compose up -d
    
    REM Wait for container to be ready
    echo Waiting for the application to start...
    timeout /t 5 /nobreak > nul
    
    REM Check if container is running
    for /f "tokens=*" %%i in ('docker ps --filter "name=lucas-portfolio" --format "{{.Status}}"') do set CONTAINER_STATUS=%%i
    
    echo Container status: %CONTAINER_STATUS%
    
    if not "%CONTAINER_STATUS%"=="" (
        if "%CONTAINER_STATUS:~0,2%"=="Up" (
            echo Container is running!
            echo You can access the application at: http://localhost:3000
        ) else (
            echo Container may not have started properly. Check logs with: docker compose logs
        )
    ) else (
        echo Container not found. Something went wrong.
    )
)

echo Done!
pause
