const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

// Estas son las rutas que suelen dar error si el controlador no tiene las funciones
if (authController.actualizar) {
    router.put('/actualizar/:id', authController.actualizar);
}
if (authController.eliminar) {
    router.delete('/eliminar/:id', authController.eliminar);
}

module.exports = router;