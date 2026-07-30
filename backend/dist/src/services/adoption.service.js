"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdoptionService = void 0;
const http_exception_1 = require("../exceptions/http-exception");
const adoption_model_1 = require("../models/adoption.model");
const adoption_repository_1 = require("../repositories/adoption.repository");
const pet_repository_1 = require("../repositories/pet.repository");
const user_repository_1 = require("../repositories/user.repository");
const ai_service_1 = require("./ai.service");
const email_service_1 = require("./email.service");
const notification_service_1 = require("./notification.service");
class AdoptionService {
    adoptionRepository = new adoption_repository_1.AdoptionRepository();
    petRepository = new pet_repository_1.PetRepository();
    userRepository = new user_repository_1.UserRepository();
    aiService = new ai_service_1.AIService();
    emailService = new email_service_1.EmailService();
    notificationService = new notification_service_1.NotificationService();
    // USER
    async submitApplication(userId, dto) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found");
        }
        const pet = await this.petRepository.findById(dto.petId);
        if (!pet) {
            throw new http_exception_1.HttpException(404, "Pet not found");
        }
        if (pet.status !== "AVAILABLE") {
            throw new http_exception_1.HttpException(400, "This pet is currently unavailable for adoption.");
        }
        const existingApplication = await this.adoptionRepository.findUserApplicationForPet(userId, dto.petId);
        if (existingApplication) {
            throw new http_exception_1.HttpException(409, "You already have an active application for this pet.");
        }
        const compatibility = await this.aiService.analyzeCompatibility(userId, dto.petId);
        const application = await this.adoptionRepository.create({
            userId,
            petId: dto.petId,
            status: "pending",
            applicationData: dto.applicationData,
            aiMatchScore: compatibility.matchScore,
            submittedAt: new Date(),
        });
        void this.emailService
            .sendBookingEmail({
            fullName: user.fullName,
            email: user.email,
        }, `Your adoption application for ${pet.name} has been submitted successfully.`)
            .catch((error) => {
            console.warn("Adoption booking email delivery failed.", error);
        });
        return application;
    }
    async getMyApplications(userId, page = 1, limit = 10) {
        return this.adoptionRepository.findByUserId(userId, page, limit);
    }
    async getApplicationById(applicationId) {
        const application = await this.adoptionRepository.findById(applicationId);
        if (!application) {
            throw new http_exception_1.HttpException(404, "Application not found.");
        }
        return application;
    }
    async cancelApplication(applicationId, userId) {
        const application = await this.getApplicationById(applicationId);
        if (application.userId.toString() !==
            userId) {
            throw new http_exception_1.HttpException(403, "Unauthorized.");
        }
        if (application.status !== "pending") {
            throw new http_exception_1.HttpException(400, "Only pending applications can be cancelled.");
        }
        const updatedApplication = await this.adoptionRepository.update(applicationId, {
            status: "cancelled",
        });
        const applicant = await this.userRepository.findById(application.userId.toString());
        void this.emailService
            .sendCancellationEmail({
            fullName: applicant?.fullName,
            email: applicant?.email ?? "",
        }, `Your adoption application for pet ID ${application.petId.toString()} has been cancelled.`)
            .catch((error) => {
            console.warn("Adoption cancellation email delivery failed.", error);
        });
        return updatedApplication;
    }
    // ADMIN
    async getAllApplications(page = 1, limit = 10, status) {
        return this.adoptionRepository.findAll(page, limit, status);
    }
    async getPendingApplications(page = 1, limit = 10) {
        return this.adoptionRepository.findAll(page, limit, "pending");
    }
    async approveApplication(applicationId, adminNotes) {
        const application = await this.getApplicationById(applicationId);
        if (application.status !== "pending") {
            throw new http_exception_1.HttpException(400, "Application has already been reviewed.");
        }
        await this.petRepository.update(application.petId.toString(), {
            status: "PENDING",
        });
        const updatedApplication = await this.adoptionRepository.update(applicationId, {
            status: "approved",
            adminNotes,
            reviewedAt: new Date(),
        });
        // Auto-reject all other pending applications for the same pet
        await this.rejectOtherApplications(application.petId.toString(), applicationId);
        const applicant = await this.userRepository.findById(application.userId.toString());
        if (applicant) {
            void this.emailService
                .sendApprovalEmail({
                fullName: applicant.fullName,
                email: applicant.email,
            }, `Your adoption application for ${application.petId.toString()} has been approved.`)
                .catch((error) => {
                console.warn("Adoption approval email delivery failed.", error);
            });
            void this.notificationService
                .createNotification(applicant._id.toString(), "adoption_approved", "Application Approved", `Your adoption application has been approved.`, `/adoptions/${applicationId}`)
                .catch(() => { });
        }
        return updatedApplication;
    }
    async rejectApplication(applicationId, adminNotes) {
        const application = await this.getApplicationById(applicationId);
        if (application.status !== "pending") {
            throw new http_exception_1.HttpException(400, "Application has already been reviewed.");
        }
        const updatedApplication = await this.adoptionRepository.update(applicationId, {
            status: "rejected",
            adminNotes,
            reviewedAt: new Date(),
        });
        await this.petRepository.update(application.petId.toString(), {
            status: "AVAILABLE",
        });
        const applicant = await this.userRepository.findById(application.userId.toString());
        if (applicant) {
            void this.emailService
                .sendCancellationEmail({
                fullName: applicant.fullName,
                email: applicant.email,
            }, `Your adoption application for ${application.petId.toString()} has been rejected.`)
                .catch((error) => {
                console.warn("Adoption rejection email delivery failed.", error);
            });
            void this.notificationService
                .createNotification(applicant._id.toString(), "adoption_rejected", "Application Rejected", `Your adoption application has been rejected.`, `/adoptions/${applicationId}`)
                .catch(() => { });
        }
        return updatedApplication;
    }
    async completeAdoption(applicationId) {
        const application = await this.getApplicationById(applicationId);
        if (application.status !== "approved") {
            throw new http_exception_1.HttpException(400, "Application must be approved first.");
        }
        await this.petRepository.update(application.petId.toString(), {
            status: "ADOPTED",
        });
        const completedApplication = await this.adoptionRepository.update(applicationId, {
            status: "completed",
            completedAt: new Date(),
        });
        const applicant = await this.userRepository.findById(application.userId.toString());
        if (applicant) {
            void this.emailService
                .sendCompletionEmail({
                fullName: applicant.fullName,
                email: applicant.email,
            }, `Your adoption for pet ID ${application.petId.toString()} has been completed.`)
                .catch((error) => {
                console.warn("Adoption completion email delivery failed.", error);
            });
            void this.notificationService
                .createNotification(applicant._id.toString(), "adoption_completed", "Adoption Completed", `Congratulations! Your adoption has been completed.`, `/adoptions/${applicationId}`)
                .catch(() => { });
        }
        return completedApplication;
    }
    // SHARED
    async getApplicationsByPet(petId) {
        return this.adoptionRepository.findByPetId(petId);
    }
    async getApplicationsByUser(userId, page = 1, limit = 10) {
        return this.adoptionRepository.findByUserId(userId, page, limit);
    }
    async getStatistics() {
        const status = await this.adoptionRepository.countByStatus();
        const recent = await this.adoptionRepository.getRecentAdoptions(5);
        return {
            status,
            recent,
        };
    }
    async findUserApplicationForPet(userId, petId) {
        const application = await this.adoptionRepository.findUserApplicationForPet(userId, petId);
        if (!application) {
            throw new http_exception_1.HttpException(404, "Application not found.");
        }
        return application;
    }
    async findPendingByPet(petId) {
        return adoption_model_1.Adoption.find({
            petId,
            status: "pending"
        });
    }
    async rejectOtherApplications(petId, approvedId) {
        await adoption_model_1.Adoption.updateMany({
            petId,
            _id: { $ne: approvedId },
            status: "pending"
        }, {
            $set: {
                status: "rejected",
                reviewedAt: new Date(),
                adminNotes: "Another applicant has been approved."
            }
        });
    }
    async count() {
        return adoption_model_1.Adoption.countDocuments();
    }
    async countPending() {
        return adoption_model_1.Adoption.countDocuments({
            status: "pending"
        });
    }
    async countApproved() {
        return adoption_model_1.Adoption.countDocuments({
            status: "approved"
        });
    }
    async countCompleted() {
        return adoption_model_1.Adoption.countDocuments({
            status: "completed"
        });
    }
    async countRejected() {
        return adoption_model_1.Adoption.countDocuments({
            status: "rejected"
        });
    }
    async countCancelled() {
        return adoption_model_1.Adoption.countDocuments({
            status: "cancelled"
        });
    }
    async getDashboardStatistics() {
        const [statusCounts, total] = await Promise.all([
            adoption_model_1.Adoption.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]),
            adoption_model_1.Adoption.countDocuments()
        ]);
        return {
            total,
            statusCounts
        };
    }
}
exports.AdoptionService = AdoptionService;
