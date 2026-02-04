const express = require('express');
const pageController = require('../controllers/pageController');

const router = express.Router();

router.get('/', pageController.renderHome);
router.get('/import', pageController.renderImport);
router.get('/records', pageController.renderRecords);
router.get('/dashboard', pageController.renderDashboard);

module.exports = router;
