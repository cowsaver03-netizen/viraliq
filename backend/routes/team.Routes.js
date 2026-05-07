const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

const {
    createTeam,
    getTeam,
    updateTeam,
    deleteTeam
} = require('../controllers/team.Controller');
const { route } = require('./blog.Routes');


router.post('/', upload.single('image'), createTeam);
router.get('/', getTeam);
router.put('/:id', upload.single('image'), updateTeam);
router.delete('/:id', deleteTeam);


module.exports = router;