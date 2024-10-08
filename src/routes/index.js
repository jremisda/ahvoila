const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const documentRoutes = require('./documentRoutes');
const searchRoutes = require('./searchRoutes');
const integrationRoutes = require('./integrationRoutes');
const meetingRoutes = require('./meetingRoutes');
const contentRoutes = require('./contentRoutes');
const userRoutes = require('./userRoutes');
const summarizationRoutes = require('./summarizationRoutes');

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/search', searchRoutes);
router.use('/integrations', integrationRoutes);
router.use('/meetings', meetingRoutes);
router.use('/content', contentRoutes);
router.use('/user', userRoutes);
router.use('/summarization', summarizationRoutes);

module.exports = router;