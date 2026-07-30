import { CreateBlogDTO } from "../dtos/blog.dto";
import { HttpException } from "../exceptions/http-exception";
import { BlogRepository } from "../repositories/blog.repository";
const blogRepository = new BlogRepository();


export class BlogService {
    async createBlog(blogData: CreateBlogDTO) {
        const createdBlog = await blogRepository.createBlog(blogData);
        return createdBlog;
    }
    async getBlogsByAuthorId(authorId: string) {
        const blogs = await blogRepository.getBlogByAuthorId(authorId);
        return blogs;
    }
    async getPaginatedBlogs(page?: string, limit?: string, search?: string) {
        const currentPage = page ? parseInt(page, 10) : 1;
        const currentLimit = limit ? parseInt(limit, 10) : 10;

        const { data, total } = await blogRepository.getPaginatedBlogs(
            currentPage,
            currentLimit,
            search
        );

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
            throw new HttpException(404, "No blogs found");
        }
        return blogs;
    }

    async getById(id: string) {
        const blog = await blogRepository.getById(id);
        if (!blog) {
            throw new HttpException(404, "Blog not found");
        }
        return blog;
    }
    // implement DTO per data 
    async updateById(id: string, data: any) {
        const blog = await blogRepository.updateById(id, data);
        if (!blog) {
            throw new HttpException(404, "Blog not found");
        }
        return blog;
    }

    async deleteById(id: string) {
        const blog = await blogRepository.deleteById(id);
        if (!blog) {
            throw new HttpException(404, "Blog not found");
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
async updateStatus(
    id: string,
    published: boolean
) {
    const blog = await blogRepository.updateById(id, {
        published,
    });

    if (!blog) {
        throw new HttpException(404, "Blog not found");
    }

    return blog;
}
}