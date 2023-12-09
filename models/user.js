const db = require('../config/config.js');

class User {
    static createUser(userData, callback) {
        const { username, email, password } = userData; // Ubah ke name
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [username, email, password], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result);
        });
    }

    static getUserByEmail(email, callback) {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, result[0]);
        });
    }
}

module.exports = User;
