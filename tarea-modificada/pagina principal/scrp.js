const carrito = document.getElementById('carrito');
const elementos1 = document.querySelectorAll('.producto-item a'); // Ahora seleccionamos todos los botones "Añadir al carrito"
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const totalCarrito = document.getElementById('total');
const contadorCarrito = document.getElementById('contador-carrito');

// Cargar todos los event listeners
cargarEventListeners();

function cargarEventListeners() {
    // Agregar al carrito
    if (elementos1) {
        elementos1.forEach(elemento => {
            elemento.addEventListener('click', comprarElemento);
        });
    }

    // Eliminar elemento del carrito
    if (carrito) {
        carrito.addEventListener('click', eliminarElemento);
    }

    // Vaciar carrito
    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    }

    // Mostrar carrito desde localStorage al cargar la página
    document.addEventListener('DOMContentLoaded', cargarCarritoLocalStorage);
}

// Función para agregar un elemento al carrito
function comprarElemento(e) {
    e.preventDefault();

    if (e.target.classList.contains('btn-2')) {
        const elemento = e.target.parentElement;

        // Leer los datos del elemento seleccionado
        const infoElemento = leerDatosElemento(elemento);

        // Insertar en localStorage
        guardarEnLocalStorage(infoElemento);

        // Mostrar en el carrito
        insertarCarrito(infoElemento);

        // Actualizar total y contador
        actualizarTotalCarrito();
        actualizarContadorCarrito();
    }
}

// Leer datos del elemento seleccionado
function leerDatosElemento(elemento) {
    return {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent.trim().replace('$', ''),  // Eliminar símbolo $ para trabajar con el precio
        id: elemento.querySelector('a').getAttribute('data-id')
    };
}

// Mostrar el elemento seleccionado en el carrito
function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width="100">
        </td>
        <td>${elemento.titulo}</td>
        <td>$${elemento.precio}</td>
        <td>
            <a href="#" class="borrar" data-id="${elemento.id}">X</a>
        </td>
    `;
    lista.appendChild(row);
}

// Guardar elemento en localStorage
function guardarEnLocalStorage(elemento) {
    let carrito = obtenerCarritoLocalStorage();
    carrito.push(elemento);
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Obtener el carrito desde localStorage
function obtenerCarritoLocalStorage() {
    return localStorage.getItem('carrito') ? JSON.parse(localStorage.getItem('carrito')) : [];
}

// Mostrar carrito al cargar la página
function cargarCarritoLocalStorage() {
    const carrito = obtenerCarritoLocalStorage();
    carrito.forEach(elemento => {
        insertarCarrito(elemento);
    });

    // Actualizar el total y contador
    actualizarTotalCarrito();
    actualizarContadorCarrito();
}

// Eliminar un elemento del carrito
function eliminarElemento(e) {
    e.preventDefault();

    if (e.target.classList.contains('borrar')) {
        const id = e.target.getAttribute('data-id');

        // Eliminar del DOM
        e.target.parentElement.parentElement.remove();

        // Eliminar del localStorage
        eliminarDeLocalStorage(id);

        // Actualizar total y contador
        actualizarTotalCarrito();
        actualizarContadorCarrito();
    }
}

// Eliminar un elemento del localStorage
function eliminarDeLocalStorage(id) {
    let carrito = obtenerCarritoLocalStorage();
    carrito = carrito.filter(elemento => elemento.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Vaciar el carrito completo
function vaciarCarrito() {
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }

    // Vaciar localStorage
    localStorage.removeItem('carrito');

    // Actualizar total y contador
    actualizarTotalCarrito();
    actualizarContadorCarrito();
}

// Actualizar el total del carrito
function actualizarTotalCarrito() {
    const carrito = obtenerCarritoLocalStorage();
    const total = carrito.reduce((acc, producto) => {
        const precio = parseFloat(producto.precio);  // Convertir a número para sumar
        return acc + precio;
    }, 0);

    if (totalCarrito) {
        totalCarrito.textContent = `$${total.toFixed(2)}`;  // Mostrar el total con dos decimales
    }
}

// Actualizar el contador de productos en el carrito
function actualizarContadorCarrito() {
    const carrito = obtenerCarritoLocalStorage();
    if (contadorCarrito) {
        contadorCarrito.textContent = carrito.length;
    }
}
