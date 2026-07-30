"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const http_exception_1 = require("../exceptions/http-exception");
const blog_repository_1 = require("../repositories/blog.repository");
const blogRepository = new blog_repository_1.BlogRepository();
class BlogService {
    async createBlog(blogData) {
        const createdBlog = await blogRepository.createBlog(blogData);
        return createdBlog;
    }
    async getBlogsByAuthorId(authorId) {
        const blogs = await blogRepository.getBlogByAuthorId(authorId);
        return blogs;
    }
    async getPaginatedBlogs(page, limit, search) {
        const currentPage = page ? parseInt(page, 10) : 1;
        const currentLimit = limit ? parseInt(limit, 10) : 10;
        const { data, total } = await blogRepository.getPaginatedBlogs(currentPage, currentLimit, search);
        const totalPages = Math.ceil(total / currentLimit);
        return {
            data,
            pagination: {
                total,
                page: currentPage,
                limit: currentLimit,
                totalPages,
            },
        };
    }
    async getAll() {
        const blogs = await blogRepository.getAll();
        if (!blogs) {
            throw new http_exception_1.HttpException(404, "No blogs found");
        }
        return blogs;
    }
    async getById(id) {
        const blog = await blogRepository.getById(id);
        if (!blog) {
            throw new http_exception_1.HttpException(404, "Blog not found");
        }
        return blog;
    }
    // implement DTO per data 
    async updateById(id, data) {
        const blog = await blogRepository.updateById(id, data);
        if (!blog) {
            throw new http_exception_1.HttpException(404, "Blog not found");
        }
        return blog;
    }
    async deleteById(id) {
        const blog = await blogRepository.deleteById(id);
        if (!blog) {
            throw new http_exception_1.HttpException(404, "Blog not found");
        }
        return blog;
    }
    // get dashboard statistics
    async getDashboardStatistics() {
        const total = await blogRepository.count();
        const published = await blogRepository.count({
            published: true,
        });
        const drafts = await blogRepository.count({
            published: false,
        });
        return {
            total,
            published,
            drafts,
        };
    }
    //update blog status
    async updateStatus(id, published) {
        const blog = await blogRepository.updateById(id, {
            published,
        });
        if (!blog) {
            throw new http_exception_1.HttpException(404, "Blog not found");
        }
        return blog;
    }
}
exports.BlogService = BlogService;
