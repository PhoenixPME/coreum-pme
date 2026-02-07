import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { prisma } from './services/prisma.service';
import { authController } from './controllers/auth.controller';
import { auctionController } from './controllers/auction.controller';
import { authenticate, authorize } from './middleware/auth.middleware';
import { config } from './config';

const app = express();
const PORT = config.PORT;

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGINS,
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
});
app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'phoenixpme-backend',
      version: config.VERSION,
      database: 'connected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'phoenixpme-backend',
      database: 'disconnected',
      error: 'Database connection failed'
    });
  }
});

// Public routes
app.post('/api/auth/register', (req, res) => authController.register(req, res));
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/refresh', (req, res) => authController.refreshToken(req, res));

// Protected routes
app.get('/api/auth/profile', authenticate, (req, res) => authController.getProfile(req, res));

// Auction routes
app.get('/api/auctions', (req, res) => auctionController.listAuctions(req, res));
app.get('/api/auctions/:id', (req, res) => auctionController.getAuction(req, res));
app.post('/api/auctions', authenticate, (req, res) => auctionController.createAuction(req, res));
app.put('/api/auctions/:id', authenticate, (req, res) => auctionController.updateAuction(req, res));
app.delete('/api/auctions/:id', authenticate, (req, res) => auctionController.deleteAuction(req, res));
app.post('/api/auctions/:id/bid', authenticate, (req, res) => auctionController.placeBid(req, res));

// Admin-only routes
app.get('/api/admin/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            auctions: true,
            bids: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 PhoenixPME Backend Server Started!
📍 Port: ${PORT}
📅 Time: ${new Date().toISOString()}
📊 Environment: ${config.NODE_ENV}
🔗 Health: http://localhost:${PORT}/health
🔗 API: http://localhost:${PORT}/api

📝 Available Endpoints:
  PUBLIC:
    GET  /health                - Health check
    POST /api/auth/register     - Register user
    POST /api/auth/login        - Login user
    POST /api/auth/refresh      - Refresh token
    GET  /api/auctions          - List auctions
    GET  /api/auctions/:id      - Get auction details

  PROTECTED (requires auth):
    GET  /api/auth/profile      - User profile
    POST /api/auctions          - Create auction
    PUT  /api/auctions/:id      - Update auction
    DELETE /api/auctions/:id    - Delete auction
    POST /api/auctions/:id/bid  - Place bid

  ADMIN ONLY:
    GET  /api/admin/users       - List all users
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

export { app, prisma };
