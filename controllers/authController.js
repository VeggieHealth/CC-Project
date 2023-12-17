const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/user');
const Token = require('../models/token');
const {
    verifyToken
} = require('../middlewares/authMiddleware');

exports.register = async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({
                status: false,
                message: 'invalid request argument'
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid email format'
            });
        }

        if (password.length < 8 || !/^[\x20-\x7E]*$/.test(password)) {
            return res.status(400).json({
                status: false,
                message: 'invalid password'
            });
        }

        const existingUserByEmail = await User.findOne({
            where: {
                email
            }
        });
        if (existingUserByEmail) {
            return res.status(409).json({
                status: false,
                message: 'email is already exist'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({
                userId: newUser.id,
                email: email,
            },
            process.env.SECRET_KEY, {
                expiresIn: '60d'
            }
        );
        await Token.create({
            token,
            userId: newUser.id
        });

        return res.status(200).json({
            status: true,
            message: 'register success',
            token,
            user: {
                username,
                email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
};

exports.login = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: 'invalid request argument'
            });
        }

        const user = await User.findOne({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'invalid email'
            });
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).json({
                status: false,
                message: 'invalid password'
            });
        }

        const token = jwt.sign({
                userId: user.id,
                email: user.email,
                username: user.username,
            },
            process.env.SECRET_KEY, {
                expiresIn: '60d'
            }
        );
        await Token.create({
            token,
            userId: user.id
        });
        return res.status(200).json({
            status: true,
            message: 'login success',
            token,
            user: {
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
};

exports.securedRoute = (req, res) => {
    res.status(200).json({
        message: 'This route is protected'
    });
};

exports.verifyTokenMiddleware = verifyToken;