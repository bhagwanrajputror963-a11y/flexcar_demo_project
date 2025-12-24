#!/bin/bash

# Flexcar Promotions - Quick Start Script
# This script sets up and runs both backend and frontend

set -e

echo "🚀 Flexcar Promotions - Quick Start"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v ruby &> /dev/null; then
    echo -e "${RED}❌ Ruby is not installed${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites found${NC}"
echo ""

# Backend setup
echo "🔧 Setting up Rails Backend..."
echo "------------------------------"

if [ ! -d "vendor/bundle" ]; then
    echo "Installing Ruby gems..."
    bundle install
fi

# Check if database exists
if ! rails db:version &> /dev/null; then
    echo "Creating database..."
    rails db:create
    rails db:migrate
    echo "Seeding sample data..."
    rails db:seed
else
    echo -e "${YELLOW}Database already exists. Skipping creation.${NC}"
    read -p "Do you want to reset the database? (y/N): " reset_db
    if [[ $reset_db =~ ^[Yy]$ ]]; then
        echo "Resetting database..."
        rails db:drop db:create db:migrate db:seed
    fi
fi

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

# Frontend setup
echo "🎨 Setting up Next.js Frontend..."
echo "--------------------------------"

cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cp .env.local.example .env.local
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

cd ..

# Ask if user wants to start servers
echo "🎯 Setup Complete!"
echo "=================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start Rails backend (Terminal 1):"
echo -e "   ${YELLOW}cd $(pwd)${NC}"
echo -e "   ${YELLOW}rails server${NC}"
echo ""
echo "2. Start Next.js frontend (Terminal 2):"
echo -e "   ${YELLOW}cd $(pwd)/frontend${NC}"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3. Open your browser:"
echo -e "   ${GREEN}http://localhost:3001${NC}"
echo ""

read -p "Do you want to start the servers now? (y/N): " start_servers

if [[ $start_servers =~ ^[Yy]$ ]]; then
    echo ""
    echo "Starting servers..."
    echo ""
    
    # Start Rails in background
    echo "Starting Rails server on port 3000..."
    rails server &
    RAILS_PID=$!
    
    # Wait a bit for Rails to start
    sleep 3
    
    # Start Next.js in background
    echo "Starting Next.js server on port 3001..."
    cd frontend
    npm run dev &
    NEXTJS_PID=$!
    
    cd ..
    
    echo ""
    echo -e "${GREEN}✓ Both servers are running!${NC}"
    echo ""
    echo "Rails API: http://localhost:3000"
    echo "Frontend:  http://localhost:3001"
    echo ""
    echo "Press Ctrl+C to stop both servers"
    echo ""
    
    # Trap Ctrl+C and kill both processes
    trap "echo ''; echo 'Stopping servers...'; kill $RAILS_PID $NEXTJS_PID 2>/dev/null; exit" INT
    
    # Wait for processes
    wait
else
    echo ""
    echo -e "${YELLOW}Servers not started. Follow the instructions above to start them manually.${NC}"
fi
