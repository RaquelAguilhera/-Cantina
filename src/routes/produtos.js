const express = require('express');
const router  = express.Router();
const { Produto, Categoria, Fornecedor } = require('../models');
const auth = require('../middleware/auth');

const include = [
  { model: Categoria,  as: 'categoria'  },
  { model: Fornecedor, as: 'fornecedor' }
];

router.get('/', auth, async (req, res) => {
  try { res.json(await Produto.findAll({ include })); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Produto.findByPk(req.params.id, { include });
    if (!item) return res.status(404).json({ error: 'Produto nao encontrado' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { nome, categoriaId, fornecedorId, preco, estoque } = req.body;
    if (!nome || !categoriaId || !preco) {
      return res.status(400).json({ error: 'Nome, categoriaId e preco sao obrigatorios' });
    }
    const produto = await Produto.create({
      nome, categoriaId, fornecedorId, preco, estoque: estoque || 0
    });
    res.status(201).json(await Produto.findByPk(produto.id, { include }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Produto.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Produto nao encontrado' });
    await item.update(req.body);
    res.json(await Produto.findByPk(item.id, { include }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Produto.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Produto nao encontrado' });
    await item.destroy();
    res.json({ message: 'Produto removido com sucesso' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;