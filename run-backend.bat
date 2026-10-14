@echo off
title CampusFind - Spring Boot Backend (Port 8080)
cd /d "%~dp0campusfind-backend"
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot"
set "PATH=%~dp0..\tools\apache-maven-3.9.6\bin;%JAVA_HOME%\bin;%PATH%"
echo Starting CampusFind Spring Boot Backend...
echo Swagger UI will be available at: http://localhost:8080/swagger-ui.html
echo.
call mvn.cmd spring-boot:run
pause
