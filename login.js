async function loadDB() {
  const res = await fetch("api/database.php?action=get");
  return await res.json();
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = username.value.trim();
  const pass = password.value.trim();
  const status = document.getElementById("loginStatus");

  const db = await loadDB();
  const found = db.users.find(u => u.user === user && u.pass === pass);

  if (!found) {
    status.textContent = "Credenciales incorrectas";
    return;
  }

  localStorage.setItem("tpv_operator", found.name);
  localStorage.setItem("tpv_role", found.role);

  window.location.href = "index.html";
});
