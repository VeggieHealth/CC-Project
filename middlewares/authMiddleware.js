const jwt = require('jsonwebtoken');
const Token = require('../models/token');

exports.verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(403).json({
            message: 'Token is required or invalid format'
        });
    }

    const tokenString = token.split(' ')[1];

    try {
        const decoded = jwt.verify(tokenString, process.env.SECRET_KEY);

        const storedToken = await Token.findOne({
            where: {
                token: tokenString
            }
        });

        if (!storedToken || storedToken.userId !== decoded.userId) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};