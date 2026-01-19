/* ============================
   SESIÓN
============================ */
const operator = localStorage.getItem("tpv_operator");
const role = localStorage.getItem("tpv_role");

if (!operator) window.location.href = "login.html";

document.getElementById("operatorName").textContent = "Operador: " + operator;

document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  window.location.href = "login.html";
};

if (role === "admin") {
  adminBtn.style.display = "inline-block";
  adminBtn.onclick = () => window.location.href = "admin.html";
} else {
  adminBtn.style.display = "none";
}

/* ============================
   API
============================ */
async function loadDB() {
  const res = await fetch("api/database.php?action=get");
  return await res.json();
}

async function saveDB(db) {
  await fetch("api/database.php?action=save", {
    method: "POST",
    body: JSON.stringify(db)
  });
}

/* ============================
   VARIABLES
============================ */
let PRODUCTS = [];
let ticket = [];
const TAX = 0.21;

/* ============================
   CARGAR PRODUCTOS
============================ */
async function initTPV() {
  const db = await loadDB();
  PRODUCTS = db.products;
  renderProducts();
  renderTicket();
}

function renderProducts(filter = "") {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  const f = filter.toLowerCase();

  PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(f)
  ).forEach(p => {
    const div = document.createElement("div");
    div.className = "product-item";
    div.innerHTML = `
      <strong>${p.name}</strong> - ${p.price}€
      <button class="btn-primary" onclick="addToTicket(${p.id})">Añadir</button>
    `;
    list.appendChild(div);
  });
}

/* ============================
   TICKET
============================ */
function addToTicket(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = ticket.find(l => l.id === id);

  if (existing) existing.qty++;
  else ticket.push({ ...product, qty: 1 });

  renderTicket();
}

function changeQty(id, delta) {
  const line = ticket.find(l => l.id === id);
  if (!line) return;

  line.qty += delta;
  if (line.qty <= 0) ticket = ticket.filter(l => l.id !== id);

  renderTicket();
}

function renderTicket() {
  const list = document.getElementById("ticketList");
  list.innerHTML = "";

  ticket.forEach(l => {
    const div = document.createElement("div");
    div.className = "ticket-item";
    div.innerHTML = `
      ${l.name} x ${l.qty} = ${(l.qty * l.price).toFixed(2)}€
      <button onclick="changeQty(${l.id}, -1)">-</button>
      <button onclick="changeQty(${l.id}, 1)">+</button>
      <button onclick="removeLine(${l.id})">X</button>
    `;
    list.appendChild(div);
  });

  updateTotals();
}

function removeLine(id) {
  ticket = ticket.filter(l => l.id !== id);
  renderTicket();
}

/* ============================
   TOTALES
============================ */
function updateTotals() {
  const subtotal = ticket.reduce((acc, l) => acc + l.price * l.qty, 0);
  const tax = subtotal * TAX;
  const total = subtotal + tax;

  subtotalAmount.textContent = subtotal.toFixed(2) + "€";
  taxAmount.textContent = tax.toFixed(2) + "€";
  totalAmount.textContent = total.toFixed(2) + "€";
}

/* ============================
   COBRAR
============================ */
async function chargeTicket() {
  if (ticket.length === 0) {
    statusMessage.textContent = "No hay artículos en el ticket.";
    return;
  }

  const db = await loadDB();

  const subtotal = ticket.reduce((acc, l) => acc + l.price * l.qty, 0);
  const tax = subtotal * TAX;
  const total = subtotal + tax;

  db.tickets.push({
    id: Date.now(),
    datetime: new Date().toLocaleString(),
    items: ticket,
    total,
    operator
  });

  await saveDB(db);

  statusMessage.textContent = "Ticket cobrado correctamente.";
  ticket = [];
  renderTicket();

  setTimeout(() => statusMessage.textContent = "", 2000);
}

/* ============================
   EVENTOS
============================ */
searchInput.oninput = e => renderProducts(e.target.value);
chargeBtn.onclick = chargeTicket;

/* ============================
   INICIO
============================ */
initTPV();
