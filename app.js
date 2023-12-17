const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const vegetableRoutes = require('./routes/vegetableRoutes');
const userRoutes = require('./routes/userRoutes');
const predictionRoutes = require('./routes/predictionRoutes')

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', vegetableRoutes);
app.use('/api', predictionRoutes);

sequelize
    .sync()
    .then(() => {
        console.log('Database connected!');

        app.listen(8080, () => {
            console.log('Server is running on port 8080');
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });