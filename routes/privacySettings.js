const express = require('express');
const router = express.Router();

// For simplicity, using in-memory settings per user (in real app, store in DB)
const userSettings = new Map();

// Get privacy settings
router.get('/', (req, res) => {
  const settings = userSettings.get(req.user.id) || {
    collectSensitiveData: true,
    autoDetectSensitiveFields: true,
    encryptAllData: true,
    dataRetentionPeriod: 90,
    automaticDeletion: true,
    retentionStrategy: 'archive',
    privacyLevel: 'high',
    sensitivityThreshold: 70,
    emailNotifications: true,
    sensitiveDataAlerts: true,
    breachNotifications: true,
    allowDataExport: true,
    exportFormat: 'json',
    enableAnalytics: true,
    shareAnalytics: false,
    gdprCompliance: true,
    ccpaCompliance: true,
    hipaaCompliance: false
  };
  res.json(settings);
});

// Update privacy settings
router.put('/', (req, res) => {
  userSettings.set(req.user.id, req.body);
  res.json({ message: 'Privacy settings updated successfully' });
});

module.exports = router;
