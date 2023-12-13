const sequelize = require('../config/config.js');
const {
    DataTypes
} = require('sequelize');


const Vegetable = sequelize.define('Vegetable', {
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    carbs: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
    },
    vitamins: {
        type: DataTypes.STRING,
        allowNull: false
    },
    calories: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
    },
    protein: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false
    },
    benefits: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'vegetables',
    timestamps: false,
});

module.exports = Vegetable;