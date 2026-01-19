/* ============================
   CONTROL DE ACCESO
============================ */
if (localStorage.getItem("tpv_role") !== "admin") {
  window.location.href = "index.html";
}

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

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
    body: JSON.stringify(db),
  });
}

/* ============================
   NAVEGACIÓN
============================ */
document.querySelectorAll(".admin-nav").forEach(btn => {
  btn.addEventListener("click", () => {
    openSection(btn.dataset.section);
  });
});

async function openSection(section) {
  const content = document.getElementById("adminContent");
  const db = await loadDB();

  /* ============================
     DASHBOARD
  ============================ */
  if (section === "dashboard") {
    content.innerHTML = `
      <h2>Dashboard</h2>
      <p>Total categorías: ${db.categories.length}</p>
      <p>Total artículos: ${db.products.length}</p>
      <p>Total tickets: ${db.tickets.length}</p>
    `;
  }

  /* ============================
     CATEGORÍAS
  ============================ */
  if (section === "categories") {
    content.innerHTML = `
      <h2>Categorías</h2>
      <button class="btn-primary" id="addCatBtn">Añadir categoría</button>
      <div id="catList"></div>
    `;

    const list = document.getElementById("catList");

    db.categories.forEach(c => {
      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `
        <strong>${c.name}</strong>
        <button onclick="deleteCategory(${c.id})" class="btn-secondary">Eliminar</button>
      `;
      list.appendChild(div);
    });

    document.getElementById("addCatBtn").onclick = () => {
      const name = prompt("Nombre de categoría:");
      if (!name) return;

      db.categories.push({
        id: Date.now(),
        name
      });

      saveDB(db);
      openSection("categories");
    };
  }

  /* ============================
     PRODUCTOS / ARTÍCULOS
  ============================ */
  if (section === "products") {
    content.innerHTML = `
      <h2>Artículos</h2>
      <button class="btn-primary" id="addProdBtn">Añadir artículo</button>
      <div id="prodList"></div>
    `;

    const list = document.getElementById("prodList");

    db.products.forEach(p => {
      const cat = db.categories.find(c => c.id === p.category)?.name || "Sin categoría";

      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `
        <strong>${p.name}</strong> - ${cat} - ${p.price}€
        <button onclick="deleteProduct(${p.id})" class="btn-secondary">Eliminar</button>
      `;
      list.appendChild(div);
    });

    document.getElementById("addProdBtn").onclick = () => {
      const name = prompt("Nombre del artículo:");
      const price = parseFloat(prompt("Precio:"));
      const category = parseInt(prompt("ID de categoría:"));

      if (!name || !price || !category) return;

      db.products.push({
        id: Date.now(),
        name,
        price,
        category
      });

      saveDB(db);
      openSection("products");
    };
  }

  /* ============================
     TICKETS
  ============================ */
  if (section === "tickets") {
    content.innerHTML = `
      <h2>Tickets recientes</h2>
      <div id="ticketListAdmin"></div>
    `;

    const list = document.getElementById("ticketListAdmin");

    db.tickets.forEach(t => {
      const div = document.createElement("div");
      div.className = "ticket-item";
      div.innerHTML = `
        <strong>Ticket #${t.id}</strong><br>
        Fecha: ${t.datetime}<br>
        Total: ${t.total}€<br>
        Operador: ${t.operator}
      `;
      list.appendChild(div);
    });
  }
}

/* ============================
   CRUD GLOBALES
============================ */
async function deleteCategory(id) {
  const db = await loadDB();
  db.categories = db.categories.filter(c => c.id !== id);
  saveDB(db);
  openSection("categories");
}

async function deleteProduct(id) {
  const db = await loadDB();
  db.products = db.products.filter(p => p.id !== id);
  saveDB(db);
  openSection("products");
}
