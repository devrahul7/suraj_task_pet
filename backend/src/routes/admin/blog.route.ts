import { Router } from "express";
import {
  authorizedMiddleware,
  isAdmin,
} from "../../middlewares/auth.middleware";
import { uploads } from "../../middlewares/upload.middleware";
import { AdminBlogController } from "../../controllers/admin/blog.controller";

const router = Router();
const adminBlogController = new AdminBlogController();

/**
 * Dashboard Statistics
 */
router.get(
  "/stats/dashboard",
  authorizedMiddleware,
  isAdmin,
  adminBlogController.getDashboardStats
);

/**
 * Get Blogs (Paginated)
 */
router.get(
  "/",
  authorizedMiddleware,
  isAdmin,
  adminBlogController.getBlogPaginated
);

/**
 * Get Blog By ID
 */
router.get(
  "/:id",
  authorizedMiddleware,
  isAdmin,
  adminBlogController.getBlogById
);

/**
 * Create Blog
 * image field => coverImage
 */
router.post(
  "/",
  authorizedMiddleware,
  isAdmin,
  uploads.single("coverImage"),
  adminBlogController.createBlog
);

/**
 * Update Blog
 */
router.put(
  "/:id",
  authorizedMiddleware,
  isAdmin,
  uploads.single("coverImage"),
  adminBlogController.updateBlogById
);

/**
 * Publish / Unpublish Blog
 */
router.patch(
  "/:id/status",
  authorizedMiddleware,
  isAdmin,
  adminBlogController.updateBlogStatus
);

/**
 * Delete Blog
 */
router.delete(
  "/:id",
  authorizedMiddleware,
  isAdmin,
  adminBlogController.deleteBlogById
);

export default router;