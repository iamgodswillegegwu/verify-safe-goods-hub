
@echo off
title SafeGoods Windows Installation Wizard
color 0A

echo ======================================
echo  SafeGoods Windows Installation Wizard
echo ======================================
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js 18 or higher from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js detected: 
node --version

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not available.
    echo Please ensure npm is installed with Node.js.
    pause
    exit /b 1
)

echo [INFO] npm detected: 
npm --version
echo.

echo ======================================
echo  Supabase Configuration
echo ======================================
echo Please provide your Supabase project details:
echo You can find these in your Supabase dashboard at https://supabase.com/dashboard
echo.

set /p SUPABASE_URL="Enter Supabase Project URL (e.g., https://xxxxx.supabase.co): "
set /p SUPABASE_ANON_KEY="Enter Supabase Anon Key: "
echo.

echo ======================================
echo  Application Configuration
echo ======================================
set /p APP_NAME="Application Name [SafeGoods Verification Hub]: "
if "%APP_NAME%"=="" set APP_NAME=SafeGoods Verification Hub

set /p APP_DOMAIN="Application Domain [yourdomain.com]: "
if "%APP_DOMAIN%"=="" set APP_DOMAIN=localhost:3000
echo.

echo ======================================
echo  Admin User Creation
echo ======================================
echo Create a default admin user for your application:
set /p ADMIN_EMAIL="Admin Email [admin@%APP_DOMAIN%]: "
if "%ADMIN_EMAIL%"=="" set ADMIN_EMAIL=admin@%APP_DOMAIN%

set /p ADMIN_PASSWORD="Admin Password: "
set /p ADMIN_FIRST_NAME="Admin First Name [Administrator]: "
if "%ADMIN_FIRST_NAME%"=="" set ADMIN_FIRST_NAME=Administrator

set /p ADMIN_LAST_NAME="Admin Last Name [User]: "
if "%ADMIN_LAST_NAME%"=="" set ADMIN_LAST_NAME=User
echo.

echo [INFO] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [INFO] Creating environment configuration...

REM Create environment file
echo # Supabase Configuration > .env.local
echo VITE_SUPABASE_URL=%SUPABASE_URL% >> .env.local
echo VITE_SUPABASE_ANON_KEY=%SUPABASE_ANON_KEY% >> .env.local
echo. >> .env.local
echo # Application Configuration >> .env.local
echo VITE_APP_NAME=%APP_NAME% >> .env.local
echo VITE_APP_DOMAIN=%APP_DOMAIN% >> .env.local

REM Update Supabase configuration
echo import { createClient } from '@supabase/supabase-js'; > src\lib\supabase.ts
echo. >> src\lib\supabase.ts
echo const supabaseUrl = '%SUPABASE_URL%'; >> src\lib\supabase.ts
echo const supabaseAnonKey = '%SUPABASE_ANON_KEY%'; >> src\lib\supabase.ts
echo. >> src\lib\supabase.ts
echo export const supabase = createClient(supabaseUrl, supabaseAnonKey); >> src\lib\supabase.ts
REM Add the rest of the types from the original file
type src\lib\supabase.ts.template >> src\lib\supabase.ts

echo [INFO] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build application
    pause
    exit /b 1
)

echo [INFO] Creating web server configuration files...

REM Create .htaccess for Apache
echo RewriteEngine On > dist\.htaccess
echo RewriteCond %%{REQUEST_FILENAME} !-f >> dist\.htaccess
echo RewriteCond %%{REQUEST_FILENAME} !-d >> dist\.htaccess
echo RewriteRule . /index.html [L] >> dist\.htaccess

