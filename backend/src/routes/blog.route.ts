import { Router } from "express";
import { BlogController } from "../controllers/blog.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const blogController = new BlogController();

/**
 * Public
 * Get Published Blogs
 *
 * GET /api/v1/blogs
 */
router.get(
  "/",
  blogController.getPaginatedBlogs
);

/**
 * Logged in User
 * Get My Blogs
 *
 * GET /api/v1/blogs/my
 */
router.get(
  "/my",
  authorizedMiddleware,
  blogController.getBlogsByAuthorId
);

/**
 * Logged in User
 * Create Blog
 *
 * POST /api/v1/blogs
 */
router.post(
  "/",
  authorizedMiddleware,
  blogController.createBlog
);

export default router;