const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  field_name: String,
  field_value: String,
  field_type: String,
  is_critical: Boolean,
  is_very_critical: Boolean,
  is_non_critical: Boolean,
});

const FormSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  url: String,
  page_title: String,
  captured_at: { type: Date, default: Date.now },
  fields: [FieldSchema],
  raw_form_data: mongoose.Schema.Types.Mixed,
  overallSensitivity: Number,
  sensitiveFields: [mongoose.Schema.Types.Mixed],
  is_critical: Boolean,
  is_very_critical: Boolean,
  is_non_critical: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);
