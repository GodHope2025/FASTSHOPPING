const authService = require('../services/authService');

const registrar = async (req, res) => {
    try {
        const { nombre, email, password, telefono } = req.body;
        if (!nombre || !email || !password || !telefono) {
            return res.status(400).json({ error: "Faltan campos (Nombre, Email, Pass, Tel)" });
        }
        const usuario = await authService.registrarUsuario({ nombre, email, password, telefono });
        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await authService.loginUsuario(email, password);
        res.status(200).json({ mensaje: "Login exitoso", usuario });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;
        res.status(200).json({ mensaje: "Usuario actualizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        res.status(200).json({ mensaje: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// IMPORTANTE: Exportar todas las funciones que definiste arriba
module.exports = { registrar, login, actualizar, eliminar };