const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.validateProfileUpdate, userController.updateProfile);
router.get('/settings', userController.getSettings);
router.put('/settings', userController.validateSettingsUpdate, userController.updateSettings);
router.put('/change-password', userController.validatePasswordChange, userController.changePassword);

module.exports = router;