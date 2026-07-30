import { Request, Response } from "express";
import { AdoptionService } from "../../services/adoption.service";
import { ApiResponseHelper } from "../../utils/api-response";
import { Adoption } from "../../models/adoption.model";

const adoptionService = new AdoptionService();

export class AdminAdoptionController {
  async bulkReject(req: Request, res: Response) {
    try {
      const { applicationIds, adminNotes } = req.body;
      if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
        return ApiResponseHelper.error(
          res,
          "Application IDs array is required",
          400
        );
      }

      const results = await Promise.all(
        applicationIds.map((id: string) =>
          adoptionService
            .rejectApplication(
              id,
              adminNotes || "Bulk rejected by admin"
            )
            .then((app) => ({ id, success: true, status: app.status }))
            .catch((err) => ({
              id,
              success: false,
              error: err.message,
            }))
        )
      );

      return ApiResponseHelper.success(
        res,
        results,
        200,
        "Bulk rejection processed"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async bulkApprove(req: Request, res: Response) {
    try {
      const { applicationIds, adminNotes } = req.body;
      if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
        return ApiResponseHelper.error(
          res,
          "Application IDs array is required",
          400
        );
      }

      const results = await Promise.all(
        applicationIds.map((id: string) =>
          adoptionService
            .approveApplication(id, adminNotes)
            .then((app) => ({ id, success: true, status: app.status }))
            .catch((err) => ({
              id,
              success: false,
              error: err.message,
            }))
        )
      );

      return ApiResponseHelper.success(
        res,
        results,
        200,
        "Bulk approval processed"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async getApplicationsByStatus(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.params.status;

      const result = await adoptionService.getAllApplications(
        page,
        limit,
        status
      );
      return ApiResponseHelper.success(
        res,
        result.adoptions,
        200,
        "Applications retrieved successfully",
        { page, limit, total: result.total }
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async getAdoptionStats(req: Request, res: Response) {
    try {
      const stats = await adoptionService.getDashboardStatistics();
      return ApiResponseHelper.success(
        res,
        stats,
        200,
        "Adoption statistics retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async exportAdoptionData(req: Request, res: Response) {
    try {
      const status = req.query.status as string | undefined;
      const query = status ? { status } : {};
      const adoptions = await Adoption.find(query)
        .populate("userId", "fullName email phoneNumber")
        .populate("petId", "name species breed")
        .sort({ submittedAt: -1 })
        .limit(500);

      const csvHeader =
        "Application ID,User Name,User Email,Pet Name,Species,Breed,Status,AI Match Score,Submitted At,Reviewed At\n";
      const csvRows = adoptions.map((a: any) => {
        return [
          a._id,
          a.userId?.fullName || "",
          a.userId?.email || "",
          a.petId?.name || "",
          a.petId?.species || "",
          a.petId?.breed || "",
          a.status,
          a.aiMatchScore || "",
          a.submittedAt?.toISOString() || "",
          a.reviewedAt?.toISOString() || "",
        ].join(",");
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=adoptions.csv"
      );
      return res.send(csvHeader + csvRows.join("\n"));
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }
}