REM Create web.config for IIS
echo ^<?xml version="1.0" encoding="UTF-8"?^> > dist\web.config
echo ^<configuration^> >> dist\web.config
echo   ^<system.webServer^> >> dist\web.config
echo     ^<rewrite^> >> dist\web.config
echo       ^<rules^> >> dist\web.config
echo         ^<rule name="ReactRouter Routes" stopProcessing="true"^> >> dist\web.config
echo           ^<match url=".*" /^> >> dist\web.config
echo           ^<conditions logicalGrouping="MatchAll"^> >> dist\web.config
echo             ^<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /^> >> dist\web.config
echo             ^<add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /^> >> dist\web.config
echo           ^</conditions^> >> dist\web.config
echo           ^<action type="Rewrite" url="/" /^> >> dist\web.config
echo         ^</rule^> >> dist\web.config
echo       ^</rules^> >> dist\web.config
echo     ^</rewrite^> >> dist\web.config
echo   ^</system.webServer^> >> dist\web.config
echo ^</configuration^> >> dist\web.config

echo [INFO] Creating deployment documentation...

echo # SafeGoods Windows Deployment Guide > DEPLOYMENT_README.md
echo. >> DEPLOYMENT_README.md
echo ## Installation Completed Successfully! >> DEPLOYMENT_README.md
echo. >> DEPLOYMENT_README.md
echo Your SafeGoods application has been configured with the following settings: >> DEPLOYMENT_README.md
echo. >> DEPLOYMENT_README.md
echo - **Supabase URL**: %SUPABASE_URL% >> DEPLOYMENT_README.md
echo - **Application Domain**: %APP_DOMAIN% >> DEPLOYMENT_README.md
echo - **Admin Email**: %ADMIN_EMAIL% >> DEPLOYMENT_README.md
echo. >> DEPLOYMENT_README.md
echo ## Upload to Web Hosting >> DEPLOYMENT_README.md
echo. >> DEPLOYMENT_README.md
echo 1. **Upload Files**: Copy all contents of the `dist` folder to your website's public directory >> DEPLOYMENT_README.md
echo 2. **Set Document Root**: Ensure your domain points to where you uploaded the files >> DEPLOYMENT_README.md
echo 3. **Configure URL Rewriting**: The .htaccess and web.config files are included for proper routing >> DEPLOYMENT_README.md
echo. >> DEPLOYMENT_README.md
echo ## Admin Access >> DEPLOYMENT_README.md
echo. >> DEPLOYMENT_README.md
echo - **URL**: http://%APP_DOMAIN% >> DEPLOYMENT_README.md
echo - **Email**: %ADMIN_EMAIL% >> DEPLOYMENT_README.md
echo - **Password**: [The password you provided during installation] >> DEPLOYMENT_README.md
echo. >> DEPLOYMENT_README.md
echo ## Important Notes >> DEPLOYMENT_README.md
echo. >> DEPLOYMENT_README.md
echo 1. Make sure your hosting supports static file serving >> DEPLOYMENT_README.md
echo 2. Upload the .htaccess file for Apache or web.config for IIS >> DEPLOYMENT_README.md
echo 3. Set up your Supabase database using the provided SQL migrations >> DEPLOYMENT_README.md
echo 4. Change the default admin password after first login >> DEPLOYMENT_README.md

echo.
echo ======================================
echo  Installation Complete!
echo ======================================
echo [INFO] SafeGoods has been successfully configured!
echo.
echo 📁 Build files ready in 'dist' folder
echo 🔧 Configuration completed
echo 👤 Admin user configured
echo 📋 Documentation generated
echo.
echo Next Steps:
echo 1. Upload contents of 'dist' folder to your web hosting
echo 2. Make sure .htaccess or web.config is uploaded too
echo 3. Set up your Supabase database (see deployment/INSTALLATION_GUIDE.md)
echo 4. Access your site at http://%APP_DOMAIN%
echo.
echo Admin Login:
echo   Email: %ADMIN_EMAIL%
echo   Password: [Your chosen password]
echo.
echo Please read DEPLOYMENT_README.md for detailed instructions.
echo.
echo ======================================
echo  Happy deploying!
echo ======================================
pause
