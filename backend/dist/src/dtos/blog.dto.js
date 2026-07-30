"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogDTO = exports.CreateBlogDTO = void 0;
const blog_type_1 = require("../types/blog.type");
exports.CreateBlogDTO = blog_type_1.BlogSchema.pick({
    title: true,
    content: true,
    authorId: true
});
exports.UpdateBlogDTO = blog_type_1.BlogSchema.partial().pick({
    title: true,
    content: true,
});
