#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
VENV_DIR="$BACKEND_DIR/venv"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Starting LD O11y Jam Project${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    if [ ! -z "$BACKEND_PID" ] && kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo -e "${GREEN}Backend stopped${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo -e "${GREEN}Frontend stopped${NC}"
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM

# Setup Backend
echo -e "${BLUE}[1/4] Setting up Python backend...${NC}"
cd "$BACKEND_DIR"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
    echo -e "${GREEN}Virtual environment created${NC}"
else
    echo -e "${GREEN}Virtual environment already exists${NC}"
fi

# Activate virtual environment
source venv/bin/activate

# Install/upgrade pip
echo -e "${YELLOW}Ensuring pip is up to date...${NC}"
pip install --upgrade pip -q

# Install Python dependencies
echo -e "${YELLOW}Installing Python dependencies...${NC}"
pip install -r requirements.txt -q
echo -e "${GREEN}Python dependencies installed${NC}\n"

# Setup Frontend
echo -e "${BLUE}[2/4] Setting up Node.js frontend...${NC}"
cd "$FRONTEND_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

# Install Node dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
    npm install
    echo -e "${GREEN}Node.js dependencies installed${NC}\n"
else
    echo -e "${GREEN}Node.js dependencies already installed${NC}\n"
fi

# Start Backend
echo -e "${BLUE}[3/4] Starting backend server...${NC}"
cd "$BACKEND_DIR"
source venv/bin/activate
python app.py &
BACKEND_PID=$!
echo -e "${GREEN}Backend started on http://localhost:5001 (PID: $BACKEND_PID)${NC}\n"

# Wait a moment for backend to start
sleep 2

# Start Frontend
echo -e "${BLUE}[4/4] Building and starting frontend production server...${NC}"
cd "$FRONTEND_DIR"
echo -e "${YELLOW}Building production bundle...${NC}"
npm run build
echo -e "${GREEN}Production build complete${NC}"
echo -e "${YELLOW}Starting production server...${NC}"
npx -y serve -s build -l 3000 &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)${NC}\n"

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}All services are running!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Backend:  ${GREEN}http://localhost:5001${NC}"
echo -e "Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "\nPress ${YELLOW}Ctrl+C${NC} to stop all services\n"

# Wait for both processes
wait
