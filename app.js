/* ============================
   CONTROL DE SESIÓN
============================ */

const operator = localStorage.getItem("tpv_operator");
const role = localStorage.getItem("tpv_role");

if (!operator) {
  window.location.href = "login.html";
}

document.getElementById("operatorName").textContent =
  "Operador: " + operator;

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("tpv_operator");
  localStorage.removeItem("tpv_role");
  window.location.href = "login.html";
});

/* ============================
   BOTÓN ADMIN
============================ */

const adminBtn = document.getElementById("adminBtn");

if (role === "admin") {
  adminBtn.style.display = "inline-block";
  adminBtn.addEventListener("click", () => {
    window.location.href = "admin.html";
  });
} else {
  adminBtn.style.display = "none";
}

/* ============================
   PRODUCTOS
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

function formatCurrency(v) {
  return v.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

function renderProducts(filter = "") {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  const f = filter.toLowerCase();

  PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(f) || p.id.toLowerCase().includes(f)
  ).forEach(p => {
    const div = document.createElement("div");
    div.className = "product-item";
    div.innerHTML = `
      <strong>${p.name}</strong> (${p.id}) - ${formatCurrency(p.price)}
      <button class="btn-primary" onclick='addToTicket(${JSON.stringify(p)})'>Añadir</button>
    `;
    container.appendChild(div);
  });
}

function addToTicket(product) {
  const existing = ticketLines.find(l => l.id === product.id);

  if (existing) existing.qty++;
  else ticketLines.push({ ...product, qty: 1 });

  renderTicket();
}

function changeQty(id, delta) {
  const line = ticketLines.find(l => l.id === id);
  if (!line) return;

  line.qty += delta;
  if (line.qty <= 0) ticketLines = ticketLines.filter(l => l.id !== id);

  renderTicket();
}

function removeLine(id) {
  ticketLines = ticketLines.filter(l => l.id !== id);
  renderTicket();
}

function renderTicket() {
  const container = document.getElementById("ticketList");
  container.innerHTML = "";

  ticketLines.forEach(line => {
    const div = document.createElement("div");
    div.className = "ticket-item";
    div.innerHTML = `
      ${line.name} x ${line.qty} = ${formatCurrency(line.qty * line.price)}
      <button onclick="changeQty('${line.id}', -1)">-</button>
      <button onclick="changeQty('${line.id}', 1)">+</button>
      <button onclick="removeLine('${line.id}')">X</button>
    `;
    container.appendChild(div);
  });

  updateTotals();
}

function updateTotals() {
  const subtotal = ticketLines.reduce((acc, l) => acc + l.price * l.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  document.getElementById("subtotalAmount").textContent = formatCurrency(subtotal);
  document.getElementById("taxAmount").textContent = formatCurrency(tax);
  document.getElementById("totalAmount").textContent = formatCurrency(total);
}

function chargeTicket() {
  const status = document.getElementById("statusMessage");

  if (ticketLines.length === 0) {
    status.textContent = "No hay líneas en el ticket.";
    return;
  }

  const method = document.querySelector('input[name="paymentMethod"]:checked').value;

  status.textContent = "Cobrado en " + method;

  setTimeout(() => {
    ticketLines = [];
    renderTicket();
    status.textContent = "";
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderTicket();

  document.getElementById("searchInput").addEventListener("input", e =>
    renderProducts(e.target.value)
  );

  document.getElementById("chargeBtn").onclick = chargeTicket;
});
