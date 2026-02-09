#!/bin/bash

# Phoenix PME - Daily Price Fetcher
# Runs once per day to fetch precious metals prices

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/../../logs"
DATA_DIR="$SCRIPT_DIR/../../data"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# Create directories
mkdir -p "$LOG_DIR" "$DATA_DIR"

echo "=============================================="
echo "PHOENIX PME - DAILY PRICE FETCH"
echo "Date: $(date)"
echo "=============================================="

# Run the Python script
cd "$SCRIPT_DIR"
python3 fetch_kitco_prices.py 2>&1 | tee "$LOG_DIR/fetch_$TIMESTAMP.log"

# Check if successful
if [ $? -eq 0 ]; then
    echo "✅ Price fetch completed successfully"
    
    # Copy to backup
    cp "$DATA_DIR/metal_prices.json" "$DATA_DIR/metal_prices_backup.json"
    
    # Update last fetch time
    echo "last_fetch=$(date '+%Y-%m-%d %H:%M:%S')" > "$DATA_DIR/last_fetch.txt"
    
    # Restart backend to load new prices (optional)
    echo "🔄 Updating Phoenix PME backend..."
    pkill -f "reliable-server.js" 2>/dev/null
    sleep 2
    cd ~/coreum-pme/apps/backend
    node reliable-server.js > backend.log 2>&1 &
    
    echo "🎉 Phoenix PME updated with latest market data!"
else
    echo "❌ Price fetch failed"
    echo "Using cached data from previous fetch"
fi

echo "=============================================="
echo "Market data available at:"
echo "Frontend: http://localhost:3000/data/market_data.json"
echo "Backend API: http://localhost:3001/api/market"
echo "=============================================="
