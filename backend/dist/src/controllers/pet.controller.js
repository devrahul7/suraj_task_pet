"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetController = void 0;
const pet_service_1 = require("../services/pet.service");
const api_response_1 = require("../utils/api-response");
const http_exception_1 = require("../exceptions/http-exception");
const pet_dto_1 = require("../dtos/pet.dto");
const zod_1 = require("zod");
const petService = new pet_service_1.PetService();
class PetController {
    /**
     * Create Pet (Admin)
     */
    async createPet(req, res) {
        try {
            const parsed = pet_dto_1.CreatePetDTO.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, zod_1.z.prettifyError(parsed.error));
            }
            const files = req.files || [];
            const images = files.map((file) => `/uploads/${file.filename}`);
            const pet = await petService.createPet({
                ...parsed.data,
                images,
            });
            return api_response_1.ApiResponseHelper.success(res, pet, 201, "Pet created successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to create pet", e.status || 500);
        }
    }
    /**
     * Get All Pets
     */
    async getAllPets(req, res) {
        try {
            const { page, limit, search, ...filters } = req.query;
            const pets = await petService.filterPets(filters, page ? Number(page) : 1, limit ? Number(limit) : 10);
            return api_response_1.ApiResponseHelper.success(res, pets, 200, "Pets retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to retrieve pets", e.status || 500);
        }
    }
    /**
     * Get Pet Categories
     */
    async getCategories(req, res) {
        try {
            const categories = await petService.getCategories();
            return api_response_1.ApiResponseHelper.success(res, categories, 200, "Categories retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to retrieve categories", e.status || 500);
        }
    }
    /**
     * Get Pet By ID
     */
    async getPetById(req, res) {
        try {
            const pet = await petService.getPetById(req.params.id);
            return api_response_1.ApiResponseHelper.success(res, pet, 200, "Pet retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to retrieve pet", e.status || 500);
        }
    }
    /**
     * Update Pet
     */
    async updatePet(req, res) {
        try {
            const parsed = pet_dto_1.UpdatePetDTO.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, zod_1.z.prettifyError(parsed.error));
            }
            const files = req.files || [];
            const images = files.length
                ? files.map((file) => `/uploads/${file.filename}`)
                : undefined;
            const pet = await petService.updatePet(req.params.id, {
                ...parsed.data,
                ...(images && { images }),
            });
            return api_response_1.ApiResponseHelper.success(res, pet, 200, "Pet updated successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to update pet", e.status || 500);
        }
    }
    /**
     * Delete Pet
     */
    async deletePet(req, res) {
        try {
            const result = await petService.deletePet(req.params.id);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Pet deleted successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to delete pet", e.status || 500);
        }
    }
    /**
     * Update Status
     */
    async updatePetStatus(req, res) {
        try {
            const pet = await petService.updatePetStatus(req.params.id, req.body.status);
            return api_response_1.ApiResponseHelper.success(res, pet, 200, "Pet status updated");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to update status", e.status || 500);
        }
    }
    /**
     * Get Pets By Status
     */
    async getPetsByStatus(req, res) {
        try {
            const pets = await petService.getPetsByStatus(req.params.status);
            return api_response_1.ApiResponseHelper.success(res, pets, 200, "Pets retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * Get Pets By Species
     */
    async getPetsBySpecies(req, res) {
        try {
            const pets = await petService.getPetsBySpecies(req.params.species);
            return api_response_1.ApiResponseHelper.success(res, pets, 200, "Pets retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * Get Pets By Breed
     */
    async getPetsByBreed(req, res) {
        try {
            const pets = await petService.getPetsByBreed(req.params.breed);
            return api_response_1.ApiResponseHelper.success(res, pets, 200, "Pets retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * Get Pets By Age
     */
    async getPetsByAge(req, res) {
        try {
            const pets = await petService.getPetsByAge(req.params.age);
            return api_response_1.ApiResponseHelper.success(res, pets, 200, "Pets retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * search Pets
     */
    async searchPets(req, res) {
        try {
            const { search, page, limit } = req.query;
            const pets = await petService.searchPets(search, parseInt(page), parseInt(limit));
            return api_response_1.ApiResponseHelper.success(res, pets, 200, "Pets retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * Dashboard Statistics
     */
    async getDashboardStats(req, res) {
        try {
            const stats = await petService.getDashboardStatistics();
            return api_response_1.ApiResponseHelper.success(res, stats, 200, "Dashboard statistics retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
}
exports.PetController = PetController;
