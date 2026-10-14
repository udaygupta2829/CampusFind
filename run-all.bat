@echo off
title CampusFind - Starter
echo ====================================================
echo   Starting CampusFind Full-Stack Portal
echo ====================================================
echo.
echo Launching Spring Boot Backend...
start "CampusFind Backend" cmd /c "%~dp0run-backend.bat"
timeout /t 5 >nul
echo Launching React Frontend...
start "CampusFind Frontend" cmd /c "%~dp0run-frontend.bat"
echo.
echo Backend URL:  http://localhost:8080/swagger-ui.html
echo Frontend URL: http://localhost:5173
echo.
echo Opening browser in 3 seconds...
timeout /t 3 >nul
start http://localhost:5173
