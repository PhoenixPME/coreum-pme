import { Router } from 'express';
import { auctionController } from '../controllers/auction.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', auctionController.getAllAuctions);
router.get('/:id', auctionController.getAuctionById);

// Protected routes will be added later
// router.post('/', authenticate, auctionController.createAuction);
// etc.

export default router;
