const Sequelize = require('sequelize');

const sequelize = require('../util/database');


const Categories = sequelize.define('categories', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    category: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false
    }
},
    {timestamps: false}
);

module.exports = Categories;