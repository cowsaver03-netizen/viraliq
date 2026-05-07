const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
  try {
    const {
      form_name,
      form_email,
      form_country_code,
      form_phone,
      form_subject,
      form_message
    } = req.body;

    const contact = new Contact({
      name: form_name,
      email: form_email,
      countryCode: form_country_code,
      phone: form_phone,
      subject: form_subject,
      message: form_message
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// (Optional) Admin: Get all contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};