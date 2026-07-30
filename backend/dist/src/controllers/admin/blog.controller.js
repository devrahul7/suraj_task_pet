"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBlogController = void 0;
const zod_1 = require("zod");
const blog_service_1 = require("../../services/blog.service");
const blog_dto_1 = require("../../dtos/blog.dto");
const api_response_1 = require("../../utils/api-response");
const http_exception_1 = require("../../exceptions/http-exception");
const blogService = new blog_service_1.BlogService();
class AdminBlogController {
    /**
     * Dashboard Statistics
     */
    async getDashboardStats(req, res) {
        try {
            const stats = await blogService.getDashboardStatistics();
            return api_response_1.ApiResponseHelper.success(res, stats, 200, "Dashboard statistics retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to retrieve dashboard statistics", e.status || 500);
        }
    }
    /**
     * Create Blog
     */
    async createBlog(req, res) {
        try {
            const parsed = blog_dto_1.CreateBlogDTO.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, zod_1.z.prettifyError(parsed.error));
            }
            const filename = req.file?.filename;
            const blog = await blogService.createBlog({
                ...parsed.data,
                ...(filename && {
                    coverImage: `/uploads/${filename}`,
                }),
            });
            return api_response_1.ApiResponseHelper.success(res, blog, 201, "Blog created successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to create blog", e.status || 500);
        }
    }
    /**
     * Get Blogs
     */
    async getBlogPaginated(req, res) {
        try {
            const { page, limit, search } = req.query;
            const blogs = await blogService.getPaginatedBlogs(page, limit, search);
            return api_response_1.ApiResponseHelper.success(res, blogs.data, 200, "Blogs retrieved successfully", blogs.pagination);
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to retrieve blogs", e.status || 500);
        }
    }
    /**
     * Get Blog
     */
    async getBlogById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new http_exception_1.HttpException(400, "Blog ID is required");
            }
            const blog = await blogService.getById(id);
            return api_response_1.ApiResponseHelper.success(res, blog, 200, "Blog retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to retrieve blog", e.status || 500);
        }
    }
    /**
     * Update Blog
     */
    async updateBlogById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new http_exception_1.HttpException(400, "Blog ID is required");
            }
            const parsed = blog_dto_1.UpdateBlogDTO.safeParse(req.body);
            if (!parsed.success) {
                throw new http_exception_1.HttpException(400, zod_1.z.prettifyError(parsed.error));
            }
            const filename = req.file?.filename;
            const blog = await blogService.updateById(id, {
                ...parsed.data,
                ...(filename && {
                    coverImage: `/uploads/${filename}`,
                }),
            });
            return api_response_1.ApiResponseHelper.success(res, blog, 200, "Blog updated successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to update blog", e.status || 500);
        }
    }
    /**
     * Publish / Unpublish Blog
     */
    async updateBlogStatus(req, res) {
        try {
            const { id } = req.params;
            const { published } = req.body;
            if (!id) {
                throw new http_exception_1.HttpException(400, "Blog ID is required");
            }
            if (typeof published !== "boolean") {
                throw new http_exception_1.HttpException(400, "published must be a boolean");
            }
            const blog = await blogService.updateStatus(id, published);
            return api_response_1.ApiResponseHelper.success(res, blog, 200, "Blog status updated successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to update status", e.status || 500);
        }
    }
    /**
     * Delete Blog
     */
    async deleteBlogById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new http_exception_1.HttpException(400, "Blog ID is required");
            }
            await blogService.deleteById(id);
            return api_response_1.ApiResponseHelper.success(res, null, 200, "Blog deleted successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to delete blog", e.status || 500);
        }
    }
}
exports.AdminBlogController = AdminBlogController;
