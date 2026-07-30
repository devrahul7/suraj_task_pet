"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdoptionRepository = void 0;
const adoption_model_1 = require("../models/adoption.model");
class AdoptionRepository {
    async create(adoptionData) {
        const adoption = new adoption_model_1.Adoption(adoptionData);
        return await adoption.save();
    }
    async findById(id) {
        return await adoption_model_1.Adoption.findById(id)
            .populate('userId', 'name email phoneNumber, pprofileImage')
            .populate('petId, name species breed age gender, Image');
    }
    async findAll(page = 1, limit = 10, status) {
        const query = status ? { status } : {};
        const skip = (page - 1) * limit;
        const adoptions = await adoption_model_1.Adoption.find(query)
            .populate('userId', 'name email phoneNumber, profileImage')
            .populate('petId', 'name species breed age gender, Image')
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await adoption_model_1.Adoption.countDocuments(query);
        return { adoptions, total };
    }
    async findPendingByPet(petId) {
        return await adoption_model_1.Adoption.findOne({
            petId,
            status: "pending",
        });
    }
    async findByUserId(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const adoptions = await adoption_model_1.Adoption.find({ userId })
            .populate('petId')
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await adoption_model_1.Adoption.countDocuments({ userId });
        return { adoptions, total };
    }
    async findByPetId(petId) {
        return await adoption_model_1.Adoption.find({ petId })
            .populate('userId', 'name email phoneNumber, profileImage')
            .sort({ submittedAt: -1 });
    }
    async update(id, updateData) {
        return await adoption_model_1.Adoption.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .populate('userId', 'name email phoneNumber, profileImage')
            .populate('petId', 'name species breed age gender, Image');
    }
    async delete(id) {
        return await adoption_model_1.Adoption.findByIdAndDelete(id);
    }
    async countByStatus() {
        const result = await adoption_model_1.Adoption.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
        return result.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});
    }
    async getRecentAdoptions(limit = 10) {
        return await adoption_model_1.Adoption.find()
            .populate('userId', 'name email phoneNumber, profileImage')
            .populate('petId', 'name species breed age gender, Image')
            .sort({ submittedAt: -1 })
            .limit(limit);
    }
    async findUserApplicationForPet(userId, petId) {
        return await adoption_model_1.Adoption.findOne({
            userId,
            petId,
            status: {
                $in: ["pending", "approved"],
            },
        });
    }
    async findByStatus(status) {
        return await adoption_model_1.Adoption.find({ status })
            .populate("userId", "name email phoneNumber, profileImage")
            .populate("petId", "name species breed age gender, Image")
            .sort({ submittedAt: -1 });
    }
    async findPending() {
        return await adoption_model_1.Adoption.find({
            status: "pending",
        })
            .populate("userId", "name email phoneNumber, profileImage")
            .populate("petId", "name species breed age gender, Image")
            .sort({ submittedAt: -1 });
    }
    async findApproved() {
        return await adoption_model_1.Adoption.find({
            status: "approved",
        })
            .populate("userId", "name email phoneNumber, profileImage")
            .populate("petId", "name species breed age gender, Image");
    }
    async findRejected() {
        return await adoption_model_1.Adoption.find({
            status: "rejected",
        })
            .populate("userId", "name email phoneNumber, profileImage")
            .populate("petId", "name species breed age gender, Image");
    }
    async count() {
        return await adoption_model_1.Adoption.countDocuments();
    }
    async exists(id) {
        return (await adoption_model_1.Adoption.exists({ _id: id })) !== null;
    }
    async cancel(id) {
        return await adoption_model_1.Adoption.findByIdAndUpdate(id, {
            status: "cancelled",
        }, {
            new: true,
        });
    }
    async approve(id, adminNotes) {
        return await adoption_model_1.Adoption.findByIdAndUpdate(id, {
            status: "approved",
            adminNotes,
            reviewedAt: new Date(),
        }, {
            new: true,
        });
    }
    async reject(id, adminNotes) {
        return await adoption_model_1.Adoption.findByIdAndUpdate(id, {
            status: "rejected",
            adminNotes,
            reviewedAt: new Date(),
        }, {
            new: true,
        });
    }
    async complete(id) {
        return await adoption_model_1.Adoption.findByIdAndUpdate(id, {
            status: "completed",
            completedAt: new Date(),
        }, {
            new: true,
        });
    }
}
exports.AdoptionRepository = AdoptionRepository;
