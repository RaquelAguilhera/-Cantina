const express  = require('express');
const router   = express.Router();
const { Venda, ItemVenda, Produto, Cliente, Conta } = require('../models');
const sequelize = require('../database');
const auth = require('../middleware/auth');

const include = [
  { model: Cliente,  as: 'cliente' },
  { model: ItemVenda, as: 'itens',
    include: [{ model: Produto, as: 'produto' }] }
];

// GET /api/vendas
router.get('/', auth, async (req, res) => {
  try { res.json(await Venda.findAll({ include })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/vendas/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const venda = await Venda.findByPk(req.params.id, { include });
    if (!venda) return res.status(404).json({ error: 'Venda nao encontrada' });
    res.json(venda);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/vendas
// Body: { clienteId: 1, itens: [{ produtoId: 1, quantidade: 2 }] }
router.post('/', auth, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { clienteId, itens } = req.body;

    // ======================== RN1 ========================
    // A venda deve ter pelo menos um item
    if (!itens || itens.length === 0) {
      await t.rollback();
      return res.status(400).json({
        error: 'RN1: A venda deve ter pelo menos um item de venda'
      });
    }

    // Verificar se o cliente existe
    const cliente = await Cliente.findByPk(clienteId, { transaction: t });
    if (!cliente) {
      await t.rollback();
      return res.status(404).json({ error: 'Cliente nao encontrado' });
    }

    // Verificar se o cliente tem conta
    const conta = await Conta.findOne({ where: { clienteId }, transaction: t });
    if (!conta) {
      await t.rollback();
      return res.status(404).json({ error: 'Conta do cliente nao encontrada' });
    }

    // Processar cada item: calcular total e checar estoque
    let total = 0;
    const processados = [];

    for (const item of itens) {
      const produto = await Produto.findByPk(item.produtoId, { transaction: t });

      if (!produto) {
        await t.rollback();
        return res.status(404).json({
          error: 'Produto ' + item.produtoId + ' nao encontrado'
        });
      }

      if (produto.estoque < item.quantidade) {
        await t.rollback();
        return res.status(400).json({
          error: 'Estoque insuficiente para: ' + produto.nome,
          estoqueDisponivel: produto.estoque,
          quantidadeSolicitada: item.quantidade
        });
      }

      // RN1: subtotal = preco * quantidade
      const subtotal = parseFloat(produto.preco) * item.quantidade;
      total += subtotal;
      processados.push({ produto, quantidade: item.quantidade, subtotal });
    }

    // ======================== RN3 ========================
    // Verificar se o cliente tem saldo suficiente
    if (parseFloat(conta.saldo) < total) {
      await t.rollback();
      return res.status(400).json({
        error: 'RN3: Saldo insuficiente para realizar a venda',
        saldoAtual: parseFloat(conta.saldo),
        totalVenda: total,
        diferenca: total - parseFloat(conta.saldo)
      });
    }

    // Criar o registro de venda
    const venda = await Venda.create({
      clienteId,
      dataHora: new Date(),
      total
    }, { transaction: t });

    for (const item of processados) {
      // Criar item de venda
      await ItemVenda.create({
        vendaId:    venda.id,
        produtoId:  item.produto.id,
        quantidade: item.quantidade,
        subtotal:   item.subtotal
      }, { transaction: t });

      // ======================== RN2 ========================
      // Descontar a quantidade vendida do estoque do produto
      await item.produto.update({
        estoque: item.produto.estoque - item.quantidade
      }, { transaction: t });
    }

    // ======================== RN3 ========================
    // Descontar o total do saldo da conta do cliente
    await conta.update({
      saldo: parseFloat(conta.saldo) - total
    }, { transaction: t });

    await t.commit();

    // Retornar a venda completa
    const resultado = await Venda.findByPk(venda.id, { include });
    res.status(201).json(resultado);

  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;