const User = require('../models/user');

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findByPk(userId, {
            attributes: ['username', 'email']
        });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: true,
            message: 'User profile retrieved successfully',
            userProfile: {
                userProfile: user.username,
                emailProfile: user.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
};