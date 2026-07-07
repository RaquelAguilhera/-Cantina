const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matricula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Cliente;