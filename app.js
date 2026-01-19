// Datos de ejemplo: servicios / productos ATA
const PRODUCTS = [
  {
    id: "SRV-001",
    name: "Diagnóstico avanzado equipo",
    category: "Servicio técnico",
    price: 35.0,
  },
  {
    id: "SRV-002",
    name: "Reparación hardware básica",
    category: "Servicio técnico",
    price: 60.0,
  },
  {
    id: "SRV-003",
    name: "Reparación hardware avanzada",
    category: "Servicio técnico",
    price: 120.0,
  },
  {
    id: "SRV-004",
    name: "Instalación sistema operativo",
    category: "Software",
    price: 50.0,
  },
  {
    id: "SRV-005",
    name: "Mantenimiento preventivo anual",
    category: "Contrato",
    price: 180.0,
  },
  {
    id: "MAT-001",
    name: "Disco SSD 500GB",
    category: "Material",
    price: 75.0,
  },
  {
    id: "MAT-002",
    name: "Módulo RAM 16GB",
    category: "Material",
    price: 65.0,
  },
];

const TAX_RATE = 0.21;

let ticketLines = []; // {id, name, price, qty}

// Utilidades
const formatCurrency = (value) =>
  value.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

const $(id) => document.getElementById(id);

// Cargar fecha
function loadCurrentDate() {
  const el = document.getElementById("currentDate");
  const now = new Date();
  el.textContent = now.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Render productos
function renderProducts(filter = "") {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  const normalized = filter.trim().toLowerCase();

  const filtered = PRODUCTS.filter((p) => {
    if (!normalized) return true;
    return (
      p.name.toLowerCase().includes(normalized) ||
      p.id.toLowerCase().includes(normalized)
    );
  });

  if (filtered.length === 0) {
    container.innerHTML =
      '<div style="padding:10px;font-size:13px;color:#9ca3af;">Sin resultados.</div>';
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-info">
        <span class="product-name">${product.name}</span>
        <span class="product-code">${product.id}</span>
      </div>
      <div class="product-meta">
        <span class="product-price">${formatCurrency(product.price)}</span>
        <span class="product-category">${product.category}</span>
        <button class="btn btn-primary">Añadir</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => {
      addToTicket(product);
    });

    container.appendChild(card);
  });
}

// Ticket: añadir línea
function addToTicket(product) {
  const existing = ticketLines.find((l) => l.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    ticketLines.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    });
  }
  renderTicket();
}

// Ticket: cambiar cantidad
function changeQty(id, delta) {
  const line = ticketLines.find((l) => l.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) {
    ticketLines = ticketLines.filter((l) => l.id !== id);
  }
  renderTicket();
}

// Ticket: eliminar línea
function removeLine(id) {
  ticketLines = ticketLines.filter((l) => l.id !== id);
  renderTicket();
}

// Ticket: vaciar
function clearTicket() {
  ticketLines = [];
  renderTicket();
}

// Ticket: render
function renderTicket() {
  const container = document.getElementById("ticketList");
  container.innerHTML = "";

  if (ticketLines.length === 0) {
    container.innerHTML =
      '<div style="padding:10px;font-size:13px;color:#9ca3af;">Ticket vacío.</div>';
  } else {
    ticketLines.forEach((line) => {
      const row = document.createElement("div");
      row.className = "ticket-line";

      const lineTotal = line.price * line.qty;

      row.innerHTML = `
        <div class="ticket-name">${line.name}</div>
        <div class="ticket-qty">
          <button data-action="dec">-</button>
          <span>${line.qty}</span>
          <button data-action="inc">+</button>
        </div>
        <div class="ticket-price">${formatCurrency(line.price)}</div>
        <div class="ticket-total">${formatCurrency(lineTotal)}</div>
        <div class="ticket-remove">
          <button title="Eliminar línea">&times;</button>
        </div>
      `;

      const [decBtn, incBtn] = row.querySelectorAll(".ticket-qty button");
      const removeBtn = row.querySelector(".ticket-remove button");

      decBtn.addEventListener("click", () => changeQty(line.id, -1));
      incBtn.addEventListener("click", () => changeQty(line.id, 1));
      removeBtn.addEventListener("click", () => removeLine(line.id));

      container.appendChild(row);
    });
  }

  updateTotals();
}

// Totales
function updateTotals() {
  const subtotal = ticketLines.reduce(
    (acc, line) => acc + line.price * line.qty,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  document.getElementById("subtotalAmount").textContent =
    formatCurrency(subtotal);
  document.getElementById("taxAmount").textContent = formatCurrency(tax);
  document.getElementById("totalAmount").textContent = formatCurrency(total);
}

// Cobro
function chargeTicket() {
  const status = document.getElementById("statusMessage");

  if (ticketLines.length === 0) {
    status.textContent = "No hay líneas en el ticket.";
    status.style.color = "#f97373";
    return;
  }

  const method = document.querySelector(
    'input[name="paymentMethod"]:checked'
  )?.value;

  const subtotal = ticketLines.reduce(
    (acc, line) => acc + line.price * line.qty,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Aquí podrías hacer una llamada a tu backend para guardar el ticket
  // fetch('/api/tickets', { method: 'POST', body: JSON.stringify({...}) })

  status.style.color = "#22c55e";
  status.textContent = `Ticket cobrado en ${method}. Total: ${formatCurrency(
    total
  )}`;

  // Opcional: limpiar ticket tras unos segundos
  setTimeout(() => {
    clearTicket();
    status.textContent = "";
  }, 2500);
}

// Eventos iniciales
function initTPV() {
  loadCurrentDate();
  renderProducts();
  renderTicket();

  document
    .getElementById("searchInput")
    .addEventListener("input", (e) => renderProducts(e.target.value));

  document
    .getElementById("clearTicketBtn")
    .addEventListener("click", clearTicket);

  document.getElementById("chargeBtn").addEventListener("click", chargeTicket);
}

document.addEventListener("DOMContentLoaded", initTPV);
