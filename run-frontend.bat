@echo off
title CampusFind - React Frontend (Port 5173)
cd /d "%~dp0campusfind-frontend"
set "PATH=%~dp0..\tools\node-v20.18.0-win-x64;%PATH%"
echo Starting CampusFind React Frontend...
echo Open your browser at: http://localhost:5173
echo.
npm run dev
pause
