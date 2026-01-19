// Operadores permitidos (demo)
const OPERATORS = [
  { user: "ata01", pass: "1234", name: "Operador 01", role: "operator" },
  { user: "admin", pass: "admin123", name: "Administrador", role: "admin" }
];

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const status = document.getElementById("loginStatus");

  const found = OPERATORS.find(
    (op) => op.user === user && op.pass === pass
  );

  if (!found) {
    status.textContent = "Credenciales incorrectas";
    return;
  }

  // Guardar sesión local
  localStorage.setItem("tpv_operator", found.name);
  localStorage.setItem("tpv_role", found.role); // ← ESTA LÍNEA ES LA QUE FALTABA

  // Redirigir al TPV
  window.location.href = "index.html";
});
