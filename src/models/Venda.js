const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Venda = sequelize.define('Venda', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dataHora: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  }
});

module.exports = Venda;