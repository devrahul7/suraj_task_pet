"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const blogController = new blog_controller_1.BlogController();
/**
 * Public
 * Get Published Blogs
 *
 * GET /api/v1/blogs
 */
router.get("/", blogController.getPaginatedBlogs);
/**
 * Logged in User
 * Get My Blogs
 *
 * GET /api/v1/blogs/my
 */
router.get("/my", auth_middleware_1.authorizedMiddleware, blogController.getBlogsByAuthorId);
/**
 * Logged in User
 * Create Blog
 *
 * POST /api/v1/blogs
 */
router.post("/", auth_middleware_1.authorizedMiddleware, blogController.createBlog);
exports.default = router;
