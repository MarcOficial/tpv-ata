const USERS = [
  { user: "admin", pass: "admin123", name: "Administrador", role: "admin" },
  { user: "ata01", pass: "1234", name: "Operador 01", role: "operator" }
];

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const status = document.getElementById("loginStatus");

  const found = USERS.find(
    u => u.user === username && u.pass === password
  );

  if (!found) {
    status.textContent = "Credenciales incorrectas";
    return;
  }

  localStorage.setItem("tpv_operator", found.name);
  localStorage.setItem("tpv_role", found.role);

  window.location.href = "index.html";
});
