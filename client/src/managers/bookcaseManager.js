const _apiUrl = "/api/bookshelves/";

// Get all bookcases for the current user
export const getBookcases = () => {
  const token = localStorage.getItem("jwt");
  return fetch(_apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

// Get a specific bookcase by id
export const getBookcaseById = (id) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

// Create a new bookcase
export const createBookcase = (bookcase) => {
  const token = localStorage.getItem("jwt");
  return fetch(_apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookcase),
  }).then((res) => (res.ok ? res.json() : null));
};

// Update an existing bookcase
export const updateBookcase = (bookcase) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${bookcase.id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookcase),
  }).then((res) => (res.ok ? res.json() : null));
};

// Delete a bookcase
export const deleteBookcase = (id) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
