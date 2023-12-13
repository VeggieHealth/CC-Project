const express = require('express');
const router = express.Router();
const vegetableControllers = require('../controllers/vegetableController');
const {
    verifyToken
} = require('../middlewares/authMiddleware');

router.get('/vegetable', verifyToken, vegetableControllers.getVegetables);

router.get('/vegetable/:vegetableId', verifyToken, vegetableControllers.getVegetableById);

module.exports = router;