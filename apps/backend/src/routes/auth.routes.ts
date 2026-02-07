import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authSchemas } from '../validators/auth.validators';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', 
  validate(authSchemas.register), 
  authController.register
);

router.post('/login',
  validate(authSchemas.login),
  authController.login
);

router.post('/refresh-token',
  validate(authSchemas.refreshToken),
  authController.refreshToken
);

router.get('/verify-email',
  validate(authSchemas.verifyEmail),
  authController.verifyEmail
);

router.post('/forgot-password',
  validate(authSchemas.forgotPassword),
  authController.forgotPassword
);

router.post('/reset-password',
  validate(authSchemas.resetPassword),
  authController.resetPassword
);

export default router;
