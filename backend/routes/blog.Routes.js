const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

const {
    getBlogs,
    createBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blog.controller');


router.get('/', getBlogs);
router.put('/:id', upload.single('image'), updateBlog);
router.post('/', upload.single('image'), createBlog);
router.delete('/:id', deleteBlog);

module.exports = router;