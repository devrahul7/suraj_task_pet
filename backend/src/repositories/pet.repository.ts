import  PetModel, { IPet} from "../models/pet.model";
import { PetType, PetSearchFilters } from "../types/pet.type";

export interface IPetRepository {

  create(
    pet: Partial<PetType>
  ): Promise<IPet>;

  findById(
    id: string
  ): Promise<IPet | null>;

  findAll(
    filters?: PetSearchFilters,
    page?: number,
    limit?: number
  ): Promise<{
    pets: IPet[];
    total: number;
  }>;

  update(
    id: string,
    pet: Partial<PetType>
  ): Promise<IPet | null>;

  delete(
    id: string
  ): Promise<boolean>;

  search(
    searchTerm: string,
    page?: number,
    limit?: number
  ): Promise<{
    pets: IPet[];
    total: number;
  }>;

  getCategories(): Promise<{
    species: string[];
    breeds: string[];
  }>;

  countByStatus(): Promise<Record<string, number>>;
}

export class PetRepository implements IPetRepository {

  async create(
    pet: Partial<PetType>
  ): Promise<IPet> {

    return await PetModel.create(pet);
  }

  async findById(
    id: string
  ): Promise<IPet | null> {

    return await PetModel.findById(id);
  }

  async findAll(
    filters: PetSearchFilters = {},
    page = 1,
    limit = 10
  ): Promise<{
    pets: IPet[];
    total: number;
  }> {

    const query: any = {};

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

    if (
      filters.minAge !== undefined ||
      filters.maxAge !== undefined
    ) {
      query.age = {};

      if (filters.minAge !== undefined)
        query.age.$gte = filters.minAge;

      if (filters.maxAge !== undefined)
        query.age.$lte = filters.maxAge;
    }

    if (
      filters.minFee !== undefined ||
      filters.maxFee !== undefined
    ) {
      query.adoptionFee = {};

      if (filters.minFee !== undefined)
        query.adoptionFee.$gte = filters.minFee;

      if (filters.maxFee !== undefined)
        query.adoptionFee.$lte = filters.maxFee;
    }

    const skip = (page - 1) * limit;

    const [pets, total] = await Promise.all([

      PetModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      PetModel.countDocuments(query)

    ]);

    return {
      pets,
      total,
    };
  }

  async update(
    id: string,
    pet: Partial<PetType>
  ): Promise<IPet | null> {

    return await PetModel.findByIdAndUpdate(
      id,
      pet,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async delete(
    id: string
  ): Promise<boolean> {

    const deleted = await PetModel.findByIdAndDelete(id);

    return deleted !== null;
  }

  async search(
    searchTerm: string,
    page = 1,
    limit = 10
  ): Promise<{
    pets: IPet[];
    total: number;
  }> {

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

      PetModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      PetModel.countDocuments(query)

    ]);

    return {
      pets,
      total,
    };
  }

  async getCategories(): Promise<{
    species: string[];
    breeds: string[];
  }> {

    const [species, breeds] = await Promise.all([
      PetModel.distinct("species"),
      PetModel.distinct("breed"),
    ]);

    return {
      species,
      breeds,
    };
  }

  async countByStatus(): Promise<Record<string, number>> {

    const result = await PetModel.aggregate([
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
    }, {} as Record<string, number>);
  }
}


// Type (Zod)
//         ↓
// Model (Mongo)
//         ↓
// Repository
//         ↓
// Service
//         ↓
// Controller