"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_model_1 = require("../models/payment.model");
const adoption_model_1 = require("../models/adoption.model");
const http_exception_1 = require("../exceptions/http-exception");
const uuid_1 = require("uuid");
class PaymentService {
    async createPaymentIntent(userId, adoptionId, amount = 150) {
        const adoption = await adoption_model_1.Adoption.findById(adoptionId);
        if (!adoption) {
            throw new http_exception_1.HttpException(404, 'Adoption application not found.');
        }
        if (adoption.userId !== userId) {
            throw new http_exception_1.HttpException(403, 'Unauthorized access to adoption application.');
        }
        const mockPaymentIntentId = `pi_petey_${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 18)}`;
        const clientSecret = `${mockPaymentIntentId}_secret_${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 12)}`;
        const payment = await payment_model_1.Payment.create({
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
    async confirmPayment(userId, paymentIntentId) {
        const payment = await payment_model_1.Payment.findOne({ stripePaymentIntentId: paymentIntentId, userId });
        if (!payment) {
            throw new http_exception_1.HttpException(404, 'Payment record not found.');
        }
        payment.status = 'succeeded';
        await payment.save();
        await adoption_model_1.Adoption.findByIdAndUpdate(payment.adoptionId, {
            status: 'completed',
            completedAt: new Date(),
        });
        return {
            message: 'Adoption fee payment successful! Adoption request finalized.',
            payment,
        };
    }
    async getUserPayments(userId) {
        return payment_model_1.Payment.find({ userId }).sort({ createdAt: -1 });
    }
    async getAllPayments() {
        return payment_model_1.Payment.find().sort({ createdAt: -1 });
    }
}
exports.PaymentService = PaymentService;
