"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeterinarianRepository = void 0;
const veterinarian_model_1 = require("../models/veterinarian.model");
class VeterinarianRepository {
    async create(data) {
        return veterinarian_model_1.Veterinarian.create(data);
    }
    async findById(id) {
        return veterinarian_model_1.Veterinarian.findById(id);
    }
    async findByEmail(email) {
        return veterinarian_model_1.Veterinarian.findOne({ email: email.toLowerCase() });
    }
    async existsByEmail(email) {
        return !!(await veterinarian_model_1.Veterinarian.exists({ email: email.toLowerCase() }));
    }
    async findAll(opts) {
        const { page = 1, limit = 10, search, specialization, location, isActive } = opts;
        const query = {};
        if (isActive !== undefined)
            query["isActive"] = isActive;
        if (specialization)
            query["specializations"] = { $regex: specialization, $options: "i" }; // ✅ specializations (plural)
        if (location)
            query["location"] = { $regex: location, $options: "i" };
        if (search) {
            query["$or"] = [
                { name: { $regex: search, $options: "i" } },
                { about: { $regex: search, $options: "i" } },
                { specializations: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (page - 1) * limit;
        const [veterinarians, total] = await Promise.all([
            veterinarian_model_1.Veterinarian.find(query)
                .sort({ rating: -1, reviewCount: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            veterinarian_model_1.Veterinarian.countDocuments(query),
        ]);
        return { veterinarians: veterinarians, total };
    }
    async findActive(page, limit) {
        const skip = (page - 1) * limit;
        const [veterinarians, total] = await Promise.all([
            veterinarian_model_1.Veterinarian.find({ isActive: true })
                .sort({ rating: -1, reviewCount: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            veterinarian_model_1.Veterinarian.countDocuments({ isActive: true }),
        ]);
        return { veterinarians: veterinarians, total };
    }
    async findBySpecialization(specialization) {
        return veterinarian_model_1.Veterinarian.find({
            specializations: { $regex: specialization, $options: "i" },
            isActive: true,
        })
            .sort({ rating: -1 })
            .lean();
    }
    async update(id, data) {
        return veterinarian_model_1.Veterinarian.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    async delete(id) {
        return veterinarian_model_1.Veterinarian.findByIdAndDelete(id);
    }
    async toggleActive(id, active) {
        return veterinarian_model_1.Veterinarian.findByIdAndUpdate(id, { isActive: active }, { new: true });
    }
    async updateRating(id, rating, reviewCount) {
        await veterinarian_model_1.Veterinarian.findByIdAndUpdate(id, { rating, reviewCount });
    }
    async count(filter = {}) {
        return veterinarian_model_1.Veterinarian.countDocuments(filter);
    }
    async countActive() {
        return veterinarian_model_1.Veterinarian.countDocuments({ isActive: true });
    }
    async countInactive() {
        return veterinarian_model_1.Veterinarian.countDocuments({ isActive: false });
    }
    async countTotal() {
        return veterinarian_model_1.Veterinarian.countDocuments();
    }
}
exports.VeterinarianRepository = VeterinarianRepository;
