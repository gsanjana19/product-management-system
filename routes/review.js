const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const { product_id, comment } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO reviews (user_id, product_id, comment) VALUES ($1, $2, $3) RETURNING *',
      [user_id, product_id, comment]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:product_id', async (req, res) => {
  const { product_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM reviews WHERE product_id = $1',
      [product_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
