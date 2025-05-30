
# SafeGoods Complete Installation Guide

## Overview
This package contains everything needed to deploy the SafeGoods Product Verification System on any web server while using Supabase as the backend database.

## What's Included
- Complete React application source code
- Automated installation script
- Docker deployment option
- Database migration scripts
- Documentation and guides

## Prerequisites

### System Requirements
- **Node.js**: Version 18 or higher
- **npm**: Package manager (comes with Node.js)
- **Web Server**: Apache, Nginx, or any static file server
- **Supabase Account**: Free account at https://supabase.com

### Supabase Setup
Before installation, you need:
1. Create a free Supabase account
2. Create a new project
3. Note your project URL and anon key
4. Run the database migrations (provided in the package)

## Installation Methods

### Method 1: Automated Installation (Recommended)

1. **Download and Extract**
   ```bash
   # Extract the package
   tar -xzf safegoods-deployment.tar.gz
   cd safegoods-deployment
   ```

2. **Run Installation Script**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

3. **Follow Interactive Prompts**
   - Enter your Supabase project details
   - Configure application settings
   - Create admin user
   - Complete installation

### Method 2: Docker Deployment

1. **Prerequisites**
   - Docker and Docker Compose installed

2. **Setup Environment**
   ```bash
   cd deployment/docker
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

### Method 3: Manual Installation

1. **Install Dependencies**
   ```bash
   cd app
   npm install
   ```

2. **Configure Supabase**
   Edit `src/lib/supabase.ts` with your credentials

3. **Build Application**
   ```bash
   npm run build
   ```

4. **Deploy**
   Copy `dist/` contents to your web server

## Database Setup

### Required Tables
Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('consumer', 'manufacturer', 'admin', 'super_admin', 'test_user');
CREATE TYPE product_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');
CREATE TYPE verification_result AS ENUM ('verified', 'not_found', 'counterfeit');

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'consumer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add other tables as needed (full schema provided in migrations folder)
```

## Web Server Configuration

### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Post-Installation

### 1. Admin Access
- URL: Your configured domain
- Email: As set during installation
- Password: As set during installation

### 2. Security Configuration
- Change default admin password
- Configure SSL certificates
- Set up proper CORS policies in Supabase
- Review Row Level Security (RLS) policies

### 3. Application Configuration
- Configure authentication providers
- Set up email templates
- Configure API integrations
- Customize branding

## Features Included

### Core Features
- Product verification by barcode/name
- User authentication and authorization
- Admin dashboard for user/product management
- Real-time search with external API integration
- Mobile-responsive design

### API Integrations
- OpenFoodFacts API for product data
- NAFDAC API for regulatory information
- Supabase Edge Functions for backend logic

### User Roles
- **Consumer**: Basic verification access
- **Manufacturer**: Product management
- **Admin**: User and system management
- **Super Admin**: Full system control

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure Node.js 18+ is installed
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure tables are created

3. **Authentication Problems**
   - Configure Site URL in Supabase
   - Set proper redirect URLs
   - Check email confirmation settings

### Support Resources
- Documentation: https://docs.lovable.dev
- Supabase Docs: https://supabase.com/docs
- Community Support: Available through documentation links

## Backup and Maintenance

### Database Backups
- Enable automatic backups in Supabase
- Regular exports of critical data
- Test restore procedures

### Application Updates
- Keep dependencies updated
- Monitor security advisories
- Test updates in staging environment

## License and Support

This application is provided as-is with installation support through the included documentation. For extended support or customization, consider professional services.

---

**Important**: Always test the installation in a staging environment before deploying to production.
