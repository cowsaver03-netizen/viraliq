const Testimonials = require('../models/Testimonials');

exports.createTestimonials = async (req, res) => {
    try{
        const {  name, position, comment, rating } = req.body;
        const testimonial = new Testimonials({
            name,
            position,
            comment,
            rating
        });
        await testimonial.save();
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.getTestimonials = async (req, res) => {
    try{
        const testimonials = await Testimonials.find().sort({ createdAt: -1 });
        if(!testimonials){
            return res.status(404).json({message: "No Testimonials Found"});
        }
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.updateTestimonials = async (req, res) => {
    try{
        const { name, position, comment, rating } = req.body;
        const testimonial = await Testimonials.findByIdAndUpdate(req.params.id,{
            name,
            position,
            comment,
            rating
        },{
            new: true
        });
        if(!testimonial){
            return res.status(404).json({message: " not found"});
        }
        res.status(201).json({success: true, testimonial});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteTestimonials = async (req, res) => {
    try{
        const testimonial = await Testimonials.findByIdAndDelete(req.params.id);
        if(!testimonial){
            return res.status(404).json({message: "not found"});
        }
        res.json({message: "Testimonials has deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};