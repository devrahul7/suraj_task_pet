import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authorizedMiddleware, isAdmin } from '../middlewares/auth.middleware';

const router = Router();
const controller = new PaymentController();

router.post('/create-intent', authorizedMiddleware, controller.createPaymentIntent);
router.post('/confirm', authorizedMiddleware, controller.confirmPayment);
router.get('/my-history', authorizedMiddleware, controller.getUserPayments);
router.get('/admin/all', authorizedMiddleware, isAdmin, controller.getAllPayments);

export default router;
