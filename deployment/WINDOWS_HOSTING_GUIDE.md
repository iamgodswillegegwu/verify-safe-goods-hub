
# SafeGoods Windows Hosting Deployment Guide

## Overview
This guide will help you deploy SafeGoods to Windows-based shared hosting using manual upload through your hosting control panel.

## Prerequisites
- Windows hosting account with:
  - Static file hosting support
  - FTP or File Manager access
  - Optional: Node.js support (for local building)
- Supabase account (free at https://supabase.com)

## Step-by-Step Installation

### 1. Download and Prepare Package
1. Download `safegoods-windows-deployment.zip`
2. Extract the zip file to your local computer
3. Open the extracted folder

### 2. Configure the Application
1. Double-click `install_windows.bat` to run the installation wizard
2. Follow the prompts to:
   - Enter your Supabase project details
   - Configure application settings
   - Set up admin user credentials
3. The script will build the application and create deployment files

### 3. Upload to Your Hosting
1. **Locate Build Files**: After installation, find the `dist` folder
2. **Access Control Panel**: Log into your hosting control panel
3. **File Manager**: Open the File Manager or FTP client
4. **Upload Files**: 
   - Navigate to your website's public directory (usually `public_html`, `wwwroot`, or `htdocs`)
   - Upload ALL contents of the `dist` folder
   - Make sure to upload the `.htaccess` file (for Apache) or `web.config` (for IIS)

### 4. Configure URL Rewriting
Your hosting needs to support URL rewriting for the single-page app to work:

#### For Apache Hosting
- The `.htaccess` file is automatically created and should be uploaded
- Contains rewrite rules for React Router

#### For IIS/Windows Hosting
- The `web.config` file is automatically created and should be uploaded
- Contains URL rewrite rules for IIS

### 5. Set Up Supabase Database
1. Log into your Supabase dashboard
2. Go to SQL Editor
3. Run the database migrations from `deployment/INSTALLATION_GUIDE.md`
4. Set up Row Level Security policies

### 6. Test Your Installation
1. Visit your website domain
2. You should see the SafeGoods homepage
3. Try logging in with your admin credentials
4. Test product verification functionality

## Common Hosting Control Panels

### cPanel
1. Login to cPanel
2. Go to "File Manager"
3. Navigate to `public_html`
4. Upload and extract files
5. Ensure `.htaccess` is present

### Plesk
1. Login to Plesk
2. Go to "Files"
3. Navigate to `httpdocs`
4. Upload files
5. Check file permissions

### DirectAdmin
1. Login to DirectAdmin
2. Go to "File Manager"
3. Navigate to `domains/yourdomain.com/public_html`
4. Upload files

## Troubleshooting

### Common Issues

1. **404 Errors on Page Refresh**
   - Ensure `.htaccess` or `web.config` is uploaded
   - Check if your hosting supports URL rewriting

2. **Blank Page**
   - Check browser console for errors
   - Verify all files were uploaded correctly
   - Ensure Supabase configuration is correct

3. **Database Connection Issues**
   - Verify Supabase URL and key in configuration
   - Check if database tables are created
   - Ensure RLS policies are set up

### File Permissions
If you encounter permission issues:
- Set folder permissions to 755
- Set file permissions to 644
- Ensure web server can read all files

## Security Checklist
- [ ] Change default admin password after first login
- [ ] Set up SSL certificate (HTTPS)
- [ ] Configure proper CORS settings in Supabase
- [ ] Review and test RLS policies
- [ ] Set up regular database backups

## Support Resources
- Supabase Documentation: https://supabase.com/docs
- Your hosting provider's support documentation
- SafeGoods deployment guide: `INSTALLATION_GUIDE.md`

## File Structure After Upload
```
public_html/
├── index.html
├── assets/
│   ├── css files
│   └── js files
├── .htaccess (for Apache)
├── web.config (for IIS)
└── other static assets
```

Remember: Your hosting must support serving static files and URL rewriting for single-page applications.
