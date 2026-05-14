// --- 1. INICIALIZACIÓN DEL SISTEMA ---
document.addEventListener('DOMContentLoaded', () => {
    actualizarMenuUsuario();
    activarBotonesCompra();
    if (window.location.pathname.includes('carrito.html')) {
        renderizarCarrito();
    }
});

// --- 2. GESTIÓN DE INTERFAZ Y USUARIO (CRUD: UPDATE/DELETE) ---
function actualizarMenuUsuario() {
    const nombre = localStorage.getItem('usuario_nombre');
    const contenedor = document.getElementById('user-menu-container');
    if (!contenedor) return;

    if (nombre) {
        contenedor.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 8px 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <span style="font-weight: bold; color: #1e293b;">Hola, ${nombre}</span>
                <button onclick="probarUpdate()" style="background: #fbbf24; color: white; border: none; padding: 5px 10px; border-radius: 8px; cursor: pointer; font-size: 11px;">Editar</button>
                <button onclick="eliminarMiCuenta()" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 8px; cursor: pointer; font-size: 11px;">Eliminar</button>
                <button onclick="cerrarSesion()" style="color: #64748b; background: none; border: none; cursor: pointer; font-size: 11px; text-decoration: underline;">Salir</button>
            </div>`;
    } else {
        contenedor.innerHTML = `
            <div style="display: flex; gap: 15px; align-items: center;">
                <a href="Login.html" style="text-decoration: none; color: #6366f1; font-weight: 600;">Iniciar Sesión</a>
                <a href="Registrar.html" style="text-decoration: none; color: #6366f1; font-weight: 600;">Crear Cuenta</a>
            </div>`;
    }
}

async function probarUpdate() {
    const nuevoNombre = prompt("Nuevo nombre para tu cuenta:", localStorage.getItem('usuario_nombre'));
    if (!nuevoNombre) return;
    const userId = localStorage.getItem('usuario_id');
    try {
        const res = await fetch(`https://fastshopping-backend.onrender.com/api/auth/actualizar/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nuevoNombre })
        });
        if (res.ok) {
            localStorage.setItem('usuario_nombre', nuevoNombre);
            alert("✅ Nombre actualizado en Firebase");
            location.reload();
        }
    } catch (e) { alert("Error al conectar con el servidor."); }
}

async function eliminarMiCuenta() {
    if (!confirm("¿Eliminar tu cuenta de Firebase definitivamente?")) return;
    const userId = localStorage.getItem('usuario_id');
    try {
        const res = await fetch(`https://fastshopping-backend.onrender.com/api/auth/eliminar/${userId}`, { method: 'DELETE' });
        if (res.ok) { alert("Cuenta eliminada."); cerrarSesion(); }
    } catch (e) { alert("Error al eliminar."); }
}

function cerrarSesion() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// --- 3. LÓGICA DE COMPRA Y CARRITO (CREATE/READ) ---
function activarBotonesCompra() {
    const botones = document.querySelectorAll('.btn-add');
    botones.forEach(boton => {
        boton.onclick = function() {
            const card = this.closest('.product-card');
            const nombre = card.querySelector('h4').innerText;
            const precioTexto = card.querySelector('.price').innerText;
            const precio = parseFloat(precioTexto.replace('S/ ', ''));
            const imagen = card.querySelector('img').src;
            agregarAlCarrito(nombre, precio, imagen);
        };
    });
}

function agregarAlCarrito(nombre, precio, imagen) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push({ nombre, precio, imagen });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`✅ ${nombre} añadido`);
    sincronizarConFirebase();
}

async function sincronizarConFirebase() {
    const userId = localStorage.getItem('usuario_id');
    const productos = JSON.parse(localStorage.getItem('carrito')) || [];
    if (!userId) return;
    try {
        await fetch('https://fastshopping-backend.onrender.com/api/carrito/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, productos })
        });
    } catch (e) { console.log("Error de sincronización"); }
}

// --- 4. RENDERIZADO Y PAGO ---
function renderizarCarrito() {
    const contenedor = document.getElementById('contenedor-carrito');
    const totalEtiq = document.getElementById('total-carrito');
    const productos = JSON.parse(localStorage.getItem('carrito')) || [];
    if (!contenedor || !totalEtiq) return;

    if (productos.length === 0) {
        contenedor.innerHTML = "<p style='padding:20px; text-align:center;'>El carrito está vacío.</p>";
        totalEtiq.innerText = "S/ 0.00";
        return;
    }

    let html = ""; let total = 0;
    productos.forEach((p, index) => {
        total += p.precio;
        html += `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:15px; border-bottom:1px solid #f1f5f9;">
                <img src="${p.imagen}" width="60" style="border-radius:8px;">
                <div style="flex:1; margin-left:15px;">
                    <h5 style="margin:0;">${p.nombre}</h5>
                    <span style="color:#6366f1; font-weight:bold;">S/ ${p.precio.toFixed(2)}</span>
                </div>
                <button onclick="eliminarDelCarrito(${index})" style="color:#ef4444; background:none; border:none; cursor:pointer;">Eliminar</button>
            </div>`;
    });
    contenedor.innerHTML = html;
    totalEtiq.innerText = `S/ ${total.toFixed(2)}`;
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    sincronizarConFirebase();
}

async function procesarPago() {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    const userId = localStorage.getItem('usuario_id');
    const nombre = localStorage.getItem('usuario_nombre');

    if (carritoActual.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const nroCelular = prompt("Ingresa tu número de Yape o Plin para pagar:");
    if (!nroCelular || nroCelular.length < 9) {
        alert("Número no válido.");
        return;
    }

    alert(`Procesando pago de ${nombre}...`);

    try {
        if (userId) {
            await fetch('https://fastshopping-backend.onrender.com/api/carrito/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productos: [] })
            });
        }
        localStorage.removeItem('carrito');
        alert("¡Felicidades! 🎉 Tu compra en FastShopping fue un éxito.");
        window.location.href = 'index.html';
    } catch (e) { alert("Error al procesar el pago."); }
}
