const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

router.post('/guardar', carritoController.guardar);
router.get('/obtener/:userId', carritoController.obtener);

module.exports = router;