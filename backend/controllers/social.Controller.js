const Social = require('../models/Social');

exports.updateSocial = async (req, res) => {
    try{
        const { instagram, facebook, twitter, whatsapp } = req.body;
        if(!instagram || !facebook || !twitter || !whatsapp){
            return res.status(400).json({message: "required fileds are empty"});
        }
        const social = await Social.findOneAndUpdate(
            {},
            { instagram, facebook, twitter, whatsapp },
            {new: true, upsert: true}
        );
        res.status(201).json({success: true, social});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getSocial = async (req, res) => {
    try{
        const social = await Social.findOne();
        if(!social){
            return res.status(404).json({message: "not found"});
        }
        res.json(social || {});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.clearSocial = async (req, res) => {
    try{
        await Social.deleteMany();
        res.json({message: "social links are now clear"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};