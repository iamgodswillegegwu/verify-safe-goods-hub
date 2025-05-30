
#!/bin/bash

# Package Creator Script
# Creates a complete deployment package for SafeGoods

echo "Creating SafeGoods Deployment Package..."

# Create deployment directory structure
mkdir -p safegoods-deployment/{app,scripts,docs}

# Copy application files
echo "Copying application files..."
rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='.env*' ../ safegoods-deployment/app/

# Copy deployment scripts
cp install.sh safegoods-deployment/
chmod +x safegoods-deployment/install.sh

# Create package information
cat > safegoods-deployment/PACKAGE_INFO.md << 'EOL'
# SafeGoods Deployment Package

## Contents
- `app/` - Complete application source code
- `install.sh` - Automated installation script
- `README.md` - This file

## System Requirements
- Node.js 18 or higher
- npm package manager
- Active Supabase account and project

## Quick Install
1. Extract this package to your desired directory
2. Navigate to the extracted directory
3. Run: `chmod +x install.sh && ./install.sh`
4. Follow the interactive prompts

## Manual Installation
If you prefer manual setup:
1. Navigate to the `app/` directory
2. Run `npm install`
3. Configure your Supabase credentials in `src/lib/supabase.ts`
4. Run `npm run build`
5. Deploy the `dist/` directory to your web server

## Support
Visit https://docs.lovable.dev for detailed documentation.
EOL

# Create the package archive
echo "Creating deployment archive..."
tar -czf safegoods-deployment.tar.gz safegoods-deployment/

# Create zip alternative
zip -r safegoods-deployment.zip safegoods-deployment/

echo "Package created successfully!"
echo "Files created:"
echo "  - safegoods-deployment.tar.gz"
echo "  - safegoods-deployment.zip"
echo ""
echo "To deploy:"
echo "1. Upload either archive to your server"
echo "2. Extract: tar -xzf safegoods-deployment.tar.gz"
echo "3. Run: cd safegoods-deployment && ./install.sh"
