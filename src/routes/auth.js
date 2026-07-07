const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { Usuario } = require('../models');

// POST /api/auth/registro
router.post('/registro', async (req, res) => {
  try {
    const { nomeCompleto, email, senha } = req.body;

    if (!nomeCompleto || !email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatorios: nomeCompleto, email, senha' });
    }

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ error: 'E-mail ja cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ nomeCompleto, email, senha: hash });

    // Retorna sem a senha
    const { senha: _, ...dados } = usuario.toJSON();
    res.status(201).json(dados);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha sao obrigatorios' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais invalidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais invalidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET || 'cantina_secret',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nomeCompleto: usuario.nomeCompleto,
        email: usuario.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;