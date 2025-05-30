
#!/bin/bash

# Create Complete Deployment Package
echo "Creating SafeGoods Complete Deployment Package..."

# Create package structure
rm -rf safegoods-complete-package
mkdir -p safegoods-complete-package

# Copy application source (excluding build artifacts and sensitive files)
echo "Copying application source..."
rsync -av \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  --exclude='.env*' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  --exclude='*.tar.gz' \
  --exclude='*.zip' \
  ../../ safegoods-complete-package/

# Copy deployment files
echo "Copying deployment scripts..."
cp -r ./* safegoods-complete-package/deployment/

# Create package metadata
cat > safegoods-complete-package/PACKAGE_INFO.txt << 'EOL'
SafeGoods Complete Deployment Package
=====================================

Version: 1.0.0
Created: $(date)
Package Type: Complete Application with Supabase Backend

Contents:
- Complete React application source code
- Automated installation scripts
- Docker deployment configurations
- Database migration scripts
- Comprehensive documentation
- Web server configuration examples

Installation:
1. Extract this package
2. Run: chmod +x install.sh && ./install.sh
3. Follow the interactive setup

Requirements:
- Node.js 18+
- Supabase account (free)
- Web server (Apache/Nginx)

For detailed instructions, see deployment/INSTALLATION_GUIDE.md
EOL

# Make installation script executable
chmod +x safegoods-complete-package/install.sh

# Create compressed packages
echo "Creating compressed packages..."

# Create tar.gz
tar -czf safegoods-complete-deployment.tar.gz safegoods-complete-package/

# Create zip for Windows users
zip -r safegoods-complete-deployment.zip safegoods-complete-package/

# Create checksums
echo "Generating checksums..."
sha256sum safegoods-complete-deployment.tar.gz > safegoods-complete-deployment.tar.gz.sha256
sha256sum safegoods-complete-deployment.zip > safegoods-complete-deployment.zip.sha256

echo ""
echo "✅ Package creation complete!"
echo ""
echo "📦 Files created:"
echo "   - safegoods-complete-deployment.tar.gz (Linux/Mac)"
echo "   - safegoods-complete-deployment.zip (Windows)"
echo "   - Checksum files for verification"
echo ""
echo "📋 Package size:"
du -h safegoods-complete-deployment.*
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "To deploy on a server:"
echo "1. Upload safegoods-complete-deployment.tar.gz to your server"
echo "2. Extract: tar -xzf safegoods-complete-deployment.tar.gz"
echo "3. Run: cd safegoods-complete-package && ./install.sh"
echo ""
echo "For Docker deployment:"
echo "1. Extract the package"
echo "2. Navigate to deployment/docker/"
echo "3. Configure .env file"
echo "4. Run: docker-compose up -d"
