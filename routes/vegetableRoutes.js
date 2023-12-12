const express = require('express');
const router = express.Router();
const vegetableControllers = require('../controllers/vegetableController');

router.get('/vegetable', vegetableControllers.getVegetables);

module.exports = router;
