const carritoService = require('../services/carritoService');

const guardar = async (req, res) => {
    try {
        const { userId, productos } = req.body;
        await carritoService.guardarCarrito(userId, productos);
        res.status(200).json({ mensaje: "Carrito sincronizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtener = async (req, res) => {
    try {
        const { userId } = req.params;
        const carrito = await carritoService.obtenerCarrito(userId);
        res.status(200).json(carrito);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { guardar, obtener };