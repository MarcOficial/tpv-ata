// Bloqueo si no es admin
if (localStorage.getItem("tpv_role") !== "admin") {
  window.location.href = "index.html";
}

document.getElementById("adminName").innerHTML =
  `Admin: <strong>${localStorage.getItem("tpv_operator")}</strong>`;

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

// Cambiar entre secciones
function openSection(section) {
  document.querySelectorAll(".admin-section").forEach(s => s.style.display = "none");
  document.getElementById(`section-${section}`).style.display = "block";
}

// Mostrar por defecto
openSection("users");
