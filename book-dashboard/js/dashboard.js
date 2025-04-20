const baseUrl = "http://book-api-uts.vercel.app";
const apiKey = localStorage.getItem("apiKey");

if (!apiKey) window.location.href = "index.html";

document.getElementById("bookForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;

  await fetch(\`\${baseUrl}/books\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ title, author, year }),
  });

  document.getElementById("bookForm").reset();
  loadBooks();
});

function logout() {
  localStorage.removeItem("apiKey");
  window.location.href = "index.html";
}

async function loadBooks() {
  const res = await fetch(\`\${baseUrl}/books\`, {
    headers: { "x-api-key": apiKey },
  });
  const books = await res.json();
  renderBooks(books);
}

function renderBooks(books) {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = "";

  books.forEach((book) => {
    const tr = document.createElement("tr");

    tr.innerHTML = \`
      <td><input value="\${book.title}" class="form-control form-control-sm" onchange="updateBookField('\${book._id}', 'title', this.value)" /></td>
      <td><input value="\${book.author}" class="form-control form-control-sm" onchange="updateBookField('\${book._id}', 'author', this.value)" /></td>
      <td><input value="\${book.year}" class="form-control form-control-sm" onchange="updateBookField('\${book._id}', 'year', this.value)" /></td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteBook('\${book._id}')">Hapus</button>
      </td>
    \`;

    bookList.appendChild(tr);
  });
}

async function updateBookField(id, field, value) {
  await fetch(\`\${baseUrl}/books/\${id}\`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ [field]: value }),
  });
  loadBooks();
}

async function deleteBook(id) {
  await fetch(\`\${baseUrl}/books/\${id}\`, {
    method: "DELETE",
    headers: {
      "x-api-key": apiKey,
    },
  });
  loadBooks();
}

loadBooks();
