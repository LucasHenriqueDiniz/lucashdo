@echo off
REM Script to set up a Windows scheduled task for lint checking

echo Setting up scheduled task for daily lint checks...

REM Get the current directory
set PROJECT_DIR=%cd%

REM Create a task that runs daily at midnight
schtasks /create /tn "Portfolio Website Lint Check" /tr "cd /d %PROJECT_DIR% && npm run lint-check" /sc daily /st 00:00

echo Task created successfully! You can view it in Task Scheduler.
echo The lint check will run daily at midnight.
