import { IVeterinarian, IVeterinarianDocument, Veterinarian } from "../models/veterinarian.model"; 
import { IVetAppointment, VetAppointment } from "../models/vet-appointment.model";

export interface FindVeterinarianOptions {
    page?: number;
    limit?: number;
    search?: string;
    specialization?: string;
    location?: string;
    isActive?: boolean;
}

export interface IVeterinarianRepository {
    create(data: Partial<IVeterinarian>): Promise<IVeterinarian>;
    findById(id: string): Promise<IVeterinarianDocument | null>;
    findByEmail(email: string): Promise<IVeterinarian | null>;
    existsByEmail(email: string): Promise<boolean>;
    findAll(options: FindVeterinarianOptions): Promise<{ veterinarians: IVeterinarian[]; total: number }>;
    findActive(page: number, limit: number): Promise<{ veterinarians: IVeterinarian[]; total: number }>;
    findBySpecialization(specialization: string): Promise<IVeterinarian[]>;
    update(id: string, data: Partial<IVeterinarian>): Promise<IVeterinarian | null>;
    delete(id: string): Promise<IVeterinarian | null>;
    toggleActive(id: string, active: boolean): Promise<IVeterinarian | null>;
    count(filter?: object): Promise<number>;
    countActive(): Promise<number>;
    countInactive(): Promise<number>;
    countTotal(): Promise<number>;
}

export class VeterinarianRepository implements IVeterinarianRepository {

    async create(data: Partial<IVeterinarian>): Promise<IVeterinarian> {
        return Veterinarian.create(data);
    }

    async findById(id: string): Promise<IVeterinarianDocument | null> {
        return Veterinarian.findById(id);
    }

    async findByEmail(email: string): Promise<IVeterinarian | null> {
        return Veterinarian.findOne({ email: email.toLowerCase() });
    }

    async existsByEmail(email: string): Promise<boolean> {
        return !!(await Veterinarian.exists({ email: email.toLowerCase() }));
    }

    async findAll(opts: FindVeterinarianOptions): Promise<{ veterinarians: IVeterinarian[]; total: number }> {
        const { page = 1, limit = 10, search, specialization, location, isActive } = opts;
        const query: Record<string, unknown> = {};

        if (isActive !== undefined) query["isActive"] = isActive;
        if (specialization) query["specializations"] = { $regex: specialization, $options: "i" }; // ✅ specializations (plural)
        if (location) query["location"] = { $regex: location, $options: "i" };
        if (search) {
            query["$or"] = [
                { name: { $regex: search, $options: "i" } },
                { about: { $regex: search, $options: "i" } },
                { specializations: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const [veterinarians, total] = await Promise.all([
            Veterinarian.find(query)
                .sort({ rating: -1, reviewCount: -1 })
                .skip(skip)
                .limit(limit)
                .lean(), 
            Veterinarian.countDocuments(query),
        ]);

        return { veterinarians: veterinarians as IVeterinarian[], total };
    }

    async findActive(page: number, limit: number): Promise<{ veterinarians: IVeterinarian[]; total: number }> {
        const skip = (page - 1) * limit;
        const [veterinarians, total] = await Promise.all([
            Veterinarian.find({ isActive: true })
                .sort({ rating: -1, reviewCount: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Veterinarian.countDocuments({ isActive: true }),
        ]);
        return { veterinarians: veterinarians as IVeterinarian[], total };
    }

      async findBySpecialization(specialization: string): Promise<IVeterinarian[]> {
        return Veterinarian.find({
          specializations: { $regex: specialization, $options: "i" },
          isActive: true,
        })
          .sort({ rating: -1 })
          .lean() as Promise<IVeterinarian[]>;
      }

    async update(id: string, data: Partial<IVeterinarian>): Promise<IVeterinarian | null> {
        return Veterinarian.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id: string): Promise<IVeterinarian | null> {
        return Veterinarian.findByIdAndDelete(id);
    }

    async toggleActive(id: string, active: boolean): Promise<IVeterinarian | null> {
        return Veterinarian.findByIdAndUpdate(id, { isActive: active }, { new: true });
    }

    async updateRating(id: string, rating: number, reviewCount: number): Promise<void> {
        await Veterinarian.findByIdAndUpdate(id, { rating, reviewCount });
    }

    async count(filter: Record<string, unknown> = {}): Promise<number> {
        return Veterinarian.countDocuments(filter);
    }

    async countActive(): Promise<number> {
        return Veterinarian.countDocuments({ isActive: true });
    }

    async countInactive(): Promise<number> {
        return Veterinarian.countDocuments({ isActive: false });
    }

    async countTotal(): Promise<number> {
        return Veterinarian.countDocuments();
    }
}