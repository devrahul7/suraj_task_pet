"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const zod_1 = __importDefault(require("zod"));
const blog_dto_1 = require("../dtos/blog.dto");
const http_exception_1 = require("../exceptions/http-exception");
const blog_service_1 = require("../services/blog.service");
const api_response_1 = require("../utils/api-response");
const blogService = new blog_service_1.BlogService();
class BlogController {
    //Create a new blog
    async createBlog(req, res) {
        try {
            const userId = req.user._id; //for authorized middleware
            req.body.authorId = String(userId); //set the authorId in the request body for logged in user
            const parseResult = blog_dto_1.CreateBlogDTO.safeParse(req.body); //validate the request body using zod
            if (!parseResult.success) {
                throw new http_exception_1.HttpException(400, zod_1.default.prettifyError(parseResult.error));
            }
            const createdBlog = await blogService.createBlog(parseResult.data);
            return api_response_1.ApiResponseHelper.success(res, createdBlog, 200, "Blog created successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e?.message || "Failed to create blog", e.status || 500);
        }
    }
    //Get Bloog By Author Id
    async getBlogsByAuthorId(req, res) {
        try {
            const userId = req.user._id; //For authorized middleware
            if (!userId) {
                throw new http_exception_1.HttpException(401, "Unauthorized");
            }
            const blogs = await blogService.getBlogsByAuthorId(String(userId));
            return api_response_1.ApiResponseHelper.success(res, blogs, 200, "Blogs retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e?.message || "Failed to retrieve blogs", e.status || 500);
        }
    }
    // Get Paginated Blogs
    async getPaginatedBlogs(req, res) {
        try {
            const { page = 1, limit = 15, search } = req.query;
            const { data, pagination } = await blogService.getPaginatedBlogs(page, limit, search);
            return api_response_1.ApiResponseHelper.success(res, { data, pagination }, 200, "Paginated blogs retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e?.message || "Failed to retrieve paginated blogs", e.status || 500);
        }
    }
}
exports.BlogController = BlogController;
