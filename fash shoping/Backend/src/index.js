const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const carritoRoutes = require('./routes/carritoRoutes'); // Nueva ruta

const app = express();

app.use(cors());
app.use(express.json());

// Capas de rutas
app.use('/api/auth', authRoutes);
app.use('/api/carrito', carritoRoutes); // Nueva capa para el carrito

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ ¡Conexión a Firebase establecida con éxito!`);
    console.log(`🚀 Servidor FastShopping corriendo en http://localhost:${PORT}`);
});