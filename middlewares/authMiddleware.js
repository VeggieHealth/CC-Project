const jwt = require('jsonwebtoken');
const Token = require('../models/token'); // Import model Token

exports.verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Cek apakah token terkait ada di database Token
        const storedToken = await Token.findOne({ where: { token } });
        if (!storedToken || storedToken.userId !== decoded.userId) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Token valid, lanjutkan dengan middleware berikutnya
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
