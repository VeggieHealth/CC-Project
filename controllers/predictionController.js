const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const Vegetable = require('../models/vegetable');
const upload = require('../middlewares/uploadMiddleware');

exports.uploadImage = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        status: false,
                        message: 'File size is too large. Max size is 5MB'
                    });
                } else if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({
                        status: false,
                        message: 'You can only upload one file at a time'
                    });
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({
                        status: false,
                        message: 'Uploaded an invalid file type'
                    });
                } else {
                    return res.status(400).json({
                        status: false,
                        message: 'Error uploading file'
                    });
                }
            } else if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Internal Server Error'
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    status: false,
                    message: 'No file uploaded'
                });
            }

            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid file type. Allowed types: JPG, JPEG, PNG'
                });
            }

            const fileBuffer = req.file.buffer;

            try {
                const formData = new FormData();
                formData.append('file', fileBuffer, {
                    filename: req.file.originalname
                });

                const response = await axios.post('https://flask-app-veggie-df3dj4kgla-et.a.run.app/predict', formData, {
                    headers: formData.getHeaders()
                });

                const {
                    prediction,
                    vegetableId,
                    accuracy
                } = response.data

                if (accuracy < 70) {
                    return res.status(404).json({
                        status: false,
                        message: 'Vegetable not found, Please retake the image'
                    });
                } else if (accuracy >= 70 && accuracy <= 100) {
                    const vegetableDetail = await Vegetable.findByPk(vegetableId);

                    if (!vegetableDetail) {
                        return res.status(404).json({
                            status: false,
                            message: 'Vegetable detail not found'
                        });
                    }

                    return res.status(200).json({
                        status: true,
                        message: 'Image uploaded and predicted',
                        prediction,
                        vegetableId,
                        accuracy,
                        vegetableDetail
                    });
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    status: false,
                    message: 'Error processing image'
                });
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