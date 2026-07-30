import { BlogModel, IBlog } from "../models/blog.model";

export interface IBlogRepository {
    createBlog(blogData: any): Promise<IBlog>;
    getBlogByAuthorId(authorId: string): Promise<IBlog[]>;
    getPaginatedBlogs(page: number, limit: number, search?: string): Promise<{ data: IBlog[], total: number }>;
    getAll(): Promise<IBlog[]>;
    getById(id: string): Promise<IBlog | null>;
    updateById(id: string, data: any): Promise<IBlog | null>;
    deleteById(id: string): Promise<IBlog | null>;

    count(filter?: any): Promise<number>;
    getRecent(limit: number): Promise<IBlog[]>;
}
export class BlogRepository implements IBlogRepository {
    async createBlog(blogData: any): Promise<IBlog> {
        const blog = new BlogModel(blogData);
        await blog.save();
        return blog;
    }
    async getBlogByAuthorId(authorId: string): Promise<IBlog[]> {
        const blogs = await BlogModel
            .find({ authorId: authorId as any })
            .populate("authorId", "firstName lastName email");
        return blogs;
    }
    async getPaginatedBlogs(page: number, limit: number, search?: string): Promise<{ data: IBlog[], total: number }> {
        const skip = (page - 1) * limit;
        const query: any = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        }
        const blogs = await BlogModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .populate("authorId", "firstName lastName email");
        const totalBlogs = await BlogModel.countDocuments(query);
        return { data: blogs, total: totalBlogs };
    }
    async getAll() {
        const blogs = await BlogModel.find().populate("authorId", "firstName lastName, email");
        return blogs;
    }

    async getById(id: string) {
        const blog = await BlogModel.findById(id).populate("authorId", "firstName lastName email");
        return blog;
    }

    async updateById(id: string, data: any) {
        const blog = await BlogModel.findByIdAndUpdate(id, data, { new: true }).populate("authorId", "firstName lastName email");
        return blog;
    }

    async deleteById(id: string) {
        const blog = await BlogModel.findByIdAndDelete(id);
        return blog;
    }

    async count(filter: any = {}): Promise<number> {
        return await BlogModel.countDocuments(filter);
    }
    async getRecent(limit = 5): Promise<IBlog[]> {
        return await BlogModel
            .find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("authorId", "firstName lastName email");
    }
}