const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
    try{
        const { title, keyword, description } = req.body;
        const image = req.file? req.file.path : "";

        const blog = new Blog({
            title,
            keyword,
            description,
            image
        });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getBlogs = async (req, res) => {
    try{
        const blogs = await Blog.find().sort({ createdAt: -1 });
        if(!blogs){
            return res.status(404).json({message: "no blog found"});
        }
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    try{
        const { title, keyword, description } = req.body;
        let image = null;
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message: "blog not found"});
        }
        image = blog.image;
        if(req.file){
            image = req.file.path;
        }

        blog.title = title;
        blog.keyword = keyword;
        blog.description = description;
        blog.image = image;
        await blog.save();
        res.status(201).json({ success : true, blog});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.deleteBlog = async (req, res) => {
    try{
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if(!blog) {
            return res.status(404).json({message: "blog not found"});
        }
        res.json({message: "blog has deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};