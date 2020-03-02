const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:INSERT THE PORT YOUR MYSQL SERVER RUNS/${process.env.DB_NAME}`,
{
    host: process.env.DB_HOST,
    dialect: 'mysql'
}
);

module.exports = sequelize;