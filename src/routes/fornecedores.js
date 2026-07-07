const express = require('express');
const router  = express.Router();
const { Fornecedor } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await Fornecedor.findAll()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Fornecedor.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Fornecedor nao encontrado' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { cnpj, nome, telefone } = req.body;
    if (!cnpj || !nome) {
      return res.status(400).json({ error: 'CNPJ e nome sao obrigatorios' });
    }
    res.status(201).json(await Fornecedor.create({ cnpj, nome, telefone }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Fornecedor.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Fornecedor nao encontrado' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Fornecedor.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Fornecedor nao encontrado' });
    await item.destroy();
    res.json({ message: 'Fornecedor removido com sucesso' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;