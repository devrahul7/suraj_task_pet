"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const blog_model_1 = require("../models/blog.model");
class BlogRepository {
    async createBlog(blogData) {
        const blog = new blog_model_1.BlogModel(blogData);
        await blog.save();
        return blog;
    }
    async getBlogByAuthorId(authorId) {
        const blogs = await blog_model_1.BlogModel
            .find({ authorId: authorId })
            .populate("authorId", "firstName lastName email");
        return blogs;
    }
    async getPaginatedBlogs(page, limit, search) {
        const skip = (page - 1) * limit;
        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }
        const blogs = await blog_model_1.BlogModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .populate("authorId", "firstName lastName email");
        const totalBlogs = await blog_model_1.BlogModel.countDocuments(query);
        return { data: blogs, total: totalBlogs };
    }
    async getAll() {
        const blogs = await blog_model_1.BlogModel.find().populate("authorId", "firstName lastName, email");
        return blogs;
    }
    async getById(id) {
        const blog = await blog_model_1.BlogModel.findById(id).populate("authorId", "firstName lastName email");
        return blog;
    }
    async updateById(id, data) {
        const blog = await blog_model_1.BlogModel.findByIdAndUpdate(id, data, { new: true }).populate("authorId", "firstName lastName email");
        return blog;
    }
    async deleteById(id) {
        const blog = await blog_model_1.BlogModel.findByIdAndDelete(id);
        return blog;
    }
    async count(filter = {}) {
        return await blog_model_1.BlogModel.countDocuments(filter);
    }
    async getRecent(limit = 5) {
        return await blog_model_1.BlogModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("authorId", "firstName lastName email");
    }
}
exports.BlogRepository = BlogRepository;
