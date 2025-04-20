const apiUrl = 'https://book-api-uts.vercel.app/api';
const apiKey = localStorage.getItem('apiKey');

// Redirect ke login jika belum ada API key
if (!apiKey) {
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const userEmail = localStorage.getItem('userEmail');
  if (userEmail) {
    const greeting = document.getElementById('userGreeting');
    if (greeting) {
      greeting.textContent = `Halo, ${userEmail}`;
    }
  }

  fetchBooks();

  const form = document.getElementById('bookForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const author = document.getElementById('author').value;
      const year = parseInt(document.getElementById('year').value);

      try {
        const res = await fetch(`${apiUrl}/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
          },
          body: JSON.stringify({ title, author, year })
        });

        const data = await res.json();
        if (res.ok) {
          fetchBooks();
          e.target.reset();
        } else {
          alert(data.message || 'Gagal menambahkan buku.');
        }
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan jaringan saat menambahkan buku.');
      }
    });
  }

  const editForm = document.getElementById('editBookForm');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = document.getElementById('editId').value;
      const title = document.getElementById('editTitle').value;
      const author = document.getElementById('editAuthor').value;
      const year = parseInt(document.getElementById('editYear').value);

      try {
        const res = await fetch(`${apiUrl}/books/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
          },
          body: JSON.stringify({ title, author, year })
        });

        const data = await res.json();
        if (res.ok) {
          fetchBooks();
          const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
          modal.hide();
        } else {
          alert(data.message || 'Gagal mengedit buku.');
        }
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan jaringan saat mengedit buku.');
      }
    });
  }
});

// Fungsi untuk mengambil daftar buku dari API
async function fetchBooks() {
  try {
    const res = await fetch(`${apiUrl}/books`, {
      headers: { 'x-api-key': apiKey }
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Error response:', text);
      alert(`Gagal mengambil data buku: ${res.status}`);
      return;
    }

    const data = await res.json();
    renderBooks(data);
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Gagal mengambil data buku (kesalahan jaringan)');
  }
}

// Fungsi untuk merender daftar buku
function renderBooks(books) {
  const bookList = document.getElementById('bookList');
  bookList.innerHTML = '';

  if (books.length === 0) {
    bookList.innerHTML = `<tr><td colspan="5" class="text-center">Tidak ada buku</td></tr>`;
    return;
  }

  books.forEach(async (book) => {
    const tr = document.createElement('tr');

    let country = 'Memuat...';
    // Menggunakan API Nationalize.io untuk mendapatkan negara berdasarkan nama penulis
    try {
      const res = await fetch(`https://api.nationalize.io?name=${book.author}`);
      const data = await res.json();
      if (data.country && data.country.length > 0) {
        country = data.country[0].country_id;
      } else {
        country = 'Tidak diketahui';
      }
    } catch (err) {
      country = 'Gagal memuat';
    }

    tr.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.year}</td>
      <td>${country}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick="showEditModal('${book._id}', '${book.title}', '${book.author}', '${book.year}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteBook('${book._id}')">Hapus</button>
      </td>
    `;
    bookList.appendChild(tr);
  });
}

// Fungsi untuk menampilkan modal edit
function showEditModal(id, title, author, year) {
  document.getElementById('editId').value = id;
  document.getElementById('editTitle').value = title;
  document.getElementById('editAuthor').value = author;
  document.getElementById('editYear').value = year;

  const modal = new bootstrap.Modal(document.getElementById('editModal'));
  modal.show();
}

// Fungsi untuk menghapus buku
async function deleteBook(id) {
  if (!confirm('Yakin ingin menghapus buku ini?')) return;

  try {
    const res = await fetch(`${apiUrl}/books/${id}`, {
      method: 'DELETE',
      headers: { 'x-api-key': apiKey }
    });

    if (res.ok) {
      fetchBooks();
    } else {
      const data = await res.json();
      alert(data.message || 'Gagal menghapus buku.');
    }
  } catch (err) {
    console.error(err);
    alert('Gagal menghapus buku (kesalahan jaringan)');
  }
}

function logout() {
  localStorage.removeItem('apiKey');
  window.location.href = 'index.html';
}
