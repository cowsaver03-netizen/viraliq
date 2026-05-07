const { message } = require('statuses');
const Team = require('../models/Team');

exports.createTeam = async (req, res) => {
    try{
        const { name, designation, instagram, facebook, twitter, whatsapp } = req.body;
        const image = req.file ? req.file.path : "";
        const team = new Team({
            name,
            designation,
            image,
            instagram,
            facebook,
            twitter,
            whatsapp
        });
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getTeam = async (req, res) => {
    try{
        const team = await Team.find().sort({ createdAt: -1} );
        if(!team){
            return res.status(404).json({message: "not found"});
        }
        res.json(team);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateTeam = async (req, res) => {
    try{
        const { name, designation, instagram, facebook, twitter, whatsapp } = req.body;
        let image = null;
        const team = await Team.findById(req.params.id);
        if(!team) {
            return res.status(404).json({message: "not found"});
        }
        image = team.image;
        
        if(req.file) {
            image = req.file.path;
        }
        team.name = name;
        team.designation = designation;
        team.image = image;
        team.instagram = instagram;
        team.facebook = facebook;
        team.twitter = twitter;
        team.whatsapp = whatsapp;
        await team.save();
        res.status(201).json({ success: true, team });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteTeam = async (req, res) => {
    try{
        const team = await Team.findByIdAndDelete(req.params.id);
        if(!team){
            return res.status(404).json({message: "not found"});
        }
        res.json({message: "member has deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};