const express = require('express');
const router = express.Router();
const Form = require('../models/Form');

// Get all forms for authenticated user
router.get('/', async (req, res) => {
  try {
    console.log('Fetching forms for user:', req.user.id);
    const forms = await Form.find({ user: req.user.id }).sort({ captured_at: -1 });
    console.log(`Found ${forms.length} forms for user ${req.user.id}`);
    res.json(forms);
  } catch (err) {
    console.error('Error fetching forms:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findOne({ _id: req.params.id, user: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (err) {
    console.error('Error fetching form:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update form (optional, depending on frontend needs)
router.post('/', async (req, res) => {
  try {
    console.log('Received form submission:', req.body);
    const { url, page_title, fields } = req.body;

    // Exclude dashboard URLs from data collection
    const excludedUrls = ['http://localhost:3000/register', 'http://localhost:3000/login'];
    if (excludedUrls.includes(url)) {
      console.log(`Form submission from excluded URL ${url} ignored.`);
      return res.status(200).json({ message: 'Form submission ignored for excluded URL' });
    }

    if (!url || !page_title || !Array.isArray(fields)) {
      console.log('Invalid form data:', req.body);
      return res.status(400).json({ message: 'Invalid form data. url, page_title, and fields are required.' });
    }

    // Map fields to include only field_name and optionally field_value
    const mappedFields = fields.map(field => ({
      field_name: field.field_name,
      field_value: field.field_value || ''
    }));

    const newForm = new Form({
      user: req.user.id,
      url,
      page_title,
      fields: mappedFields
    });

    const savedForm = await newForm.save();
    console.log('Form saved:', savedForm);
    res.status(201).json(savedForm);
  } catch (err) {
    console.error('Error creating form:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const mongoose = require('mongoose');

router.delete('/:id', async (req, res) => {
  try {
    const formId = req.params.id;

    // Validate formId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ message: 'Invalid form ID' });
    }

    // Find and delete the form by ID and user ID
    const form = await Form.findOneAndDelete({ _id: formId, user: req.user.id });
    if (!form) {
      return res.status(404).json({ message: 'Form not found or already deleted' });
    }
    console.log(`Form with id ${formId} deleted for user ${req.user.id}`);
    res.json({ message: 'Form deleted successfully' });
  } catch (err) {
    console.error('Error deleting form:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
