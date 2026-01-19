// Operadores permitidos (demo)
const OPERATORS = [
  { user: "ata01", pass: "1234", name: "Operador 01" },
  { user: "ata02", pass: "5678", name: "Operador 02" }
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

  // Redirigir al TPV
  window.location.href = "index.html";
});
