const _apiUrl = "/api";

export const login = (username, password) => {
  return fetch(`${_apiUrl}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    credentials: "include", 
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (!data) return null;
      return tryGetLoggedInUser();
    });
};

export const logout = () => {
  return fetch(`${_apiUrl}/logout/`, {
    method: "POST",
    credentials: "include", 
  }).then(() => {
    return null;
  });
};

export const tryGetLoggedInUser = () => {
  return fetch(`${_apiUrl}/users/me/`, {
    credentials: "include", 
  }).then((res) => (res.ok ? res.json() : null));
};

export const register = (userProfile) => {
  return fetch(`${_apiUrl}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userProfile),
    credentials: "include", 
  })
    .then((res) => (res.ok ? res.json() : null))
    .then(() => tryGetLoggedInUser());
};
