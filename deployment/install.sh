#!/bin/bash

# SafeGoods Deployment Script
# This script sets up the SafeGoods application on any web server

echo "======================================"
echo "SafeGoods Application Installer"
echo "======================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_status "Node.js $(node -v) detected"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    print_status "npm $(npm -v) detected"
}

# Function to get user input
get_input() {
    local prompt="$1"
    local var_name="$2"
    local default_value="$3"
    
    if [ -n "$default_value" ]; then
        read -p "$prompt [$default_value]: " input
        if [ -z "$input" ]; then
            input="$default_value"
        fi
    else
        read -p "$prompt: " input
        while [ -z "$input" ]; do
            read -p "$prompt (required): " input
        done
    fi
    
    eval "$var_name='$input'"
}

# Function to get password input
get_password() {
    local prompt="$1"
    local var_name="$2"
    
    read -s -p "$prompt: " input
    echo
    while [ -z "$input" ]; do
        read -s -p "$prompt (required): " input
        echo
    done
    
    eval "$var_name='$input'"
}

# Main installation process
main() {
    print_header "=== System Requirements Check ==="
    check_nodejs
    check_npm
    echo ""
    
    print_header "=== Supabase Configuration ==="
    echo "Please provide your Supabase project details:"
    echo "You can find these in your Supabase dashboard at https://supabase.com/dashboard"
    echo ""
    
    get_input "Supabase Project URL (e.g., https://xxxxx.supabase.co)" SUPABASE_URL
    get_input "Supabase Anon Key" SUPABASE_ANON_KEY
    echo ""
    
    print_header "=== Application Configuration ==="
    get_input "Application Name" APP_NAME "SafeGoods Verification Hub"
    get_input "Application Domain (for production)" APP_DOMAIN "localhost:3000"
    echo ""
    
    print_header "=== Admin User Creation ==="
    echo "Create a default admin user for your application:"
    get_input "Admin Email" ADMIN_EMAIL "admin@${APP_DOMAIN}"
    get_password "Admin Password" ADMIN_PASSWORD
    get_input "Admin First Name" ADMIN_FIRST_NAME "Administrator"
    get_input "Admin Last Name" ADMIN_LAST_NAME "User"
    echo ""
    
    print_status "Installing dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    
    print_status "Creating environment configuration..."
    
    # Create the configuration file
    cat > .env.local << EOL
# Supabase Configuration
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Application Configuration
VITE_APP_NAME=${APP_NAME}
VITE_APP_DOMAIN=${APP_DOMAIN}
EOL
    
    # Update the Supabase configuration in the code
    cat > src/lib/supabase.ts << EOL
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = '${SUPABASE_URL}';
const supabaseAnonKey = '${SUPABASE_ANON_KEY}';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database - updated with new fields
export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: 'consumer' | 'manufacturer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Manufacturer {
  id: string;
  user_id: string;
  company_name: string;
  registration_number: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postal_code?: string;
  website?: string;
  description: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  manufacturer_id: string;
  category_id: string;
  name: string;
  description: string;
  ingredients: string;
  manufacturing_date: string;
  expiry_date: string;
  batch_number: string;
  certification_number?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  nutri_score?: 'A' | 'B' | 'C' | 'D' | 'E';
  country?: string;
  state?: string;
  city?: string;
  allergens?: string[];
  nutrition_facts?: any;
  certification_documents?: string[];
  created_at: string;
  updated_at: string;
  manufacturer?: Manufacturer;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Verification {
  id: string;
  user_id?: string;
  product_id?: string;
  search_query?: string;
  result: 'verified' | 'not_found' | 'counterfeit';
  created_at: string;
  product?: Product;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  scan_limit?: number;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  starts_at: string;
  ends_at?: string;
  is_active: boolean;
  created_at: string;
  plan?: SubscriptionPlan;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface ProductReport {
  id: string;
  user_id?: string;
  product_id: string;
  reason: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}
EOL
    
    print_status "Building application..."
    npm run build
    
    if [ $? -ne 0 ]; then
        print_error "Failed to build application"
        exit 1
    fi
    
    print_status "Creating admin user setup script..."
    cat > create_admin.js << EOL
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('${SUPABASE_URL}', '${SUPABASE_ANON_KEY}');

async function createAdminUser() {
    try {
        console.log('Creating admin user...');
        
        const { data, error } = await supabase.auth.signUp({
            email: '${ADMIN_EMAIL}',
            password: '${ADMIN_PASSWORD}',
            options: {
                data: {
                    first_name: '${ADMIN_FIRST_NAME}',
                    last_name: '${ADMIN_LAST_NAME}',
                    role: 'super_admin'
                }
            }
        });
        
        if (error) {
            console.error('Error creating admin user:', error.message);
            return;
        }
        
        console.log('Admin user created successfully!');
        console.log('Email:', '${ADMIN_EMAIL}');
        console.log('You can now login to your application.');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

createAdminUser();
EOL
    
    print_status "Setting up admin user..."
    node create_admin.js
    rm create_admin.js
    
    print_status "Creating deployment scripts..."
    
    # Create start script
    cat > start.sh << 'EOL'
#!/bin/bash
echo "Starting SafeGoods Application..."
npm run preview -- --host 0.0.0.0 --port 3000
EOL
    
    chmod +x start.sh
    
    # Create production deployment script
    cat > deploy_production.sh << 'EOL'
#!/bin/bash
echo "Deploying to production..."

# Build for production
npm run build

# Copy files to web server directory (adjust path as needed)
# cp -r dist/* /var/www/html/

echo "Production build completed. Files are in the 'dist' directory."
echo "Copy the contents of 'dist' directory to your web server's document root."
EOL
    
    chmod +x deploy_production.sh
    
    print_status "Creating documentation..."
    cat > DEPLOYMENT_README.md << EOL
# SafeGoods Deployment Guide

## Installation Completed Successfully!

Your SafeGoods application has been configured with the following settings:

- **Supabase URL**: ${SUPABASE_URL}
- **Application Domain**: ${APP_DOMAIN}
- **Admin Email**: ${ADMIN_EMAIL}

## Next Steps

### 1. Development Mode
To run the application in development mode:
\`\`\`bash
npm run dev
\`\`\`

### 2. Production Preview
To run a production preview:
\`\`\`bash
./start.sh
\`\`\`

### 3. Production Deployment
To deploy to production:
\`\`\`bash
./deploy_production.sh
\`\`\`

Then copy the contents of the \`dist\` directory to your web server.

### 4. Web Server Configuration

#### Apache
Create a \`.htaccess\` file in your web root:
\`\`\`
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
\`\`\`

#### Nginx
Add this to your server configuration:
\`\`\`
location / {
    try_files \$uri \$uri/ /index.html;
}
\`\`\`

## Database Setup

Make sure your Supabase database has been properly configured with the required tables.
You can run the SQL migrations from the \`supabase/migrations\` directory in your Supabase SQL editor.

## Admin Access

- **URL**: http://${APP_DOMAIN}
- **Email**: ${ADMIN_EMAIL}
- **Password**: [The password you provided during installation]

## Support

For support and documentation, visit: https://docs.lovable.dev

## Security Notes

1. Change the default admin password after first login
2. Configure proper SSL certificates for production
3. Set up proper backup procedures for your Supabase database
4. Review and configure Row Level Security (RLS) policies in Supabase
EOL
    
    echo ""
    print_header "=== Installation Complete ==="
    print_status "SafeGoods has been successfully installed!"
    echo ""
    echo "📁 Application files are ready"
    echo "🔧 Configuration completed"
    echo "👤 Admin user created"
    echo "📋 Documentation generated"
    echo ""
    print_status "To start the application:"
    echo "   Development: npm run dev"
    echo "   Production:  ./start.sh"
    echo ""
    print_status "Admin Login:"
    echo "   URL: http://${APP_DOMAIN}"
    echo "   Email: ${ADMIN_EMAIL}"
    echo ""
    print_warning "Please read DEPLOYMENT_README.md for detailed deployment instructions."
    echo ""
    print_header "=== Happy deploying! ==="
}

# Run the main function
main
