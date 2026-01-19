if (localStorage.getItem("tpv_role") !== "admin") {
  window.location.href = "index.html";
}

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

function openSection(section) {
  const content = document.getElementById("adminContent");

  if (section === "users") {
    content.innerHTML = "<h2>Gestión de usuarios</h2><p>Aquí irán los usuarios.</p>";
  }

  if (section === "categories") {
    content.innerHTML = "<h2>Carpetas de productos</h2><p>Aquí irán las categorías.</p>";
  }

  if (section === "products") {
    content.innerHTML = "<h2>Productos</h2><p>Aquí irán los productos.</p>";
  }

  if (section === "tickets") {
    content.innerHTML = "<h2>Tickets recientes</h2><p>Aquí irán los tickets.</p>";
  }
}
