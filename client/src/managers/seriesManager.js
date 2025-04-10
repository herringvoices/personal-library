const _apiUrl = "/api/series/";

// Get all series
export const getAllSeries = () => {
  const token = localStorage.getItem("jwt");
  return fetch(_apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

// Get a specific series by id
export const getSeriesById = (id) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

// Create a new series
export const createSeries = (series) => {
  const token = localStorage.getItem("jwt");
  return fetch(_apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(series),
  }).then((res) => (res.ok ? res.json() : null));
};

// Update an existing series
export const updateSeries = (series) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${series.id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(series),
  }).then((res) => (res.ok ? res.json() : null));
};

// Delete a series
export const deleteSeries = (id) => {
  const token = localStorage.getItem("jwt");
  return fetch(`${_apiUrl}${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
