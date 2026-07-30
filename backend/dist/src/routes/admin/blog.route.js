"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const blog_controller_1 = require("../../controllers/admin/blog.controller");
const router = (0, express_1.Router)();
const adminBlogController = new blog_controller_1.AdminBlogController();
/**
 * Dashboard Statistics
 */
router.get("/stats/dashboard", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, adminBlogController.getDashboardStats);
/**
 * Get Blogs (Paginated)
 */
router.get("/", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, adminBlogController.getBlogPaginated);
/**
 * Get Blog By ID
 */
router.get("/:id", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, adminBlogController.getBlogById);
/**
 * Create Blog
 * image field => coverImage
 */
router.post("/", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, upload_middleware_1.uploads.single("coverImage"), adminBlogController.createBlog);
/**
 * Update Blog
 */
router.put("/:id", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, upload_middleware_1.uploads.single("coverImage"), adminBlogController.updateBlogById);
/**
 * Publish / Unpublish Blog
 */
router.patch("/:id/status", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, adminBlogController.updateBlogStatus);
/**
 * Delete Blog
 */
router.delete("/:id", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, adminBlogController.deleteBlogById);
exports.default = router;
