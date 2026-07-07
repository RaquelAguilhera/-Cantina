const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Conta = sequelize.define('Conta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  saldo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  }
});

module.exports = Conta;