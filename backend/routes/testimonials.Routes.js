const express = require('express');
const router = express.Router();
const {
    createTestimonials,
    getTestimonials,
    updateTestimonials,
    deleteTestimonials
} = require('../controllers/testimonial.Controller');


router.get('/', getTestimonials);
router.post('/', createTestimonials);
router.put('/:id', updateTestimonials);
router.delete('/:id', deleteTestimonials);

module.exports = router