const express = require('express');
const router  = express.Router();
const { Cliente } = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try { res.json(await Cliente.findAll()); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Cliente.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Cliente nao encontrado' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { matricula, nome, email } = req.body;
    if (!matricula || !nome || !email) {
      return res.status(400).json({ error: 'Matricula, nome e email sao obrigatorios' });
    }
    res.status(201).json(await Cliente.create({ matricula, nome, email }));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Cliente.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Cliente nao encontrado' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Cliente.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Cliente nao encontrado' });
    await item.destroy();
    res.json({ message: 'Cliente removido com sucesso' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;