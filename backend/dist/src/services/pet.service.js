"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetService = void 0;
const pet_repository_1 = require("../repositories/pet.repository");
const http_exception_1 = require("../exceptions/http-exception");
const petRepository = new pet_repository_1.PetRepository();
class PetService {
    /**
     * Create Pet
     */
    async createPet(petData) {
        return await petRepository.create(petData);
    }
    /**
     * Update Pet
     */
    async updatePet(id, updateData) {
        const pet = await petRepository.findById(id);
        if (!pet) {
            throw new http_exception_1.HttpException(404, "Pet not found");
        }
        return await petRepository.update(id, updateData);
    }
    /**
     * Delete Pet
     */
    async deletePet(id) {
        const deleted = await petRepository.delete(id);
        if (!deleted) {
            throw new http_exception_1.HttpException(404, "Pet not found");
        }
        return {
            message: "Pet deleted successfully",
        };
    }
    /**
     * Get Pet By ID
     */
    async getPetById(id) {
        const pet = await petRepository.findById(id);
        if (!pet) {
            throw new http_exception_1.HttpException(404, "Pet not found");
        }
        return pet;
    }
    /**
     * Get All Pets
     */
    async getAllPets(page = 1, limit = 10, filters = {}) {
        return await petRepository.findAll(filters, page, limit);
    }
    /**
     * Search Pets
     */
    async searchPets(search, page = 1, limit = 10) {
        return await petRepository.search(search, page, limit);
    }
    /**
     * Get Paginated Pets
     */
    async getPaginatedPets(page = "1", limit = "10", search) {
        const currentPage = Number(page);
        const pageLimit = Number(limit);
        if (search) {
            return await this.searchPets(search, currentPage, pageLimit);
        }
        return await this.getAllPets(currentPage, pageLimit);
    }
    /**
     * Update Status
     */
    async updatePetStatus(id, status) {
        const pet = await petRepository.findById(id);
        if (!pet) {
            throw new http_exception_1.HttpException(404, "Pet not found");
        }
        return await petRepository.update(id, {
            status: status,
        });
    }
    /**
     * Get Pets By Status
     */
    async getPetsByStatus(status) {
        return await petRepository.findAll({
            status: status,
        });
    }
    /**
     * Get Pets By Species
     */
    async getPetsBySpecies(species) {
        return await petRepository.findAll({
            species: species,
        });
    }
    /**
     * Get Pets By Breed
     */
    async getPetsByBreed(breed) {
        return await petRepository.findAll({
            breed,
        });
    }
    /**
     * Get Pets By Age
     */
    async getPetsByAge(age) {
        const petAge = Number(age);
        return await petRepository.findAll({
            minAge: petAge,
            maxAge: petAge,
        });
    }
    /**
     * Get Pets By Location
     */
    async getPetsByLocation(location) {
        return await petRepository.findAll({
            location,
        });
    }
    /**
     * Get Pets Good With Kids
     */
    async getPetsGoodWithKids() {
        return await petRepository.findAll({
            goodWithKids: true,
        });
    }
    /**
     * Get Pets Good With Pets
     */
    async getPetsGoodWithPets() {
        return await petRepository.findAll({
            goodWithPets: true,
        });
    }
    /**
     * Advanced Filter
     */
    async filterPets(filters, page = 1, limit = 10) {
        return await petRepository.findAll(filters, page, limit);
    }
    /**
     * Get Categories (species + breeds)
     */
    async getCategories() {
        return await petRepository.getCategories();
    }
    /**
     * Dashboard Statistics
     */
    async getPetStatistics() {
        const status = await petRepository.countByStatus();
        return {
            totalPets: Object.values(status).reduce((sum, value) => sum + value, 0),
            status,
        };
    }
    /**
     * Available Pets
     */
    async getAvailablePets() {
        return await petRepository.findAll({
            status: "AVAILABLE",
        });
    }
    /**
     * Pending Pets
     */
    async getPendingPets() {
        return await petRepository.findAll({
            status: "PENDING",
        });
    }
    /**
     * Adopted Pets
     */
    async getAdoptedPets() {
        return await petRepository.findAll({
            status: "ADOPTED",
        });
    }
    /**
     * Get Dashboard Statistics
     */
    async getDashboardStatistics() {
        const statusStats = await petRepository.countByStatus();
        return {
            totalPets: Object.values(statusStats).reduce((sum, value) => sum + value, 0),
            statusStats,
        };
    }
}
exports.PetService = PetService;
