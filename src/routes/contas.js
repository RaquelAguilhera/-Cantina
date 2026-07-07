const express = require('express');
const router  = express.Router();
const { Conta, Cliente } = require('../models');
const auth = require('../middleware/auth');

const include = [{ model: Cliente, as: 'cliente' }];

router.get('/', auth, async (req, res) => {
  try { res.json(await Conta.findAll({ include })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Conta.findByPk(req.params.id, { include });
    if (!item) return res.status(404).json({ error: 'Conta nao encontrada' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { codigo, clienteId } = req.body;
    if (!codigo || !clienteId) {
      return res.status(400).json({ error: 'Codigo e clienteId sao obrigatorios' });
    }
    const conta = await Conta.create({ codigo, clienteId, saldo: 0 });
    res.status(201).json(await Conta.findByPk(conta.id, { include }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Conta.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Conta nao encontrada' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Conta.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Conta nao encontrada' });
    await item.destroy();
    res.json({ message: 'Conta removida com sucesso' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/contas/:id/deposito
router.post('/:id/deposito', auth, async (req, res) => {
  try {
    const { valor } = req.body;

    if (!valor || valor <= 0) {
      return res.status(400).json({ error: 'Valor do deposito deve ser positivo' });
    }

    const conta = await Conta.findByPk(req.params.id, { include });
    if (!conta) return res.status(404).json({ error: 'Conta nao encontrada' });

    const novoSaldo = parseFloat(conta.saldo) + parseFloat(valor);
    await conta.update({ saldo: novoSaldo });

    res.json({
      message: 'Deposito realizado com sucesso',
      saldoAnterior: parseFloat(conta.saldo),
      valorDepositado: parseFloat(valor),
      novoSaldo,
      conta
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;