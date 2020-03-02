const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Prefectures = sequelize.define('prefectures', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    prefecture: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false
    }
},
    {timestamps: false}
);

module.exports = Prefectures;