const express = require('express');
const app = express();
require('dotenv').config();
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth'); 

app.use(express.json());

app.use('/products', productRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
