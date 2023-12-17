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

            const fileBuffer = req.file.buffer;

            try {
                const formData = new FormData();
                formData.append('file', fileBuffer, {
                    filename: req.file.originalname
                });

                const response = await axios.post('https://flask-app-veggie-df3dj4kgla-et.a.run.app/predict', formData, {
                    headers: formData.getHeaders()
                });

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