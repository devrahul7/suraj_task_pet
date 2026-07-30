"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetRepository = void 0;
const pet_model_1 = __importDefault(require("../models/pet.model"));
class PetRepository {
    async create(pet) {
        return await pet_model_1.default.create(pet);
    }
    async findById(id) {
        return await pet_model_1.default.findById(id);
    }
    async findAll(filters = {}, page = 1, limit = 10) {
        const query = {};
        if (filters.species)
            query.species = filters.species;
        if (filters.breed)
            query.breed = new RegExp(filters.breed, "i");
        if (filters.size)
            query.size = filters.size;
        if (filters.gender)
            query.gender = filters.gender;
        if (filters.status)
            query.status = filters.status;
        if (filters.goodWithKids !== undefined)
            query.goodWithKids = filters.goodWithKids;
        if (filters.goodWithPets !== undefined)
            query.goodWithPets = filters.goodWithPets;
        if (filters.location)
            query.location = new RegExp(filters.location, "i");
        if (filters.minAge !== undefined ||
            filters.maxAge !== undefined) {
            query.age = {};
            if (filters.minAge !== undefined)
                query.age.$gte = filters.minAge;
            if (filters.maxAge !== undefined)
                query.age.$lte = filters.maxAge;
        }
        if (filters.minFee !== undefined ||
            filters.maxFee !== undefined) {
            query.adoptionFee = {};
            if (filters.minFee !== undefined)
                query.adoptionFee.$gte = filters.minFee;
            if (filters.maxFee !== undefined)
                query.adoptionFee.$lte = filters.maxFee;
        }
        const skip = (page - 1) * limit;
        const [pets, total] = await Promise.all([
            pet_model_1.default.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            pet_model_1.default.countDocuments(query)
        ]);
        return {
            pets,
            total,
        };
    }
    async update(id, pet) {
        return await pet_model_1.default.findByIdAndUpdate(id, pet, {
            new: true,
            runValidators: true,
        });
    }
    async delete(id) {
        const deleted = await pet_model_1.default.findByIdAndDelete(id);
        return deleted !== null;
    }
    async search(searchTerm, page = 1, limit = 10) {
        const query = {
            $or: [
                { name: new RegExp(searchTerm, "i") },
                { breed: new RegExp(searchTerm, "i") },
                { description: new RegExp(searchTerm, "i") },
                { location: new RegExp(searchTerm, "i") },
            ],
        };
        const skip = (page - 1) * limit;
        const [pets, total] = await Promise.all([
            pet_model_1.default.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            pet_model_1.default.countDocuments(query)
        ]);
        return {
            pets,
            total,
        };
    }
    async getCategories() {
        const [species, breeds] = await Promise.all([
            pet_model_1.default.distinct("species"),
            pet_model_1.default.distinct("breed"),
        ]);
        return {
            species,
            breeds,
        };
    }
    async countByStatus() {
        const result = await pet_model_1.default.aggregate([
            {
                $group: {
                    _id: "$status",
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
exports.PetRepository = PetRepository;
// Type (Zod)
//         ↓
// Model (Mongo)
//         ↓
// Repository
//         ↓
// Service
//         ↓
// Controller
