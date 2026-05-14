const admin = require('firebase-admin');
// Referenciamos el archivo JSON que moviste a la raíz del backend
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

try {
    admin.initializeApp({
       credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ ¡Conexión a Firebase establecida con éxito!");
} catch (error) {
    console.error("❌ Error de conexión a Firebase:", error);
}

const db = admin.firestore();
module.exports = db;
