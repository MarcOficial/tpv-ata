// ===============================
// USUARIOS DEFINIDOS POR TI
// ===============================
// Añade, borra o edita usuarios aquí mismo.
// Puedes crear tantos como quieras.

const USERS = [
  {
    user: "admin",
    pass: "admin123",
    name: "Administrador",
    role: "admin"
  },
  {
    user: "ata01",
    pass: "1234",
    name: "Operador 01",
    role: "operator"
  }
];

// ===============================
// LÓGICA DEL LOGIN
// ===============================

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const status = document.getElementById("loginStatus");

  // Buscar usuario en la lista manual
  const found = USERS.find(
    u => u.user === username && u.pass === password
  );

  if (!found) {
    status.textContent = "Credenciales incorrectas";
    return;
  }

  // Guardar sesión
  localStorage.setItem("tpv_operator", found.name);
  localStorage.setItem("tpv_role", found.role);

  // Redirigir al TPV
  window.location.href = "index.html";
});

