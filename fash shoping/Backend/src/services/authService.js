const db = require('../config/db');

class AuthService {
    async registrarUsuario(userData) {
        try {
            const { nombre, email, password, telefono } = userData;
            const userRef = db.collection('usuarios').doc();
            
            // Creamos el JSON completo incluyendo el teléfono solicitado por el profesor
            const nuevoUsuario = {
                id: userRef.id,
                nombre: nombre,
                email: email,
                password: password, 
                telefono: telefono, 
                fechaCreacion: new Date().toISOString()
            };

            await userRef.set(nuevoUsuario);
            return nuevoUsuario;
        } catch (error) {
            throw new Error("Error en Firebase Service: " + error.message);
        }
    }

    async loginUsuario(email, password) {
        try {
            const snapshot = await db.collection('usuarios')
                .where('email', '==', email)
                .where('password', '==', password)
                .get();

            if (snapshot.empty) {
                throw new Error("Credenciales incorrectas");
            }

            return snapshot.docs[0].data();
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new AuthService();