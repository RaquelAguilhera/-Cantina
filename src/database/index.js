const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './cantina.db', // arquivo local, criado automaticamente
  logging: false
});

module.exports = sequelize;