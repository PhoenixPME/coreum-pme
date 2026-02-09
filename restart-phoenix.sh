#!/bin/bash

echo ""
echo "========================================"
echo "🔄 RESTARTING PHOENIX PME EXCHANGE"
echo "========================================"
echo ""

echo "Stopping existing services..."
pkill -f "node" 2>/dev/null
pkill -f "python" 2>/dev/null
sleep 2

echo ""
echo "Starting Backend API..."
cd apps/backend
node reliable-server.js > backend.log 2>&1 &
echo "Backend PID: $!"
echo "API: http://localhost:3001/health"

sleep 3

echo ""
echo "Starting Frontend UI..."
cd ../frontend
cd public
python3 -m http.server 3000 > ../frontend.log 2>&1 &
echo "Frontend PID: $!"
echo "UI: http://localhost:3000"

sleep 3

echo ""
echo "========================================"
echo "✅ RESTART COMPLETE"
echo "========================================"
echo ""
echo "💰 1.5% Competitive Fee Advantage"
echo "💎 Gold, Silver, Platinum, Palladium, Rhodium, Copper"
echo "🌐 Access: http://localhost:3000"
echo ""
