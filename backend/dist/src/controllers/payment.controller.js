"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../services/payment.service");
class PaymentController {
    paymentService = new payment_service_1.PaymentService();
    createPaymentIntent = async (req, res, next) => {
        try {
            const userId = req.user?._id?.toString() || req.user?.id;
            const { adoptionId, amount } = req.body;
            const result = await this.paymentService.createPaymentIntent(userId, adoptionId, amount);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    };
    confirmPayment = async (req, res, next) => {
        try {
            const userId = req.user?._id?.toString() || req.user?.id;
            const { paymentIntentId } = req.body;
            const result = await this.paymentService.confirmPayment(userId, paymentIntentId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    };
    getUserPayments = async (req, res, next) => {
        try {
            const userId = req.user?._id?.toString() || req.user?.id;
            const payments = await this.paymentService.getUserPayments(userId);
            res.status(200).json({ success: true, data: payments });
        }
        catch (error) {
            next(error);
        }
    };
    getAllPayments = async (req, res, next) => {
        try {
            const payments = await this.paymentService.getAllPayments();
            res.status(200).json({ success: true, data: payments });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.PaymentController = PaymentController;
