
@echo off
echo Creating SafeGoods Windows Deployment Package...

REM Create package structure
if exist safegoods-windows-package rmdir /s /q safegoods-windows-package
mkdir safegoods-windows-package

REM Copy application source (excluding build artifacts)
echo Copying application source...
xcopy /E /I /H /Y ..\ safegoods-windows-package\ /EXCLUDE:exclude_list.txt

REM Copy deployment files
echo Copying deployment scripts...
xcopy /E /I /Y .\* safegoods-windows-package\deployment\

REM Create package metadata
echo SafeGoods Windows Deployment Package > safegoods-windows-package\PACKAGE_INFO.txt
echo ===================================== >> safegoods-windows-package\PACKAGE_INFO.txt
echo. >> safegoods-windows-package\PACKAGE_INFO.txt
echo Version: 1.0.0 >> safegoods-windows-package\PACKAGE_INFO.txt
echo Created: %date% %time% >> safegoods-windows-package\PACKAGE_INFO.txt
echo Package Type: Windows Shared Hosting Compatible >> safegoods-windows-package\PACKAGE_INFO.txt
echo. >> safegoods-windows-package\PACKAGE_INFO.txt
echo Contents: >> safegoods-windows-package\PACKAGE_INFO.txt
echo - Complete React application source code >> safegoods-windows-package\PACKAGE_INFO.txt
echo - Windows installation scripts >> safegoods-windows-package\PACKAGE_INFO.txt
echo - Shared hosting configuration >> safegoods-windows-package\PACKAGE_INFO.txt
echo - Database setup guide >> safegoods-windows-package\PACKAGE_INFO.txt
echo - Step-by-step installation guide >> safegoods-windows-package\PACKAGE_INFO.txt
echo. >> safegoods-windows-package\PACKAGE_INFO.txt
echo Installation: >> safegoods-windows-package\PACKAGE_INFO.txt
echo 1. Extract this package >> safegoods-windows-package\PACKAGE_INFO.txt
echo 2. Run: install_windows.bat >> safegoods-windows-package\PACKAGE_INFO.txt
echo 3. Follow the setup wizard >> safegoods-windows-package\PACKAGE_INFO.txt
echo. >> safegoods-windows-package\PACKAGE_INFO.txt
echo Requirements: >> safegoods-windows-package\PACKAGE_INFO.txt
echo - Windows web hosting with Node.js support >> safegoods-windows-package\PACKAGE_INFO.txt
echo - Supabase account (free) >> safegoods-windows-package\PACKAGE_INFO.txt
echo - FTP/File Manager access >> safegoods-windows-package\PACKAGE_INFO.txt

REM Make installation script executable
copy install_windows.bat safegoods-windows-package\

REM Create zip file using PowerShell
echo Creating ZIP package...
powershell -command "Compress-Archive -Path 'safegoods-windows-package' -DestinationPath 'safegoods-windows-deployment.zip' -Force"

echo.
echo ✅ Windows package created successfully!
echo.
echo 📦 File created: safegoods-windows-deployment.zip
echo 📋 Package size:
dir safegoods-windows-deployment.zip
echo.
echo 🚀 Ready for manual upload to your web hosting!
echo.
echo To deploy:
echo 1. Upload safegoods-windows-deployment.zip to your hosting control panel
echo 2. Extract it using the file manager
echo 3. Run install_windows.bat or follow INSTALLATION_GUIDE.md
echo.
pause
