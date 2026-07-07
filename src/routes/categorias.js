const express = require('express');
const router  = express.Router();
const { Categoria } = require('../models');
const auth = require('../middleware/auth');

// GET /api/categorias
router.get('/', auth, async (req, res) => {
  try {
    res.json(await Categoria.findAll());
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/categorias/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Categoria.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Categoria nao encontrada' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/categorias
router.post('/', auth, async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome e obrigatorio' });
    res.status(201).json(await Categoria.create({ nome, descricao }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/categorias/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Categoria.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Categoria nao encontrada' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/categorias/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Categoria.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Categoria nao encontrada' });
    await item.destroy();
    res.json({ message: 'Categoria removida com sucesso' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;