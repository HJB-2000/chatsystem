#!/usr/bin/env bash

# Exit immediately on unhandled error
set -e

PROJECT_NAME=$(basename "$PWD")
GOINFRE_DIR="/goinfre/$USER/$PROJECT_NAME"

echo "=== 1337 Environment Setup for: $PROJECT_NAME ==="

# 1. Ensure /goinfre directory structure exists
mkdir -p "$GOINFRE_DIR/node_modules"
mkdir -p "/goinfre/$USER/.npm_cache"

# 2. Set npm cache environment to /goinfre
export NPM_CONFIG_CACHE="/goinfre/$USER/.npm_cache"

# 3. Handle local node_modules link
if [ -d "node_modules" ] && [ ! -L "node_modules" ]; then
    echo "[!] Existing directory 'node_modules' found in home directory."
    echo "[!] Moving existing packages to /goinfre to save home space..."
    cp -rn node_modules/* "$GOINFRE_DIR/node_modules/" 2>/dev/null || true
    rm -rf node_modules
fi

if [ ! -L "node_modules" ]; then
    echo "[+] Linking project node_modules -> $GOINFRE_DIR/node_modules"
    ln -s "$GOINFRE_DIR/node_modules" node_modules
fi

# 4. Check if dependencies are installed
if [ ! -f "node_modules/.bin/nest" ] && [ ! -f "node_modules/.package-lock.json" ] && [ -f "package.json" ]; then
    echo "[+] Missing dependencies detected. Running 'npm install' in /goinfre..."
    npm install
else
    echo "[✓] node_modules present in /goinfre and properly linked."
fi

echo "=== Setup complete! You are ready to develop and push to GitHub. ==="
