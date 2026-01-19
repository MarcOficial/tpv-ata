if (localStorage.getItem("tpv_role") !== "admin") {
  window.location.href = "index.html";
}

document.getElementById("backBtn").onclick = () => {
  window.location.href = "index.html";
};

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

document.querySelectorAll(".admin-nav").forEach(btn => {
  btn.onclick = () => openSection(btn.dataset.section);
});

async function openSection(section) {
  const content = document.getElementById("adminContent");
  const db = await loadDB();

  if (section === "dashboard") {
    content.innerHTML = `
      <h2>Dashboard</h2>
      <p>Categorías: ${db.categories.length}</p>
      <p>Artículos: ${db.products.length}</p>
      <p>Tickets: ${db.tickets.length}</p>
    `;
  }

  if (section === "categories") {
    content.innerHTML = `
      <h2>Categorías</h2>
      <button class="btn-primary" id="addCat">Añadir categoría</button>
      <div id="catList"></div>
    `;

    const list = document.getElementById("catList");

    db.categories.forEach(c => {
      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `
        <strong>${c.name}</strong>
        <button class="btn-secondary" onclick="deleteCategory(${c.id})">Eliminar</button>
      `;
      list.appendChild(div);
    });

    document.getElementById("addCat").onclick = async () => {
      const name = prompt("Nombre de categoría:");
      if (!name) return;

      db.categories.push({ id: Date.now(), name });
      await saveDB(db);
      openSection("categories");
    };
  }

  if (section === "products") {
    content.innerHTML = `
      <h2>Artículos</h2>
      <button class="btn-primary" id="addProd">Añadir artículo</button>
      <div id="prodList"></div>
    `;

    const list = document.getElementById("prodList");

    db.products.forEach(p => {
      const cat = db.categories.find(c => c.id === p.category)?.name || "Sin categoría";

      const div = document.createElement("div");
      div.className = "product-item";
      div.innerHTML = `
        <strong>${p.name}</strong> - ${cat} - ${p.price}€
        <button class="btn-secondary" onclick="deleteProduct(${p.id})">Eliminar</button>
      `;
      list.appendChild(div);
    });

    document.getElementById("addProd").onclick = async () => {
      const name = prompt("Nombre:");
      const price = parseFloat(prompt("Precio:"));
      const category = parseInt(prompt("ID categoría:"));

      if (!name || !price || !category) return;

      db.products.push({
        id: Date.now(),
        name,
        price,
        category
      });

      await saveDB(db);
      openSection("products");
    };
  }

  if (section === "tickets") {
    content.innerHTML = `
      <h2>Tickets</h2>
      <div id="ticketList"></div>
    `;

    const list = document.getElementById("ticketList");

    db.tickets.forEach(t => {
      const div = document.createElement("div");
      div.className = "ticket-item";
      div.innerHTML = `
        <strong>Ticket #${t.id}</strong><br>
        Fecha: ${t.datetime}<br>
        Total: ${t.total}€
      `;
      list.appendChild(div);
    });
  }
}

async function deleteCategory(id) {
  const db = await loadDB();
  db.categories = db.categories.filter(c => c.id !== id);
  await saveDB(db);
  openSection("categories");
}

async function deleteProduct(id) {
  const db = await loadDB();
  db.products = db.products.filter(p => p.id !== id);
  await saveDB(db);
  openSection("products");
}

