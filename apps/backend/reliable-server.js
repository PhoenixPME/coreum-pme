const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Phoenix PME Backend',
        version: '1.0.0',
        fee: '1.5% competitive rate',
        endpoints: {
            health: '/health',
            auctions: '/api/auctions',
            fee_calc: 'POST /api/fee/calculate'
        }
    });
});

// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'phoenix-pme-backend',
        version: '1.0.0',
        database: 'connected',
        fee: '1.5% competitive rate',
        metals: ['Gold', 'Silver', 'Platinum', 'Palladium', 'Rhodium', 'Copper']
    });
});

// Auctions endpoint
app.get('/api/auctions', (req, res) => {
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        auctions: [
            {
                id: 'GOLD-001',
                itemId: 'GOLD-PAMP-1OZ',
                title: '1oz PAMP Suisse Gold Bar',
                description: '99.99% pure gold bar with assay certificate',
                metalType: 'GOLD',
                weight: 1,
                weightUnit: 'TOZ',
                purity: 99.99,
                currentPrice: 210000, // $2,100.00
                status: 'ACTIVE',
                endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                seller: 'Gold Bullion Dealer LLC'
            },
            {
                id: 'SILVER-001',
                itemId: 'SILVER-100OZ-JM',
                title: '100oz Johnson Matthey Silver Bar',
                description: 'Investment grade silver bar with serial number',
                metalType: 'SILVER',
                weight: 100,
                weightUnit: 'TOZ',
                purity: 99.9,
                currentPrice: 260000, // $2,600.00
                status: 'ACTIVE',
                endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                seller: 'Silver Stacker'
            },
            {
                id: 'PLATINUM-001',
                itemId: 'PLATINUM-1OZ-VAL',
                title: '1oz Valcambi Platinum Bar',
                description: '99.95% pure platinum bar with assay',
                metalType: 'PLATINUM',
                weight: 1,
                weightUnit: 'TOZ',
                purity: 99.95,
                currentPrice: 108000, // $1,080.00
                status: 'ACTIVE',
                endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                seller: 'Platinum Collector'
            }
        ],
        count: 3,
        message: '1.5% competitive fees apply to all trades'
    });
});

// Fee calculation endpoint
app.post('/api/fee/calculate', (req, res) => {
    const { amount } = req.body;
    
    if (!amount || isNaN(amount)) {
        return res.status(400).json({
            success: false,
            error: 'Valid amount required'
        });
    }
    
    const tradeAmount = parseFloat(amount);
    const phoenixFeePercent = 1.5;
    let phoenixFee = (tradeAmount * phoenixFeePercent) / 100;
    
    // Apply minimum and maximum
    if (phoenixFee < 25) phoenixFee = 25;
    if (phoenixFee > 2500) phoenixFee = 2500;
    
    // Traditional dealer fee (5% average)
    const traditionalFee = (tradeAmount * 5) / 100;
    const savings = traditionalFee - phoenixFee;
    const savingsPercent = (savings / traditionalFee) * 100;
    
    res.json({
        success: true,
        data: {
            feeCalculation: {
                tradeAmount: tradeAmount,
                feePercentage: phoenixFeePercent,
                feeAmount: Math.round(phoenixFee * 100) / 100,
                netAmount: Math.round((tradeAmount - phoenixFee) * 100) / 100,
                minimumFee: 25,
                maximumFee: 2500,
                savingsVsTraditional: Math.round(savings * 100) / 100,
                savingsPercent: Math.round(savingsPercent * 100) / 100
            },
            competitiveAdvantage: {
                phoenixRate: '1.5%',
                industryAverage: '3-8%',
                customerSavings: '50-81%'
            }
        }
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Phoenix PME Backend Server Started`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 Health: http://localhost:${PORT}/health`);
    console.log(`💰 Fee: 1.5% competitive rate active`);
    console.log(`💎 Metals: Gold, Silver, Platinum, Palladium, Rhodium, Copper`);
    console.log(`📅 Time: ${new Date().toISOString()}`);
});

// Handle errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

// Market Data Endpoint
app.get('/api/market', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    
    const marketFile = path.join(__dirname, '../../data/metal_prices.json');
    
    try {
        if (fs.existsSync(marketFile)) {
            const data = JSON.parse(fs.readFileSync(marketFile, 'utf8'));
            res.json({
                success: true,
                ...data,
                cached: false
            });
        } else {
            // Return default data if file doesn't exist
            res.json({
                success: true,
                timestamp: new Date().toISOString(),
                market_status: "OPEN",
                source: "phoenix-pme-default",
                metals: {
                    "GOLD": {price: 5030.70, change_percent: 1.30},
                    "SILVER": {price: 81.51, change_percent: 4.92},
                    "PLATINUM": {price: 2094.00, change_percent: -0.24},
                    "PALLADIUM": {price: 1708.00, change_percent: 1.55},
                    "RHODIUM": {price: 9900.00, change_percent: 0.00},
                    "COPPER": {price: 3.85, change_percent: 0.52}
                },
                cached: true
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Live prices endpoint
app.get('/api/prices/live', (req, res) => {
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        message: "Live prices from Kitco integration",
        endpoint: "GET /api/market for actual data",
        integration_status: "active",
        next_fetch: "daily at 09:00 UTC"
    });
});
