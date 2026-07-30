"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
class UserRepository {
    async create(user) {
        return await user_model_1.default.create(user);
    }
    async findById(id) {
        return await user_model_1.default.findById(id).select("-password");
    }
    async findByIdWithPassword(id) {
        return await user_model_1.default.findById(id).select("+password");
    }
    async findByUsername(username) {
        return await user_model_1.default.findOne({ username }).select("-password");
    }
    async findByEmail(email) {
        return await user_model_1.default.findOne({ email }).select("-password");
    }
    async findByEmailWithPassword(email) {
        return await user_model_1.default.findOne({ email }).select("+password");
    }
    async findByRefreshToken(token) {
        return await user_model_1.default.findOne({
            refreshTokenHash: token,
            refreshTokenExpiresAt: { $gt: new Date() },
        }).select("+refreshTokenHash +refreshTokenExpiresAt");
    }
    async findByResetPasswordToken(token) {
        return await user_model_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: new Date() },
        }).select("+password +resetPasswordToken +resetPasswordExpiresAt");
    }
    async findByEmailVerificationToken(token) {
        return await user_model_1.default.findOne({
            emailVerificationToken: token,
            emailVerificationExpiresAt: { $gt: new Date() },
        }).select("+emailVerificationToken +emailVerificationExpiresAt");
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            user_model_1.default.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            user_model_1.default.countDocuments(),
        ]);
        return { users, total };
    }
    async update(id, user) {
        return await user_model_1.default.findByIdAndUpdate(id, user, {
            new: true,
            runValidators: true,
        }).select("-password");
    }
    async delete(id) {
        const deleted = await user_model_1.default.findByIdAndDelete(id);
        return deleted !== null;
    }
    async countByRole() {
        const result = await user_model_1.default.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);
        return result.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});
    }
}
exports.UserRepository = UserRepository;
