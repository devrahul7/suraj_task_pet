import { Payment, IPayment } from '../models/payment.model';
import { Adoption } from '../models/adoption.model';
import { HttpException } from '../exceptions/http-exception';
import { v4 as uuidv4 } from 'uuid';

export class PaymentService {
  async createPaymentIntent(userId: string, adoptionId: string, amount: number = 150) {
    const adoption = await Adoption.findById(adoptionId);
    if (!adoption) {
      throw new HttpException(404, 'Adoption application not found.');
    }
    if (adoption.userId !== userId) {
      throw new HttpException(403, 'Unauthorized access to adoption application.');
    }

    const mockPaymentIntentId = `pi_petey_${uuidv4().replace(/-/g, '').substring(0, 18)}`;
    const clientSecret = `${mockPaymentIntentId}_secret_${uuidv4().replace(/-/g, '').substring(0, 12)}`;

    const payment = await Payment.create({
      userId,
      adoptionId,
      petId: adoption.petId,
      amount,
      currency: 'usd',
      status: 'pending',
      stripePaymentIntentId: mockPaymentIntentId,
      paymentMethod: 'card',
    });

    return {
      paymentId: payment._id,
      clientSecret,
      paymentIntentId: mockPaymentIntentId,
      amount,
      currency: 'usd',
      status: payment.status,
    };
  }

  async confirmPayment(userId: string, paymentIntentId: string) {
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId, userId });
    if (!payment) {
      throw new HttpException(404, 'Payment record not found.');
    }

    payment.status = 'succeeded';
    await payment.save();

    await Adoption.findByIdAndUpdate(payment.adoptionId, {
      status: 'completed',
      completedAt: new Date(),
    });

    return {
      message: 'Adoption fee payment successful! Adoption request finalized.',
      payment,
    };
  }

  async getUserPayments(userId: string): Promise<IPayment[]> {
    return Payment.find({ userId }).sort({ createdAt: -1 });
  }

  async getAllPayments(): Promise<IPayment[]> {
    return Payment.find().sort({ createdAt: -1 });
  }
}
