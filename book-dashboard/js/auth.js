const baseUrl = "http://book-api-uts.vercel.app";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      const res = await fetch(\`\${baseUrl}/auth/login\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("apiKey", data.apiKey);
        window.location.href = "dashboard.html";
      } else {
        alert(data.message || "Login gagal");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = registerForm.name.value;
      const email = registerForm.email.value;
      const password = registerForm.password.value;

      const res = await fetch(\`\${baseUrl}/auth/register\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registrasi berhasil, silakan login.");
        window.location.href = "index.html";
      } else {
        alert(data.message || "Registrasi gagal");
      }
    });
  }
});
