const express = require('express');
const app = express();

app.use(express.json());

// rota teste
app.get('/', (req, res) => {
  res.json({ message: 'API rodando 🚀' });
});

module.exports = app;