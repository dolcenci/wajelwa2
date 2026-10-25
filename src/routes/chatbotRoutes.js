const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Public — no auth required so guests can also chat
router.post('/message', chatbotController.sendMessage);

module.exports = router;