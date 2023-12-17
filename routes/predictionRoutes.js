const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const {
    verifyToken
} = require('../middlewares/authMiddleware');

router.post('/prediction', verifyToken, predictionController.uploadImage);

module.exports = router;