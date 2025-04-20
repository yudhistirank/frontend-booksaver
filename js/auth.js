const apiUrl = 'https://book-api-uts.vercel.app/api/auth';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('apiKey', data.apiKey);
        localStorage.setItem('userEmail', email);
        window.location.href = 'dashboard.html';
      } else {
        alert(data.message || 'Login gagal');
      }
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  });
}

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch(`${apiUrl}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
          alert('Registrasi berhasil, silakan login.');
          window.location.href = 'index.html';
        } else {
          alert(data.message || 'Registrasi gagal');
        }
      } catch (err) {
        alert('Terjadi kesalahan');
      }
    });
  }
});
