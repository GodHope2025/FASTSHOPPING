// Esperamos a que el HTML cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    // Buscamos el formulario por su etiqueta <form>
    const formulario = document.querySelector('form');

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue sola

        // Capturamos los datos de los campos (ajusta los IDs si son diferentes en tu HTML)
        const nombre = document.querySelector('input[type="text"]').value;
        const email = document.querySelector('input[type="email"]').value;
        const password = document.querySelector('input[type="password"]').value;

        // Creamos el objeto con los datos
        const datosUsuario = { nombre, email, password };

        try {
            // Enviamos los datos a la ruta que creamos en el backend
            const respuesta = await fetch('http://localhost:3000/api/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosUsuario)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert("✅ ¡Registro exitoso en Firebase!");
                window.location.href = 'Login.html'; // Nos manda al login si todo sale bien
            } else {
                alert("❌ Error: " + resultado.error);
            }

        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar con el servidor. ¿Olvidaste encender el backend?");
        }
    });
});