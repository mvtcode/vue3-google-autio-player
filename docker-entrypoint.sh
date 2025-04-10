#!/bin/sh

# Khởi động Express backend ở chế độ background
echo "Starting Express server..."
cd /app/server
node server.js &

# Khởi động Nginx ở foreground
echo "Starting Nginx..."
nginx -g "daemon off;" 