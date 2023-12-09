require('dotenv').config({ path: './.env' });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.register = (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ status: false, message: 'invalid request argument' });
    }

    if (password.length < 8 || !/^[\x20-\x7E]*$/.test(password)) {
        return res.status(400).json({ status: false, message: 'invalid password' });
    }

    User.getUserByEmail(email, (err, existingUserByEmail) => {
        if (err) {
            return res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
        if (existingUserByEmail) {
            return res.status(409).json({ status: false, message: 'email is already exist' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ status: false, message: 'Internal Server Error' });
            }
            User.createUser({ username, email, password: hashedPassword }, (err, result) => {
                if (err) {
                    return res.status(500).json({ status: false, message: 'Internal Server Error' });
                }

                const token = jwt.sign(
                    {
                        userId: result.insertId,
                        email: email,
                    },
                    process.env.SECRET_KEY,
                    { expiresIn: '1h' }
                );

                return res.status(200).json({
                    status: true,
                    message: 'register success',
                    token,
                    user: {
                        username,
                        email,
                    },
                });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: false, message: 'invalid request argument' });
    }

    User.getUserByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(401).json({ status: false, message: 'invalid email' });
        }

        bcrypt.compare(password, user.password, (error, result) => {
            if (error) {
                return res.status(500).json({ status: false, message: 'Internal Server Error' });
            }
            if (!result) {
                return res.status(401).json({ status: false, message: 'invalid password' });
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );
            return res.status(200).json({
                status: true,
                message: 'login success',
                token,
                user: {
                    username: user.username,
                    email: user.email,
                },
            });
        });
    });
};
