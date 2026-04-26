const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const isAdmin = require('../middleware/admin');

// CRUD de produtos (ADMIN)
router.post('/products', isAdmin, adminController.createProduct);
router.get('/products', isAdmin, adminController.getProducts);
router.put('/products/:id', isAdmin, adminController.updateProduct);
router.delete('/products/:id', isAdmin, adminController.deleteProduct);

module.exports = router;

router.get('/', (req, res) => {
  res.json({ message: 'Rota admin funcionando 🚀' });
});