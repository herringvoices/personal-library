const _apiUrl = "/api/categories/";

// Get all categories
export const getCategories = () => {
  const token = localStorage.getItem("jwt");
  return fetch(_apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

// Get a specific category by id
export const getCategoryById = (id) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

// Create a new category
export const createCategory = (category) => {
  const token = localStorage.getItem("jwt");
  return fetch(_apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  }).then((res) => (res.ok ? res.json() : null));
};

// Update an existing category
export const updateCategory = (category) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${category.id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  }).then((res) => (res.ok ? res.json() : null));
};

// Delete a category
export const deleteCategory = (id) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
