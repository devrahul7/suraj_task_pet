import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  private paymentService = new PaymentService();

  public createPaymentIntent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as any)?._id?.toString() || (req.user as any)?.id;
      const { adoptionId, amount } = req.body;
      const result = await this.paymentService.createPaymentIntent(userId, adoptionId, amount);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  public confirmPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as any)?._id?.toString() || (req.user as any)?.id;
      const { paymentIntentId } = req.body;
      const result = await this.paymentService.confirmPayment(userId, paymentIntentId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  public getUserPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.user as any)?._id?.toString() || (req.user as any)?.id;
      const payments = await this.paymentService.getUserPayments(userId);
      res.status(200).json({ success: true, data: payments });
    } catch (error) {
      next(error);
    }
  };

  public getAllPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payments = await this.paymentService.getAllPayments();
      res.status(200).json({ success: true, data: payments });
    } catch (error) {
      next(error);
    }
  };
}
