const express = require('express');
const router = express.Router();
const {
    updateProfile
} = require('../controllers/updateUserController');
const {
    getUserProfile
} = require('../controllers/userController');
const {
    verifyToken
} = require('../middlewares/authMiddleware');

// Route to get user profile
router.put('/profile/update/:userId', verifyToken, updateProfile);
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;