const express = require('express');
const router = express.Router();
const authController = require("../controllers/user.controller");

router.post('/register', authController.signup);
router.post('/login', authController.signin);
router.post('/logout', authController.logout);

module.exports = router;