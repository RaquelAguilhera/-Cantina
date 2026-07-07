require('dotenv').config();
const express = require('express');
const sequelize = require('./src/database');
require('./src/models'); // Carrega modelos e associacoes

const app = express();
app.use(express.json());

// Rotas
app.use('/api/auth',        require('./src/routes/auth'));
app.use('/api/categorias',  require('./src/routes/categorias'));
app.use('/api/fornecedores',require('./src/routes/fornecedores'));
app.use('/api/produtos',    require('./src/routes/produtos'));
app.use('/api/clientes',    require('./src/routes/clientes'));
app.use('/api/contas',      require('./src/routes/contas'));
app.use('/api/vendas',      require('./src/routes/vendas'));

// Tratamento de erros global
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log('Banco de dados sincronizado!');
    console.log('Servidor rodando na porta ' + PORT);
  });
}).catch(err => console.error('Erro ao sincronizar BD:', err));

module.exports = app;