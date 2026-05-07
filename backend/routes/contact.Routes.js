const express = require('express');
const router = express.Router();

const {
  createContact,
  getContacts
} = require('../controllers/contact.Controller');

router.post('/', createContact);
router.get('/', getContacts); // optional for admin

module.exports = router;