import { Request, Response } from "express";
import { z } from "zod";

import { BlogService } from "../../services/blog.service";
import {
  CreateBlogDTO,
  UpdateBlogDTO,
} from "../../dtos/blog.dto";

import { ApiResponseHelper } from "../../utils/api-response";
import { HttpException } from "../../exceptions/http-exception";

const blogService = new BlogService();

interface QueryParams {
  page?: string;
  limit?: string;
  search?: string;
}

export class AdminBlogController {
  /**
   * Dashboard Statistics
   */
  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await blogService.getDashboardStatistics();

      return ApiResponseHelper.success(
        res,
        stats,
        200,
        "Dashboard statistics retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to retrieve dashboard statistics",
        e.status || 500
      );
    }
  }

  /**
   * Create Blog
   */
  async createBlog(req: Request, res: Response) {
    try {
      const parsed = CreateBlogDTO.safeParse(req.body);

      if (!parsed.success) {
        throw new HttpException(
          400,
          z.prettifyError(parsed.error)
        );
      }

      const filename = req.file?.filename;

      const blog = await blogService.createBlog({
        ...parsed.data,
        ...(filename && {
          coverImage: `/uploads/${filename}`,
        }),
      });

      return ApiResponseHelper.success(
        res,
        blog,
        201,
        "Blog created successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to create blog",
        e.status || 500
      );
    }
  }

  /**
   * Get Blogs
   */
  async getBlogPaginated(req: Request, res: Response) {
    try {
      const { page, limit, search } = req.query as QueryParams;

      const blogs = await blogService.getPaginatedBlogs(
        page,
        limit,
        search
      );

      return ApiResponseHelper.success(
        res,
        blogs.data,
        200,
        "Blogs retrieved successfully",
        blogs.pagination
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to retrieve blogs",
        e.status || 500
      );
    }
  }

  /**
   * Get Blog
   */
  async getBlogById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new HttpException(
          400,
          "Blog ID is required"
        );
      }

      const blog = await blogService.getById(id);

      return ApiResponseHelper.success(
        res,
        blog,
        200,
        "Blog retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to retrieve blog",
        e.status || 500
      );
    }
  }

  /**
   * Update Blog
   */
  async updateBlogById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new HttpException(
          400,
          "Blog ID is required"
        );
      }

      const parsed = UpdateBlogDTO.safeParse(req.body);

      if (!parsed.success) {
        throw new HttpException(
          400,
          z.prettifyError(parsed.error)
        );
      }

      const filename = req.file?.filename;

      const blog = await blogService.updateById(id, {
        ...parsed.data,
        ...(filename && {
          coverImage: `/uploads/${filename}`,
        }),
      });

      return ApiResponseHelper.success(
        res,
        blog,
        200,
        "Blog updated successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to update blog",
        e.status || 500
      );
    }
  }

  /**
   * Publish / Unpublish Blog
   */
  async updateBlogStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { published } = req.body;

      if (!id) {
        throw new HttpException(
          400,
          "Blog ID is required"
        );
      }

      if (typeof published !== "boolean") {
        throw new HttpException(
          400,
          "published must be a boolean"
        );
      }

      const blog = await blogService.updateStatus(
        id,
        published
      );

      return ApiResponseHelper.success(
        res,
        blog,
        200,
        "Blog status updated successfully"
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
   * Delete Blog
   */
  async deleteBlogById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new HttpException(
          400,
          "Blog ID is required"
        );
      }

      await blogService.deleteById(id);

      return ApiResponseHelper.success(
        res,
        null,
        200,
        "Blog deleted successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to delete blog",
        e.status || 500
      );
    }
  }
}