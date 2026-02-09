#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║         🏛️  PHOENIX PRECIOUS METALS EXCHANGE             ║"
echo "║                1.5% Competitive Fee Platform             ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colors
GOLD='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Kill existing processes
echo "🔄 Preparing system..."
pkill -f "http.server 3000" 2>/dev/null
pkill -f "node.*3000" 2>/dev/null
pkill -f "node.*3001" 2>/dev/null
sleep 2

# Start Backend
echo ""
echo "${GOLD}🚀 Starting Backend API (1.5% fee logic)...${NC}"
cd apps/backend
node simple-server.js > backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend PID: $BACKEND_PID"
echo "   API: http://localhost:3001/health"

# Wait for backend
sleep 3

# Start Frontend
echo ""
echo "${GOLD}🚀 Starting Frontend UI...${NC}"
cd ../frontend

# Ensure public directory exists
mkdir -p public

# Start server from public directory
cd public
python3 -m http.server 3000 > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo "✅ Frontend PID: $FRONTEND_PID"
echo "   UI: http://localhost:3000"

# Wait for frontend
sleep 3

echo ""
echo "${GREEN}✅ SYSTEM STATUS${NC}"
echo "─────────────"

# Test services
echo -n "Backend API: "
if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ RUNNING${NC}"
else
    echo -e "❌ NOT RUNNING"
fi

echo -n "Frontend UI: "
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ RUNNING${NC}"
else
    echo -e "❌ NOT RUNNING"
fi

echo ""
echo "${BLUE}💰 YOUR COMPETITIVE ADVANTAGE${NC}"
echo "────────────────────────────"
echo "• Fee Rate: ${GOLD}1.5%${NC} (vs 3-8% industry)"
echo "• Customer Savings: ${GREEN}50-81%${NC} per trade"
echo "• Example: $1,500-6,500 saved on $100,000 trade"

echo ""
echo "${GOLD}💎 AVAILABLE METALS${NC}"
echo "────────────────────"
echo "Gold • Silver • Platinum • Palladium • Rhodium • Copper"

echo ""
echo "${GREEN}🌐 ACCESS YOUR EXCHANGE${NC}"
echo "─────────────────────────"
echo "Open your browser to: ${BLUE}http://localhost:3000${NC}"
echo ""
echo "${GOLD}🔧 API ENDPOINTS${NC}"
echo "────────────────"
echo "Health:    http://localhost:3001/health"
echo "Auctions:  http://localhost:3001/api/auctions"

echo ""
echo "🛑 To stop: pkill -f 'python' && pkill -f 'node'"
echo "📋 Logs: apps/backend/backend.log, apps/frontend/frontend.log"

echo ""
echo "${GREEN}🎉 Phoenix PME with 1.5% competitive fees is READY!${NC}"
