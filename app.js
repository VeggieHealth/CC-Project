const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/config'); // Import konfigurasi Sequelize dari file config.js
const authRoutes = require('./routes/authRoutes');
const vegetableRoutes = require('./routes/vegetableRoutes');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rute
app.use('/api', authRoutes);
app.use('/api', vegetableRoutes);

// Inisialisasi koneksi ke database
sequelize
    .sync()
    .then(() => {
        console.log('Database connected!');
        // Mulai server
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
