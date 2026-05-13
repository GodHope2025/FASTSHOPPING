// Leemos el carrito de la memoria o creamos uno nuevo
let carrito = JSON.parse(localStorage.getItem('fastshopping_cart')) || [];

// Cuando la página carga, inicializamos todo
document.addEventListener('DOMContentLoaded', () => {
    // 1. Actualizamos la barra de navegación superior
    actualizarNavbar();
    
    // 2. Activamos todos los botones de "Añadir al Carrito"
    const botonesAñadir = document.querySelectorAll('.btn-add');
    botonesAñadir.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });

    // 3. Si estamos en la página del carrito, renderizamos los productos
    if (document.getElementById('contenedor-carrito')) {
        renderizarCarrito();
    }
});

// --- FUNCIÓN PARA AÑADIR PRODUCTOS ---
function agregarAlCarrito(event) {
    const sesion = localStorage.getItem('fastshopping_sesion');
    
    // BLOQUEO CON ALERTA ROJA: Si no hay sesión, manda a registrarse
    if (sesion !== 'activa') {
        mostrarNotificacion("Debes registrarte para comprar", "error");
        setTimeout(() => {
            window.location.href = 'registrar.html';
        }, 1800);
        return;
    }

    const tarjeta = event.target.closest('.product-card');
    const titulo = tarjeta.querySelector('h4').innerText;
    const precio = parseFloat(tarjeta.querySelector('.price').innerText.replace('S/ ', ''));
    const imagen = tarjeta.querySelector('img').src;

    carrito.push({ titulo, precio, imagen });
    localStorage.setItem('fastshopping_cart', JSON.stringify(carrito));
    
    mostrarNotificacion(`Añadido: ${titulo}`, "exito");
}

// --- FUNCIÓN PARA ACTUALIZAR LA BARRA SUPERIOR ---
function actualizarNavbar() {
    const container = document.getElementById('user-menu-container');
    if (!container) return;

    const sesion = localStorage.getItem('fastshopping_sesion');
    const nombre = localStorage.getItem('usuario_nombre') || 'Invitado';

    if (sesion === 'activa') {
        // SI ESTÁ LOGUEADO: Muestra Nombre y botón Salir
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; border-left: 2px solid #e2e8f0; padding-left: 20px;">
                <div style="display: flex; flex-direction: column; align-items: flex-end;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 800; text-transform: uppercase;">Cuenta Activa</span>
                    <span style="font-weight: 800; color: #6366f1; font-size: 15px;">👤 ${nombre}</span>
                </div>
                <button onclick="cerrarSesion()" style="background: #fee2e2; color: #ef4444; padding: 8px 16px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; transition: 0.3s;">Salir</button>
            </div>
        `;
    } else {
        // SI NO ESTÁ LOGUEADO: Muestra Iniciar Sesión y Registrarse
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; border-left: 2px solid #e2e8f0; padding-left: 20px;">
                <a href="login.html" style="background: white; border: 2px solid #6366f1; color: #6366f1; padding: 6px 16px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 14px;">Iniciar Sesión</a>
                <a href="registrar.html" style="background: #6366f1; color: white; padding: 8px 16px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 14px;">Registrarse</a>
            </div>
        `;
    }
}

// --- FUNCIÓN PARA CERRAR SESIÓN ---
// Usamos window. para asegurar que el HTML lo encuentre
window.cerrarSesion = function() {
    localStorage.removeItem('fastshopping_sesion');
    localStorage.removeItem('usuario_nombre');
    window.location.href = 'index.html';
}

// --- FUNCIÓN DE NOTIFICACIONES ELEGANTES ---
function mostrarNotificacion(mensaje, tipo = "exito") {
    const vieja = document.querySelector('.modern-toast');
    if (vieja) vieja.remove();

    const toast = document.createElement('div');
    toast.className = 'modern-toast';
    
    let icono = '✨';
    let bg = 'rgba(30, 41, 59, 0.95)';
    if(tipo === 'error') {
        icono = '🗑️'; 
        bg = 'rgba(220, 38, 38, 0.95)';
    }

    toast.style.background = bg;
    toast.innerHTML = `<span style="font-size: 18px;">${icono}</span> <span>${mensaje}</span>`;
    
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2000);
}

// --- FUNCIONES DEL CARRITO ---
function renderizarCarrito() {
    const contenedor = document.getElementById('contenedor-carrito');
    const totalElemento = document.getElementById('total-carrito');
    if (!contenedor) return;

    contenedor.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; color:#1e293b; font-weight:bold;">Tu carrito está vacío.</p>';
        if (totalElemento) totalElemento.innerText = 'S/ 0.00';
        return;
    }

    carrito.forEach((producto, index) => {
        total += producto.precio;
        contenedor.innerHTML += `
            <div class="cart-item" style="display:flex; align-items:center; background:rgba(255,255,255,0.9); padding:15px; border-radius:15px; margin-bottom:15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
                <img src="${producto.imagen}" alt="${producto.titulo}" style="width:80px; height:80px; object-fit:contain; border-radius:12px; background:white; padding:5px;">
                <div style="flex:1; margin-left:20px; text-align:left;">
                    <h4 style="margin:0 0 5px 0; color:#1e293b;">${producto.titulo}</h4>
                    <p style="margin:0; font-weight:bold; color:#6366f1;">S/ ${producto.precio.toFixed(2)}</p>
                </div>
                <button onclick="eliminarDelCarrito(${index})" style="background:#ef4444; color:white; border:none; padding:8px 15px; border-radius:10px; cursor:pointer; font-weight:bold;">Quitar</button>
            </div>
        `;
    });
    if (totalElemento) totalElemento.innerText = `S/ ${total.toFixed(2)}`;
}

// --- FUNCIÓN PARA QUITAR PRODUCTOS DEL CARRITO ---
// Usamos window. para que el botón "Quitar" del HTML lo detecte sin problemas
window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1);
    localStorage.setItem('fastshopping_cart', JSON.stringify(carrito));
    renderizarCarrito();
    mostrarNotificacion("Producto eliminado", "error"); 
}

// --- FUNCIÓN PARA PROCESAR PAGO ---
window.procesarPago = function() {
    if (carrito.length === 0) {
        mostrarNotificacion("Tu carrito está vacío", "error");
        return;
    }
    mostrarNotificacion("¡Pago procesado con Yape/Plin!", "exito");
    carrito = [];
    localStorage.setItem('fastshopping_cart', JSON.stringify(carrito));
    renderizarCarrito();
}