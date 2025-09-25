@echo off
echo Starting EventHub Application Setup...
echo.

echo 1. Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo Node.js is installed.
echo.

echo 2. Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies.
    pause
    exit /b 1
)

echo.
echo 3. Starting the EventHub server...
echo.
echo The application will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server.
echo.

npm start