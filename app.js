/* ============================
   CONTROL DE SESIÓN
============================ */

const operator = localStorage.getItem("tpv_operator");

if (!operator) {
  window.location.href = "login.html";
}

document.getElementById("operatorName").innerHTML =
  `Operador: <strong>${operator}</strong>`;

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("tpv_operator");
  window.location.href = "login.html";
});

/* ============================
   PRODUCTOS / SERVICIOS
============================ */

const PRODUCTS = [
  { id: "SRV-001", name: "Diagnóstico avanzado", category: "Servicio", price: 35 },
  { id: "SRV-002", name: "Reparación básica", category: "Servicio", price: 60 },
  { id: "SRV-003", name: "Reparación avanzada", category: "Servicio", price: 120 },
  { id: "SRV-004", name: "Instalación SO", category: "Software", price: 50 },
  { id: "SRV-005", name: "Mantenimiento anual", category: "Contrato", price: 180 },
  { id: "MAT-001", name: "SSD 500GB", category: "Material", price: 75 },
  { id: "MAT-002", name: "RAM 16GB", category: "Material", price: 65 }
];

const TAX_RATE = 0.21;
let ticketLines = [];

/* ============================
   UTILIDADES
============================ */

const formatCurrency = (v) =>
  v.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

/* ============================
   RENDER PRODUCTOS
============================ */

function renderProducts(filter = "") {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  const f = filter.toLowerCase();

  const filtered = PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(f) || p.id.toLowerCase().includes(f)
  );

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-info">
        <span class="product-name">${p.name}</span>
        <span class="product-code">${p.id}</span>
      </div>
      <div class="product-meta">
        <span class="product-price">${formatCurrency(p.price)}</span>
        <span class="product-category">${p.category}</span>
        <button class="btn btn-primary">Añadir</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => addToTicket(p));

    container.appendChild(card);
  });
}

/* ============================
   TICKET
============================ */

function addToTicket(product) {
  const existing = ticketLines.find((l) => l.id === product.id);

  if (existing) existing.qty++;
  else ticketLines.push({ ...product, qty: 1 });

  renderTicket();
}

function changeQty(id, delta) {
  const line = ticketLines.find((l) => l.id === id);
  if (!line) return;

  line.qty += delta;
  if (line.qty <= 0) ticketLines = ticketLines.filter((l) => l.id !== id);

  renderTicket();
}

function removeLine(id) {
  ticketLines = ticketLines.filter((l) => l.id !== id);
  renderTicket();
}

function clearTicket() {
  ticketLines = [];
  renderTicket();
}

function renderTicket() {
  const container = document.getElementById("ticketList");
  container.innerHTML = "";

  if (ticketLines.length === 0) {
    container.innerHTML = `<div style="padding:10px;color:#9ca3af;">Ticket vacío.</div>`;
    updateTotals();
    return;
  }

  ticketLines.forEach((line) => {
    const row = document.createElement("div");
    row.className = "ticket-line";

    row.innerHTML = `
      <div class="ticket-name">${line.name}</div>

      <div class="ticket-qty">
        <button data-action="dec">-</button>
        <span>${line.qty}</span>
        <button data-action="inc">+</button>
      </div>

      <div class="ticket-price">${formatCurrency(line.price)}</div>
      <div class="ticket-total">${formatCurrency(line.price * line.qty)}</div>

      <div class="ticket-remove">
        <button>&times;</button>
      </div>
    `;

    row.querySelector('[data-action="dec"]').onclick = () =>
      changeQty(line.id, -1);

    row.querySelector('[data-action="inc"]').onclick = () =>
      changeQty(line.id, 1);

    row.querySelector(".ticket-remove button").onclick = () =>
      removeLine(line.id);

    container.appendChild(row);
  });

  updateTotals();
}

/* ============================
   TOTALES
============================ */

function updateTotals() {
  const subtotal = ticketLines.reduce(
    (acc, l) => acc + l.price * l.qty,
    0
  );

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  document.getElementById("subtotalAmount").textContent = formatCurrency(subtotal);
  document.getElementById("taxAmount").textContent = formatCurrency(tax);
  document.getElementById("totalAmount").textContent = formatCurrency(total);
}

/* ============================
   COBRO
============================ */

function chargeTicket() {
  const status = document.getElementById("statusMessage");

  if (ticketLines.length === 0) {
    status.style.color = "#f87171";
    status.textContent = "No hay líneas en el ticket.";
    return;
  }

  const method = document.querySelector('input[name="paymentMethod"]:checked').value;

  const subtotal = ticketLines.reduce((acc, l) => acc + l.price * l.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  status.style.color = "#22c55e";
  status.textContent = `Cobrado en ${method}. Total: ${formatCurrency(total)}`;

  setTimeout(() => {
    clearTicket();
    status.textContent = "";
  }, 2500);
}

/* ============================
   INICIALIZACIÓN
============================ */

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderTicket();

  document.getElementById("searchInput").addEventListener("input", (e) =>
    renderProducts(e.target.value)
  );

  document.getElementById("clearTicketBtn").onclick = clearTicket;
  document.getElementById("chargeBtn").onclick = chargeTicket;
});

