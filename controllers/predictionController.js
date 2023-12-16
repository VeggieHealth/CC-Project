const fs = require('fs');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
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
                    message: 'Invalid file uploaded'
                });
            }

            // Mengambil buffer dari file yang diunggah ke dalam memori
            const fileBuffer = req.file.buffer;

            // Handle file further as needed
            // Example: Upload the image to an external service
            try {
                // Example: Uploading image to an external service
                const formData = new FormData();
                formData.append('file', fileBuffer, {
                    filename: req.file.originalname
                });

                const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
                    headers: formData.getHeaders()
                });

                // Assuming response.data contains prediction and accuracy
                return res.status(200).json({
                    status: true,
                    message: 'Image uploaded and predicted',
                    prediction: response.data.prediction,
                    accuracy: response.data.accuracy
                });
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