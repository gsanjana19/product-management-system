const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  console.log('POST /products body:', req.body);
  const { name, price, description } = req.body;
  const user_id = parseInt(req.body.user_id, 10);
  try {
    const newProduct = await pool.query(
      'INSERT INTO products (name, price, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, description, user_id]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/test-log', (req, res) => {
  console.log('GET /products/test-log route triggered!');
  res.send('Route works!');
});

router.get('/', async (req, res) => {
  try {
    const allProducts = await pool.query('SELECT * FROM products');
    res.json(allProducts.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/count-by-user', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT users.id, users.username, COUNT(products.id) AS product_count
      FROM users
      LEFT JOIN products ON users.id = products.user_id
      GROUP BY users.id, users.username
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (product.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(product.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  try {
    const updated = await pool.query(
      'UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *',
      [name, price, description, id]
    );
    if (updated.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (deleted.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/count-by-user', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT users.id, users.username, COUNT(products.id) AS product_count
      FROM users
      LEFT JOIN products ON users.id = products.user_id
      GROUP BY users.id, users.username
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE user_id = $1',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;



