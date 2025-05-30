
#!/bin/sh

# SafeGoods Docker Entrypoint Script

echo "Starting SafeGoods Application..."

# Replace environment variables in built files if needed
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_ANON_KEY" ]; then
    echo "Configuring Supabase connection..."
    # Note: In production, you'd want to handle this more securely
fi

echo "Application configured successfully!"
echo "Starting Nginx..."

# Start nginx
nginx -g 'daemon off;'
