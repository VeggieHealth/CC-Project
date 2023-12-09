const express = require('express');
const router = express.Router();
const vegetableControllers = require('../controllers/vegetableControllers');

router.get('/vegetable', vegetableControllers.getVegetables);

module.exports = router;
