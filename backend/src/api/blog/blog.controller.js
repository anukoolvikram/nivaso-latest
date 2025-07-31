import { blogService } from './blog.service.js';

const createBlog = async (req, res) => {
    try {
        const blog = await blogService.createBlog(req.user, req.body);
        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
        console.error('Failed to create blog', error.message);
        return res.status(500).json({ error: error.message });
    }
};

const getBlogsForSociety = async (req, res) => {
    try {
        const blogs = await blogService.getBlogsBySociety(req.user);
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Failed to fetch blogs for the society', error.message);
        res.status(500).json({ error: error.message });
    }
};

const getBlogsByResident = async (req, res) => {
    try {
        const blogs = await blogService.getBlogsByResident(req.user.userId);
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Failed to fetch blogs for the society', error.message);
        res.status(500).json({ error: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const blogId = parseInt(req.params.id);
        const blog = await blogService.updateBlog(blogId, req.body);
        res.status(200).json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        console.error('Failed to update the blog', error.message);
        res.status(500).json({ error: error.message });  
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blogId = parseInt(req.params.id, 10);
        await blogService.deleteBlog(blogId);
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Failed to delete the blog', error.message);
        res.status(500).json({ error: error.message });
    }
};

export const blogController = {
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogsForSociety,
    getBlogsByResident,
};