import { Adoption, IAdoption } from '../models/adoption.model';

export class AdoptionRepository {
  async create(adoptionData: Partial<IAdoption>): Promise<IAdoption> {
    const adoption = new Adoption(adoptionData);
    return await adoption.save();
  }

  async findById(id: string): Promise<IAdoption | null> {
    return await Adoption.findById(id)
      .populate('userId', 'name email phoneNumber, pprofileImage')
      .populate('petId, name species breed age gender, Image');
  }

  async findAll(page = 1, limit = 10, status?: string): Promise<{ adoptions: IAdoption[]; total: number }> {
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;
    
    const adoptions = await Adoption.find(query)
      .populate('userId', 'name email phoneNumber, profileImage')
      .populate('petId', 'name species breed age gender, Image')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Adoption.countDocuments(query);
    return { adoptions, total };
  }

  async findPendingByPet(petId: string): Promise<IAdoption | null> {
  return await Adoption.findOne({
    petId,
    status: "pending",
  });
}

  async findByUserId(userId: string, page = 1, limit = 10): Promise<{ adoptions: IAdoption[]; total: number }> {
    const skip = (page - 1) * limit;
    const adoptions = await Adoption.find({ userId })
      .populate('petId')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Adoption.countDocuments({ userId });
    return { adoptions, total };
  }

  async findByPetId(petId: string): Promise<IAdoption[]> {
    return await Adoption.find({ petId })
      .populate('userId', 'name email phoneNumber, profileImage')
      .sort({ submittedAt: -1 });
  }

  async update(id: string, updateData: Partial<IAdoption>): Promise<IAdoption | null> {
    return await Adoption.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('userId', 'name email phoneNumber, profileImage')
      .populate('petId', 'name species breed age gender, Image');
  }

  async delete(id: string): Promise<IAdoption | null> {
    return await Adoption.findByIdAndDelete(id);
  }

  async countByStatus(): Promise<Record<string, number>> {
    const result = await Adoption.aggregate([
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
    }, {} as Record<string, number>);
  }

  async getRecentAdoptions(limit = 10): Promise<IAdoption[]> {
    return await Adoption.find()
      .populate('userId', 'name email phoneNumber, profileImage')
      .populate('petId', 'name species breed age gender, Image')
      .sort({ submittedAt: -1 })
      .limit(limit);
  }
  async findUserApplicationForPet(
  userId: string,
  petId: string
): Promise<IAdoption | null> {
  return await Adoption.findOne({
    userId,
    petId,
    status: {
      $in: ["pending", "approved"],
    },
  });
}
async findByStatus(
  status: string
): Promise<IAdoption[]> {
  return await Adoption.find({ status })
    .populate("userId", "name email phoneNumber, profileImage")
    .populate("petId", "name species breed age gender, Image")
    .sort({ submittedAt: -1 });
}
async findPending(): Promise<IAdoption[]> {
  return await Adoption.find({
    status: "pending",
  })
    .populate("userId", "name email phoneNumber, profileImage")
    .populate("petId", "name species breed age gender, Image")
    .sort({ submittedAt: -1 });
}
async findApproved(): Promise<IAdoption[]> {
  return await Adoption.find({
    status: "approved",
  })
    .populate("userId", "name email phoneNumber, profileImage")
    .populate("petId", "name species breed age gender, Image");
}
async findRejected(): Promise<IAdoption[]> {
  return await Adoption.find({
    status: "rejected",
  })
    .populate("userId", "name email phoneNumber, profileImage")
    .populate("petId", "name species breed age gender, Image");
}
async count(): Promise<number> {
  return await Adoption.countDocuments();
}

async exists(id: string): Promise<boolean> {
  return (await Adoption.exists({ _id: id })) !== null;
}

async cancel(id: string): Promise<IAdoption | null> {
  return await Adoption.findByIdAndUpdate(
    id,
    {
      status: "cancelled",
    },
    {
      new: true,
    }
  );
}
async approve(
  id: string,
  adminNotes?: string
): Promise<IAdoption | null> {
  return await Adoption.findByIdAndUpdate(
    id,
    {
      status: "approved",
      adminNotes,
      reviewedAt: new Date(),
    },
    {
      new: true,
    }
  );
}

async reject(
  id: string,
  adminNotes?: string
): Promise<IAdoption | null> {
  return await Adoption.findByIdAndUpdate(
    id,
    {
      status: "rejected",
      adminNotes,
      reviewedAt: new Date(),
    },
    {
      new: true,
    }
  );
}

async complete(id: string): Promise<IAdoption | null> {
  return await Adoption.findByIdAndUpdate(
    id,
    {
      status: "completed",
      completedAt: new Date(),
    },
    {
      new: true,
    }
  );
}
}
