const _apiUrl = "/api";

export const login = (username, password) => {
  return fetch(`${_apiUrl}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data) return null;
      // Store the JWT locally
      localStorage.setItem("jwt", data.access);
      return tryGetLoggedInUser();
    });
};

export const logout = () => {
  localStorage.removeItem("jwt");
  return Promise.resolve();
};

export const tryGetLoggedInUser = () => {
  const token = localStorage.getItem("jwt");
  if (!token) return Promise.resolve(null);

  return fetch(`${_apiUrl}/users/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => (res.ok ? res.json() : null));
};

export const register = (userProfile) => {
  // Assume your backend provides a registration endpoint at /api/register (if implemented)
  return fetch(`${_apiUrl}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userProfile),
  })
    .then((res) => (res.ok ? res.json() : null))
    .then(() => tryGetLoggedInUser());
};
