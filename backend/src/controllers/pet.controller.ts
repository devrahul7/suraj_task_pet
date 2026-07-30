import { Request, Response } from "express";
import { PetService } from "../services/pet.service";
import { ApiResponseHelper } from "../utils/api-response";
import { HttpException } from "../exceptions/http-exception";
import { CreatePetDTO, UpdatePetDTO } from "../dtos/pet.dto";
import { z } from "zod";

const petService = new PetService();

export class PetController {
  /**
   * Create Pet (Admin)
   */
  async createPet(req: Request, res: Response) {
    try {
      const parsed = CreatePetDTO.safeParse(req.body);

      if (!parsed.success) {
        throw new HttpException(
          400,
          z.prettifyError(parsed.error)
        );
      }

      const files = (req.files as Express.Multer.File[]) || [];

      const images = files.map(
        (file) => `/uploads/${file.filename}`
      );

      const pet = await petService.createPet({
        ...parsed.data,
        images,
      });

      return ApiResponseHelper.success(
        res,
        pet,
        201,
        "Pet created successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to create pet",
        e.status || 500
      );
    }
  }

  /**
   * Get All Pets
   */
  async getAllPets(req: Request, res: Response) {
    try {
      const { page, limit, search, ...filters } = req.query;

      const pets = await petService.filterPets(
        filters,
        page ? Number(page) : 1,
        limit ? Number(limit) : 10
      );

      return ApiResponseHelper.success(
        res,
        pets,
        200,
        "Pets retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to retrieve pets",
        e.status || 500
      );
    }
  }

  /**
   * Get Pet Categories
   */
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await petService.getCategories();
      return ApiResponseHelper.success(
        res,
        categories,
        200,
        "Categories retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to retrieve categories",
        e.status || 500
      );
    }
  }

  /**
   * Get Pet By ID
   */
  async getPetById(req: Request, res: Response) {
    try {
      const pet = await petService.getPetById(req.params.id);

      return ApiResponseHelper.success(
        res,
        pet,
        200,
        "Pet retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to retrieve pet",
        e.status || 500
      );
    }
  }

  /**
   * Update Pet
   */
  async updatePet(req: Request, res: Response) {
    try {
      const parsed = UpdatePetDTO.safeParse(req.body);

      if (!parsed.success) {
        throw new HttpException(
          400,
          z.prettifyError(parsed.error)
        );
      }

      const files = (req.files as Express.Multer.File[]) || [];

      const images = files.length
        ? files.map((file) => `/uploads/${file.filename}`)
        : undefined;

      const pet = await petService.updatePet(req.params.id, {
        ...parsed.data,
        ...(images && { images }),
      });

      return ApiResponseHelper.success(
        res,
        pet,
        200,
        "Pet updated successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to update pet",
        e.status || 500
      );
    }
  }

  /**
   * Delete Pet
   */
  async deletePet(req: Request, res: Response) {
    try {
      const result = await petService.deletePet(req.params.id);

      return ApiResponseHelper.success(
        res,
        result,
        200,
        "Pet deleted successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to delete pet",
        e.status || 500
      );
    }
  }

  /**
   * Update Status
   */
  async updatePetStatus(req: Request, res: Response) {
    try {
      const pet = await petService.updatePetStatus(
        req.params.id,
        req.body.status
      );

      return ApiResponseHelper.success(
        res,
        pet,
        200,
        "Pet status updated"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to update status",
        e.status || 500
      );
    }
  }

  /**
   * Get Pets By Status
   */
  async getPetsByStatus(req: Request, res: Response) {
    try {
      const pets = await petService.getPetsByStatus(
        req.params.status
      );

      return ApiResponseHelper.success(
        res,
        pets,
        200,
        "Pets retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message,
        e.status || 500
      );
    }
  }

  /**
   * Get Pets By Species
   */
  async getPetsBySpecies(req: Request, res: Response) {
    try {
      const pets = await petService.getPetsBySpecies(
        req.params.species
      );

      return ApiResponseHelper.success(
        res,
        pets,
        200,
        "Pets retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message,
        e.status || 500
      );
    }
  }

  /**
   * Get Pets By Breed
   */
  async getPetsByBreed(req: Request, res: Response) {
    try {
      const pets = await petService.getPetsByBreed(
        req.params.breed
      );

      return ApiResponseHelper.success(
        res,
        pets,
        200,
        "Pets retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message,
        e.status || 500
      );
    }
  }

  /**
   * Get Pets By Age
   */
  async getPetsByAge(req: Request, res: Response) {
    try {
      const pets = await petService.getPetsByAge(
        req.params.age
      );

      return ApiResponseHelper.success(
        res,
        pets,
        200,
        "Pets retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message,
        e.status || 500
      );
    }
  }

  /**
   * search Pets
   */
  async searchPets(req: Request, res: Response) {
    try {
      const { search, page, limit } = req.query;
      const pets = await petService.searchPets(search as string, parseInt(page as string), parseInt(limit as string));
      return ApiResponseHelper.success(
        res,
        pets,
        200,
        "Pets retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message,
        e.status || 500
      );
    }
  }

  /**
   * Dashboard Statistics
   */
  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await petService.getDashboardStatistics();

      return ApiResponseHelper.success(
        res,
        stats,
        200,
        "Dashboard statistics retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message,
        e.status || 500
      );
    }
  }

}