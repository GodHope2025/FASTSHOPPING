const db = require('../config/db');

// Guardar o actualizar el carrito de un usuario
const guardarCarrito = async (userId, productos) => {
    try {
        const carritoRef = db.collection('carritos').doc(userId);
        await carritoRef.set({
            productos: productos,
            ultimaActualizacion: new Date()
        });
        return { success: true };
    } catch (error) {
        throw new Error("Error al guardar el carrito en Firebase");
    }
};

// Obtener el carrito de un usuario
const obtenerCarrito = async (userId) => {
    try {
        const doc = await db.collection('carritos').doc(userId).get();
        if (!doc.exists) return { productos: [] };
        return doc.data();
    } catch (error) {
        throw new Error("Error al obtener el carrito de Firebase");
    }
};

module.exports = { guardarCarrito, obtenerCarrito };