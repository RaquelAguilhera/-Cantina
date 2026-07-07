const Categoria  = require('./Categoria');
const Fornecedor = require('./Fornecedor');
const Produto    = require('./Produto');
const Cliente    = require('./Cliente');
const Conta      = require('./Conta');
const Venda      = require('./Venda');
const ItemVenda  = require('./ItemVenda');
const Usuario    = require('./Usuario');

// Produto -> Categoria e Fornecedor
Produto.belongsTo(Categoria,  { foreignKey: 'categoriaId',  as: 'categoria'  });
Categoria.hasMany(Produto,    { foreignKey: 'categoriaId'  });

Produto.belongsTo(Fornecedor, { foreignKey: 'fornecedorId', as: 'fornecedor' });
Fornecedor.hasMany(Produto,   { foreignKey: 'fornecedorId' });

// Conta -> Cliente (1:1)
Conta.belongsTo(Cliente,  { foreignKey: 'clienteId', as: 'cliente' });
Cliente.hasOne(Conta,     { foreignKey: 'clienteId' });

// Venda -> Cliente (N:1)
Venda.belongsTo(Cliente,  { foreignKey: 'clienteId', as: 'cliente' });
Cliente.hasMany(Venda,    { foreignKey: 'clienteId' });

// Venda -> ItemVenda (1:N)
Venda.hasMany(ItemVenda,     { foreignKey: 'vendaId', as: 'itens' });
ItemVenda.belongsTo(Venda,   { foreignKey: 'vendaId' });

// ItemVenda -> Produto (N:1)
ItemVenda.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' });
Produto.hasMany(ItemVenda,   { foreignKey: 'produtoId' });

module.exports = {
  Categoria, Fornecedor, Produto,
  Cliente, Conta, Venda, ItemVenda, Usuario
};