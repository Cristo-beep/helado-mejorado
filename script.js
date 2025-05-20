// Datos de productos
const productos = [
  { 
    id: 1,
    nombre: "Fresa con Moras",
    precio: 55, 
    imagen: "https://i.imgur.com/erd9BAm.jpeg", 
    descripcion: "Un helado suave y cremoso hecho con fresas frescas y moras silvestres, libre de azúcar añadida y endulzado naturalmente.",
    categoria: "diabetes",
    beneficios: ["Antioxidantes", "Bajo índice glucémico"]
  },
  { 
    id: 2, 
    nombre: "Betabel con Naranja y Zanahoria", 
    precio: 60, 
    imagen: "https://i.imgur.com/eJHUjsM.jpeg", 
    descripcion: "Una mezcla vibrante de betabel, naranja y zanahoria, con sabor naturalmente dulce.",
    categoria: "oncologia",
    beneficios: ["Alivia náuseas", "Vitamina C"]
  }
];

// Función para renderizar productos
function renderProductos(categoria = 'todos') {
  const gridProductos = document.getElementById("gridProductos");
  gridProductos.innerHTML = "";

  const productosFiltrados = categoria === 'todos' 
    ? productos 
    : productos.filter(p => p.categoria === categoria);

  productosFiltrados.forEach((p, index) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.setAttribute('data-animation', 'fade-up');
    div.classList.add("animate"); // ← ¡Esta línea soluciona el problema!
    div.style.transitionDelay = `${index * 0.1}s`;
    div.innerHTML = `
      <div class="producto-img-container">
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
      </div>
      <h3>${p.nombre}</h3>
      <p>$${p.precio}</p>
      <div class="beneficios">
        ${p.beneficios.map(b => `<span class="beneficio">${b}</span>`).join('')}
      </div>
      <p class="descripcion">${p.descripcion}</p>
      <button onclick="agregarAlCarrito(${p.id})">
        <i class="fas fa-cart-plus"></i> Agregar
      </button>
    `;
    gridProductos.appendChild(div);
  });
}

// Carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  const productoEnCarrito = carrito.find(item => item.id === id);
  
  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
  mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

function actualizarCarrito() {
  const listaCarrito = document.getElementById("listaCarrito");
  const cantidadCarrito = document.getElementById("cantidadCarrito");
  const totalCarrito = document.getElementById("totalCarrito");

  listaCarrito.innerHTML = "";
  let total = 0;

  carrito.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="item-carrito">
        <span>${item.nombre} - $${item.precio} x ${item.cantidad}</span>
        <button onclick="eliminarDelCarrito(${i})" class="eliminar-item">×</button>
      </div>
    `;
    listaCarrito.appendChild(li);
    total += item.precio * item.cantidad;
  });

  cantidadCarrito.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
  if (carrito[index].cantidad > 1) {
    carrito[index].cantidad -= 1;
  } else {
    carrito.splice(index, 1);
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
  mostrarNotificacion("Producto eliminado del carrito");
}

function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement("div");
  notificacion.className = "notificacion";
  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);

  setTimeout(() => notificacion.classList.add("mostrar"), 10);
  setTimeout(() => {
    notificacion.classList.remove("mostrar");
    setTimeout(() => document.body.removeChild(notificacion), 400);
  }, 3000);
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderProductos();
  actualizarCarrito();

  const filtros = document.querySelectorAll(".filtro-boton");
  filtros.forEach(boton => {
    boton.addEventListener("click", () => {
      filtros.forEach(btn => btn.classList.remove("active"));
      boton.classList.add("active");
      renderProductos(boton.dataset.categoria);
    });
  });

  const verCarrito = document.getElementById("verCarrito");
  const cerrarCarrito = document.getElementById("cerrarCarrito");
  const modalCarrito = document.getElementById("modalCarrito");
  const botonComprar = document.getElementById("botonComprar");

  verCarrito.addEventListener("click", () => {
    modalCarrito.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  cerrarCarrito.addEventListener("click", () => {
    modalCarrito.style.display = "none";
    document.body.style.overflow = "auto";
  });

  modalCarrito.addEventListener("click", (e) => {
    if (e.target === modalCarrito) {
      modalCarrito.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  if (botonComprar) {
    botonComprar.addEventListener("click", () => {
      mostrarNotificacion("Redirigiendo a pasarela de pago...");
      setTimeout(() => {
        carrito = [];
        localStorage.removeItem('carrito');
        actualizarCarrito();
        modalCarrito.style.display = "none";
        document.body.style.overflow = "auto";
      }, 2000);
    });
  }

  const formularioContacto = document.getElementById("formularioContacto");
  if (formularioContacto) {
    formularioContacto.addEventListener("submit", function(e) {
      e.preventDefault();
      mostrarNotificacion("Mensaje enviado. Gracias por contactarnos.");
      this.reset();
    });
  }
});
