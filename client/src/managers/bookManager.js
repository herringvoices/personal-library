const _apiUrl = "/api/books/";

// Get all books for the current user
export const getBooks = () => {
  const token = localStorage.getItem("jwt");
  return fetch(_apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

// Get books by bookshelf
export const getBooksByBookcase = (bookcaseId) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}?bookshelf=${bookcaseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

// Get a specific book by id
export const getBookById = (id) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

// Create a new book
export const createBook = (book) => {
  const token = localStorage.getItem("jwt");
  return fetch(_apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  }).then((res) => (res.ok ? res.json() : null));
};

// Update an existing book
export const updateBook = (book) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${book.id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  }).then((res) => (res.ok ? res.json() : null));
};

// Delete a book
export const deleteBook = (id) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Search for a book by ISBN
export const searchBookByISBN = (isbn) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}search/?isbn=${isbn}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};
