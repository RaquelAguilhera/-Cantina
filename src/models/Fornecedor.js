const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Fornecedor = sequelize.define('Fornecedor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cnpj: {
    type: DataTypes.STRING(18),
    allowNull: false,
    unique: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING
  }
});

module.exports = Fornecedor;