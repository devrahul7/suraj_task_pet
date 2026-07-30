import z from "zod";
import { CreateBlogDTO } from "../dtos/blog.dto";
import { HttpException } from "../exceptions/http-exception";
import { BlogService } from "../services/blog.service";
import { ApiResponseHelper } from "../utils/api-response";

const blogService = new BlogService();
export class BlogController {
    //Create a new blog
    async createBlog(req: any, res: any) {
        try {
            const userId = req.user._id;//for authorized middleware
            req.body.authorId = String(userId); //set the authorId in the request body for logged in user
            const parseResult = CreateBlogDTO.safeParse(req.body);//validate the request body using zod
            if (!parseResult.success) {
                throw new HttpException(
                    400,
                    z.prettifyError(parseResult.error)
                );

            }
            const createdBlog = await blogService.createBlog(parseResult.data);
            return ApiResponseHelper.success(res, createdBlog, 200, "Blog created successfully");
        }catch (e: Error | unknown | any) {
            return ApiResponseHelper.error(
                res,
                e?.message || "Failed to create blog",
                e.status || 500
            );
        }
    }

    //Get Bloog By Author Id
    async getBlogsByAuthorId(req: any, res: any) {
        try {
            const userId = req.user._id; //For authorized middleware
            if (!userId) {
                throw new HttpException(401, "Unauthorized");
            }
            const blogs = await blogService.getBlogsByAuthorId(String(userId));
            return ApiResponseHelper.success(res, blogs, 200, "Blogs retrieved successfully");
        }catch (e: Error | unknown | any) {
            return ApiResponseHelper.error(
                res,
                e?.message || "Failed to retrieve blogs",
                e.status || 500
            );
        }
    }

    // Get Paginated Blogs
    async getPaginatedBlogs(req: any, res: any) {
        try {
            const { page = 1, limit = 15, search } = req.query;
            const {data, pagination} = await blogService.getPaginatedBlogs(page as string, limit as string, search as string);  
            return ApiResponseHelper.success(res, {data, pagination}, 200, "Paginated blogs retrieved successfully");
        }catch (e: Error | unknown | any) {
            return ApiResponseHelper.error(
                res,
                e?.message || "Failed to retrieve paginated blogs",
                e.status || 500
            );
        }
    }
}