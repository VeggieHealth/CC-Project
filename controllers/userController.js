const User = require('../models/user');

exports.updateProfile = async (req, res) => {
    const userId = req.params.userId;
    const {
        description,
        avatar
    } = req.body;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        }

        if (description) {
            user.description = description;
        }
        if (avatar) {
            user.avatar = avatar;
        }

        await user.save();

        return res.status(200).json({
            status: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                description: user.description,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error(error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                status: false,
                message: 'Validation error: ' + error.message,
            });
        } else {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            });
        }
    }
};