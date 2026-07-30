import { Adoption } from "../models/adoption.model";
import { PetModel } from "../models/pet.model";
import User from "../models/user.model";
import { BlogModel } from "../models/blog.model";
import { ActivityLog } from "../models/activity-log.model";

export class AdminDashboardService {
  async getOverviewStatistics() {
    const [
      totalUsers,
      totalPets,
      totalAdoptions,
      totalBlogs,
      pendingAdoptions,
      availablePets,
      adoptedPets,
      pendingPets,
      adminCount,
      userCount,
    ] = await Promise.all([
      User.countDocuments(),
      PetModel.countDocuments(),
      Adoption.countDocuments(),
      BlogModel.countDocuments(),
      Adoption.countDocuments({ status: "pending" }),
      PetModel.countDocuments({ status: "AVAILABLE" }),
      PetModel.countDocuments({ status: "ADOPTED" }),
      PetModel.countDocuments({ status: "PENDING" }),
      User.countDocuments({ role: "ADMIN" }),
      User.countDocuments({ role: "USER" }),
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
      Adoption.aggregate([
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
      User.aggregate([
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
      PetModel.aggregate([
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
    return ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getAdoptionTrends() {
    const statusCounts = await Adoption.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const speciesAdoption = await Adoption.aggregate([
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
    const [overview, monthlyReports, recentActivities, trends] =
      await Promise.all([
        this.getOverviewStatistics(),
        this.getMonthlyReports(6),
        this.getRecentActivities(10),
        this.getAdoptionTrends(),
      ]);

    return { overview, monthlyReports, recentActivities, trends };
  }
}
