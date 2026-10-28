@echo off
title Push HotelPro to GitHub
echo ==========================================================
echo Pushing HotelPro to https://github.com/aryanjaiswal7206-design/hotelpro
echo ==========================================================

REM Set git path
set PATH=%PATH%;C:\Users\aryan\bin\git\cmd

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ==========================================================
    echo [SUCCESS] HotelPro successfully published to GitHub!
    echo Repository: https://github.com/aryanjaiswal7206-design/hotelpro
    echo ==========================================================
) else (
    echo.
    echo If prompted, please sign in with your GitHub account in the browser,
    echo or use a GitHub Personal Access Token (PAT).
)

pause
