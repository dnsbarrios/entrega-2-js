// Datos de productos deportivos

const productos = [
  {
    id: 1,
    nombre: "Camiseta Éxodo",
    precio: 25,
    imagen: "../img/camiseta.jpg",
    categoria: "Ropa",
  },
  {
    id: 2,
    nombre: "Zapatillas Running",
    precio: 80,
    imagen: "../img/championes.jpg",
    categoria: "Calzado",
  },
  {
    id: 3,
    nombre: "Pelota de Fútbol",
    precio: 30,
    imagen: "../img/pelota.jpg",
    categoria: "Accesorios",
  },
  {
    id: 4,
    nombre: "Guantes de Arquero",
    precio: 20,
    imagen: "../img/guantes.jpg",
    categoria: "Accesorios",
  },
  {
    id: 5,
    nombre: "Pantalón Deportivo",
    precio: 35,
    imagen: "../img/pantalon.webp",
    categoria: "Ropa",
  },
];

// Variables

const contenedorProductos = document.getElementById("productos-container");
const contenedorCarrito = document.getElementById("carrito-container");
const totalPrecio = document.getElementById("total-precio");
const btnVaciar = document.getElementById("vaciar-carrito");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Funciones

// Mostrar productos
function renderProductos() {
  productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("card-producto");
    div.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio}</p>
      <button onclick="agregarAlCarrito(${producto.id})">Agregar</button>
    `;
    contenedorProductos.appendChild(div);
  });
}

// Agregar al carrito
function agregarAlCarrito(id) {
  const producto = productos.find((prod) => prod.id === id);
  carrito.push(producto);
  actualizarCarrito();
}

// Eliminar producto
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Vaciar carrito
btnVaciar.addEventListener("click", () => {
  carrito = [];
  actualizarCarrito();
});

// Calcular total con IVA
function calcularTotal() {
  const subtotal = carrito.reduce((acc, item) => acc + item.precio, 0);
  const iva = subtotal * 0.22;
  return (subtotal + iva).toFixed(2);
}

// Mostrar carrito
function renderCarrito() {
  contenedorCarrito.innerHTML = "";
  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");
    div.innerHTML = `
      <span>${item.nombre} - $${item.precio}</span>
      <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
    `;
    contenedorCarrito.appendChild(div);
  });

  totalPrecio.textContent = `$${calcularTotal()}`;
}

// Actualizar carrito (DOM y localStorage)
function actualizarCarrito() {
  renderCarrito();
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Inicialización
renderProductos();
actualizarCarrito();
