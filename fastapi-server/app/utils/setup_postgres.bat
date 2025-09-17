@echo off
echo =================================================
echo    ARGO Data PostgreSQL Setup Script
echo =================================================
echo.

echo 1. Installing Python dependencies...
pip install -r requirements.txt
echo.

echo 2. PostgreSQL Connection Setup
echo =================================================
echo There are 3 ways to configure your PostgreSQL connection:
echo.
echo   Option A: Edit database_config.ini file with your credentials
echo   Option B: Let the script try common passwords automatically  
echo   Option C: Enter credentials when prompted
echo.
echo The script will try these methods in order.
echo.

echo 3. Common PostgreSQL default passwords:
echo   - postgres
echo   - admin  
echo   - root
echo   - password
echo   - 123456
echo   - (empty password)
echo.

pause
echo.
echo 4. Running the ARGO data import...
python postgres.py

echo.
echo =================================================
echo    Setup Complete!
echo =================================================
pause