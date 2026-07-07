const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ItemVenda = sequelize.define('ItemVenda', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

module.exports = ItemVenda;