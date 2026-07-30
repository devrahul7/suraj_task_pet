import { CreateAdoptionDto } from "../dtos/adoption.dto";
import { HttpException } from "../exceptions/http-exception";
import { Adoption, IAdoption } from "../models/adoption.model";
import { AdoptionRepository } from "../repositories/adoption.repository";
import { PetRepository } from "../repositories/pet.repository";
import { UserRepository } from "../repositories/user.repository";
import { AIService } from "./ai.service";
import { EmailService } from "./email.service";
import { NotificationService } from "./notification.service";

export class AdoptionService {
    private adoptionRepository = new AdoptionRepository();
    private petRepository = new PetRepository();
    private userRepository = new UserRepository();
    private aiService = new AIService();
    private emailService = new EmailService();
    private notificationService = new NotificationService();

    // USER
    async submitApplication(userId: string,
        dto: CreateAdoptionDto): Promise<IAdoption> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new HttpException(404, "User not found");
        }
        const pet = await this.petRepository.findById(dto.petId);

        if (!pet) {
            throw new HttpException(404, "Pet not found");
        }
        if (pet.status !== "AVAILABLE") {
            throw new HttpException(
                400,
                "This pet is currently unavailable for adoption."
            );
        }
        const existingApplication =
            await this.adoptionRepository.findUserApplicationForPet(
                userId,
                dto.petId
            );

        if (existingApplication) {
            throw new HttpException(
                409,
                "You already have an active application for this pet."
            );
        }
        const compatibility =
            await this.aiService.analyzeCompatibility(
                userId,
                dto.petId
            );
        const application =
            await this.adoptionRepository.create({
                userId,
                petId: dto.petId,
                status: "pending",
                applicationData: dto.applicationData,
                aiMatchScore: compatibility.matchScore,
                submittedAt: new Date(),
            });

        void this.emailService
            .sendBookingEmail(
                {
                    fullName: user.fullName,
                    email: user.email,
                },
                `Your adoption application for ${pet.name} has been submitted successfully.`
            )
            .catch((error) => {
                console.warn("Adoption booking email delivery failed.", error);
            });

        return application;
    }
    async getMyApplications(userId: string,
        page = 1,
        limit = 10
    ) {
        return this.adoptionRepository.findByUserId(
            userId,
            page,
            limit
        );
    }
    async getApplicationById(
        applicationId: string
    ) {

        const application =
            await this.adoptionRepository.findById(
                applicationId
            );

        if (!application) {
            throw new HttpException(
                404,
                "Application not found."
            );
        }

        return application;
    }
    async cancelApplication(
        applicationId: string,
        userId: string
    ) {

        const application =
            await this.getApplicationById(
                applicationId
            );

        if (
            application.userId.toString() !==
            userId
        ) {
            throw new HttpException(
                403,
                "Unauthorized."
            );
        }

        if (
            application.status !== "pending"
        ) {
            throw new HttpException(
                400,
                "Only pending applications can be cancelled."
            );
        }

        const updatedApplication = await this.adoptionRepository.update(
            applicationId,
            {
                status: "cancelled",
            }
        );

        const applicant = await this.userRepository.findById(application.userId.toString());

        void this.emailService
            .sendCancellationEmail(
                {
                    fullName: applicant?.fullName,
                    email: applicant?.email ?? "",
                },
                `Your adoption application for pet ID ${application.petId.toString()} has been cancelled.`
            )
            .catch((error) => {
                console.warn("Adoption cancellation email delivery failed.", error);
            });

        return updatedApplication;
    }

    // ADMIN
    async getAllApplications(
        page = 1,
        limit = 10,
        status?: string
    ) {

        return this.adoptionRepository.findAll(
            page,
            limit,
            status
        );
    }

    async getPendingApplications(
        page = 1,
        limit = 10
    ) {

        return this.adoptionRepository.findAll(
            page,
            limit,
            "pending"
        );
    }

    async approveApplication(
        applicationId: string,
        adminNotes?: string
    ) {

        const application =
            await this.getApplicationById(
                applicationId
            );

        if (
            application.status !== "pending"
        ) {
            throw new HttpException(
                400,
                "Application has already been reviewed."
            );
        }

        await this.petRepository.update(
            application.petId.toString(),
            {
                status: "PENDING",
            }
        );

        const updatedApplication = await this.adoptionRepository.update(
            applicationId,
            {
                status: "approved",
                adminNotes,
                reviewedAt: new Date(),
            }
        );

        // Auto-reject all other pending applications for the same pet
        await this.rejectOtherApplications(
            application.petId.toString(),
            applicationId
        );

        const applicant = await this.userRepository.findById(application.userId.toString());

        if (applicant) {
            void this.emailService
                .sendApprovalEmail(
                    {
                        fullName: applicant.fullName,
                        email: applicant.email,
                    },
                    `Your adoption application for ${application.petId.toString()} has been approved.`
                )
                .catch((error) => {
                    console.warn("Adoption approval email delivery failed.", error);
                });

            void this.notificationService
                .createNotification(
                    applicant._id.toString(),
                    "adoption_approved",
                    "Application Approved",
                    `Your adoption application has been approved.`,
                    `/adoptions/${applicationId}`
                )
                .catch(() => {});
        }

        return updatedApplication;
    }

    async rejectApplication(
        applicationId: string,
        adminNotes?: string
    ) {

        const application =
            await this.getApplicationById(
                applicationId
            );

        if (
            application.status !== "pending"
        ) {
            throw new HttpException(
                400,
                "Application has already been reviewed."
            );
        }

        const updatedApplication = await this.adoptionRepository.update(
            applicationId,
            {
                status: "rejected",
                adminNotes,
                reviewedAt: new Date(),
            }
        );

        await this.petRepository.update(
            application.petId.toString(),
            {
                status: "AVAILABLE",
            }
        );

        const applicant = await this.userRepository.findById(application.userId.toString());

        if (applicant) {
            void this.emailService
                .sendCancellationEmail(
                    {
                        fullName: applicant.fullName,
                        email: applicant.email,
                    },
                    `Your adoption application for ${application.petId.toString()} has been rejected.`
                )
                .catch((error) => {
                    console.warn("Adoption rejection email delivery failed.", error);
                });

            void this.notificationService
                .createNotification(
                    applicant._id.toString(),
                    "adoption_rejected",
                    "Application Rejected",
                    `Your adoption application has been rejected.`,
                    `/adoptions/${applicationId}`
                )
                .catch(() => {});
        }

        return updatedApplication;
    }

    async completeAdoption(
        applicationId: string
    ) {

        const application =
            await this.getApplicationById(
                applicationId
            );

        if (
            application.status !== "approved"
        ) {
            throw new HttpException(
                400,
                "Application must be approved first."
            );
        }

        await this.petRepository.update(
            application.petId.toString(),
            {
                status: "ADOPTED",
            }
        );

        const completedApplication = await this.adoptionRepository.update(
            applicationId,
            {
                status: "completed",
                completedAt: new Date(),
            }
        );

        const applicant = await this.userRepository.findById(application.userId.toString());

        if (applicant) {
            void this.emailService
                .sendCompletionEmail(
                    {
                        fullName: applicant.fullName,
                        email: applicant.email,
                    },
                    `Your adoption for pet ID ${application.petId.toString()} has been completed.`
                )
                .catch((error) => {
                    console.warn("Adoption completion email delivery failed.", error);
                });

            void this.notificationService
                .createNotification(
                    applicant._id.toString(),
                    "adoption_completed",
                    "Adoption Completed",
                    `Congratulations! Your adoption has been completed.`,
                    `/adoptions/${applicationId}`
                )
                .catch(() => {});
        }

        return completedApplication;
    }


    // SHARED
    async getApplicationsByPet(
        petId: string
    ) {

        return this.adoptionRepository.findByPetId(
            petId
        );
    }

    async getApplicationsByUser(
        userId: string,
        page = 1,
        limit = 10
    ) {

        return this.adoptionRepository.findByUserId(
            userId,
            page,
            limit
        );
    }

    async getStatistics() {

        const status =
            await this.adoptionRepository.countByStatus();

        const recent =
            await this.adoptionRepository.getRecentAdoptions(5);

        return {
            status,
            recent,
        };
    }
    async findUserApplicationForPet(
        userId: string,
        petId: string
    ) {

        const application =
            await this.adoptionRepository.findUserApplicationForPet(
                userId,
                petId
            );

        if (!application) {
            throw new HttpException(
                404,
                "Application not found."
            );
        }

        return application;
    }

    async findPendingByPet(
        petId: string
    ): Promise<IAdoption[]> {

        return Adoption.find({
            petId,
            status: "pending"
        });

    }
    async rejectOtherApplications(
        petId: string,
        approvedId: string
    ): Promise<void> {

        await Adoption.updateMany(
            {
                petId,
                _id: { $ne: approvedId },
                status: "pending"
            },
            {
                $set: {
                    status: "rejected",
                    reviewedAt: new Date(),
                    adminNotes:
                        "Another applicant has been approved."
                }
            }
        );

    }
    async count(): Promise<number> {

        return Adoption.countDocuments();

    }

    async countPending(): Promise<number> {

        return Adoption.countDocuments({
            status: "pending"
        });

    }

    async countApproved(): Promise<number> {

        return Adoption.countDocuments({
            status: "approved"
        });

    }

    async countCompleted(): Promise<number> {

        return Adoption.countDocuments({
            status: "completed"
        });

    }

    async countRejected(): Promise<number> {

        return Adoption.countDocuments({
            status: "rejected"
        });

    }

    async countCancelled(): Promise<number> {

        return Adoption.countDocuments({
            status: "cancelled"
        });

    }

    async getDashboardStatistics() {

        const [statusCounts, total] = await Promise.all([

            Adoption.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]),

            Adoption.countDocuments()

        ]);

        return {
            total,
            statusCounts
        };
    }

}
