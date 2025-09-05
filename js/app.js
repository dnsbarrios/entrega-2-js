// Datos de productos deportivos

let productos = [];

fetch("productos.json")
  .then((res) => res.json())
  .then((data) => {
    productos = data;
    renderProductos();
  })
  .catch((err) => {
    console.error("Error al cargar productos:", err);
  });

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

  Toastify({
    text: `${producto.nombre} agregado al carrito`,
    duration: 2000,
    gravity: "bottom",
    position: "right",
    style: {
      background: "#0a2647",
      color: "#fff",
    },
  }).showToast();
}

// Eliminar producto
function eliminarDelCarrito(index) {
  const producto = carrito[index];

  Swal.fire({
    title: `¿Eliminar "${producto.nombre}" del carrito?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0a2647",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.splice(index, 1);
      actualizarCarrito();

      Swal.fire({
        icon: "success",
        title: `"${producto.nombre}" eliminado del carrito.`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

// Vaciar carrito
btnVaciar.addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "info",
      title: "Carrito ya está vacío",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  Swal.fire({
    title: "¿Estás seguro?",
    text: "Vas a eliminar todos los productos del carrito.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0a2647",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, vaciar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      actualizarCarrito();
      Swal.fire("¡Carrito vaciado!", "Tu carrito ahora está vacío.", "success");
    }
  });
});
// Finalizar compra
const btnFinalizar = document.getElementById("finalizar-compra");

btnFinalizar.addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire({
      icon: "info",
      title: "El carrito está vacío",
      text: "Agrega al menos un producto para continuar",
      confirmButtonColor: "#0a2647",
    });
    return;
  }

  const total = calcularTotal();

  Swal.fire({
    title: `Total a pagar: $${total}`,
    html: `
      <label>Elegí cantidad de cuotas:</label><br>
      <select id="select-cuotas" class="swal2-select">
        <option value="1">1 cuota (sin interés)</option>
        <option value="3">3 cuotas (10% interés)</option>
        <option value="6">6 cuotas (20% interés)</option>
        <option value="12">12 cuotas (35% interés)</option>
      </select>
    `,
    confirmButtonText: "Calcular",
    showCancelButton: true,
    confirmButtonColor: "#0a2647",
  }).then((result) => {
    if (result.isConfirmed) {
      const select = document.getElementById("select-cuotas");
      const cuotas = parseInt(select.value);
      let interes = 0;

      if (cuotas === 3) interes = 0.1;
      else if (cuotas === 6) interes = 0.2;
      else if (cuotas === 12) interes = 0.35;

      const totalConInteres = total * (1 + interes);
      const valorCuota = (totalConInteres / cuotas).toFixed(2);

      Swal.fire({
        title: "Resumen de pago",
        html: `
          <p><strong>Total:</strong> $${Number(total).toFixed(2)}</p>
          <p><strong>Cuotas:</strong> ${cuotas}</p>
          <p><strong>Interés aplicado:</strong> ${interes * 100}%</p>
          <p><strong>Total con interés:</strong> $${totalConInteres.toFixed(
            2
          )}</p>
          <p><strong>Valor de cada cuota:</strong> $${valorCuota}</p>
        `,
        icon: "success",
        confirmButtonColor: "#0a2647",
      });
    }
  });
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
// -------------------------------------------
// Bienvenida con nombre
// -------------------------------------------
function pedirNombreUsuario() {
  const nombreGuardado = localStorage.getItem("nombreUsuario");

  if (!nombreGuardado) {
    Swal.fire({
      title: "¡Bienvenido a Éxodo Sport!",
      text: "¿Cuál es tu nombre?",
      input: "text",
      inputPlaceholder: "Escribe tu nombre aquí",
      confirmButtonText: "Entrar",
      confirmButtonColor: "#0a2647",
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) return "Por favor, ingresa tu nombre";
      },
    }).then((result) => {
      const nombre = result.value;
      localStorage.setItem("nombreUsuario", nombre);

      Swal.fire({
        title: `¡Hola, ${nombre}!`,
        text: "Gracias por visitar nuestra tienda 💪",
        icon: "success",
        confirmButtonColor: "#0a2647",
      });
    });
  } else {
    Swal.fire({
      title: `¡Bienvenido de nuevo, ${nombreGuardado}!`,
      text: "Nos alegra verte por aquí 💪",
      icon: "info",
      timer: 2000,
      showConfirmButton: false,
    });
  }
}

// Recargar la página
document.addEventListener("DOMContentLoaded", pedirNombreUsuario);

// Inicialización
renderProductos();
actualizarCarrito();
