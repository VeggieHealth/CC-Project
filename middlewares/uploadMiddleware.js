const multer = require('multer');

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('File format not supported. Please upload a JPEG or PNG image.'), false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(), // Menggunakan memory storage
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Batasi ukuran file menjadi 5MB
    }
}).single('file'); // Handle upload satu file

module.exports = upload;