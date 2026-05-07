const express = require('express');
const router = express.Router();

const {
    updateSocial,
    getSocial,
    clearSocial
} = require('../controllers/social.Controller');

router.put('/', updateSocial);
router.get('/', getSocial);
router.delete('/', clearSocial);

module.exports = router;