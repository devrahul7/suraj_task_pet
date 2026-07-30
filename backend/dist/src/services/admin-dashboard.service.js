"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardService = void 0;
const adoption_model_1 = require("../models/adoption.model");
const pet_model_1 = require("../models/pet.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const blog_model_1 = require("../models/blog.model");
const activity_log_model_1 = require("../models/activity-log.model");
class AdminDashboardService {
    async getOverviewStatistics() {
        const [totalUsers, totalPets, totalAdoptions, totalBlogs, pendingAdoptions, availablePets, adoptedPets, pendingPets, adminCount, userCount,] = await Promise.all([
            user_model_1.default.countDocuments(),
            pet_model_1.PetModel.countDocuments(),
            adoption_model_1.Adoption.countDocuments(),
            blog_model_1.BlogModel.countDocuments(),
            adoption_model_1.Adoption.countDocuments({ status: "pending" }),
            pet_model_1.PetModel.countDocuments({ status: "AVAILABLE" }),
            pet_model_1.PetModel.countDocuments({ status: "ADOPTED" }),
            pet_model_1.PetModel.countDocuments({ status: "PENDING" }),
            user_model_1.default.countDocuments({ role: "ADMIN" }),
            user_model_1.default.countDocuments({ role: "USER" }),
        ]);
        return {
            users: { total: totalUsers, admins: adminCount, regular: userCount },
            pets: {
                total: totalPets,
                available: availablePets,
                adopted: adoptedPets,
                pending: pendingPets,
            },
            adoptions: {
                total: totalAdoptions,
                pending: pendingAdoptions,
            },
            blogs: { total: totalBlogs },
        };
    }
    async getMonthlyReports(months = 6) {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - (months - 1));
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        const [adoptionsByMonth, usersByMonth, petsByMonth] = await Promise.all([
            adoption_model_1.Adoption.aggregate([
                { $match: { submittedAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$submittedAt" },
                            month: { $month: "$submittedAt" },
                        },
                        total: { $sum: 1 },
                        completed: {
                            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
                        },
                        approved: {
                            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
                        },
                        rejected: {
                            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
                        },
                        pending: {
                            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
                        },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
            user_model_1.default.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        total: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
            pet_model_1.PetModel.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        total: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]),
        ]);
        return {
            adoptions: adoptionsByMonth,
            users: usersByMonth,
            pets: petsByMonth,
        };
    }
    async getRecentActivities(limit = 10) {
        return activity_log_model_1.ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(limit);
    }
    async getAdoptionTrends() {
        const statusCounts = await adoption_model_1.Adoption.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        const speciesAdoption = await adoption_model_1.Adoption.aggregate([
            { $match: { status: "completed" } },
            {
                $lookup: {
                    from: "pets",
                    localField: "petId",
                    foreignField: "_id",
                    as: "pet",
                },
            },
            { $unwind: "$pet" },
            { $group: { _id: "$pet.species", count: { $sum: 1 } } },
        ]);
        return { statusCounts, speciesAdoption };
    }
    async getFullDashboard() {
        const [overview, monthlyReports, recentActivities, trends] = await Promise.all([
            this.getOverviewStatistics(),
            this.getMonthlyReports(6),
            this.getRecentActivities(10),
            this.getAdoptionTrends(),
        ]);
        return { overview, monthlyReports, recentActivities, trends };
    }
}
exports.AdminDashboardService = AdminDashboardService;
