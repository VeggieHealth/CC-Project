const {
    Storage
} = require('@google-cloud/storage');
const User = require('../models/user');
const upload = require('../middlewares/uploadMiddleware');

const storage = new Storage({
    keyFilename: './veggie-health-004475331d6f.json',
    projectId: 'veggie-health',
});

exports.updateProfile = async (req, res) => {
    const userId = req.params.userId;
    const {
        description,
        username
    } = req.body;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found',
            });
        }

        if (description !== undefined && description !== null) {
            user.description = description;
        }

        if (username !== undefined && username !== null) {
            user.username = username;
        }

        await user.save();

        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: err.message,
                });
            }

            if (req.file) {
                const bucketName = 'userveggie-data';
                const fileName = `avatars/${userId}-${req.file.originalname}`;
                const file = req.file.buffer;

                try {
                    await storage.bucket(bucketName).file(fileName).save(file);

                    const avatarURL = `https://storage.googleapis.com/${bucketName}/${fileName}`;

                    user.avatar = avatarURL;

                    // Simpan perubahan avatar ke dalam database
                    await user.save();
                } catch (error) {
                    console.error(error);
                    return res.status(500).json({
                        status: false,
                        message: 'Error uploading profile picture to Cloud Storage',
                    });
                }
            }

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