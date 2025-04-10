# Create client directory
mkdir -p client
cd client

# Initialize React project using Vite
npm create vite@latest . -- --template react
clear

# Replace vite.config.js with the specified content (make sure the proxy target matches your Django server)
cat > vite.config.js <<EOF
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    server: {
      open: true,
      proxy: {
        "/api": {
          target: "http://localhost:8000",  // update target to your Django dev server
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: "build",
    },
    plugins: [react()],
  };
});
EOF

echo "✅ vite.config.js updated successfully!"

# Install react-router-dom
npm install --save react-router-dom

# Install react-bootstrap and bootstrap
npm install react-bootstrap bootstrap

# Install FontAwesome
echo "Installing FontAwesome for React..."

# Install Font Awesome SVG Core
npm i --save @fortawesome/fontawesome-svg-core

# Install Font Awesome Free Icon Packages
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons

# Install Font Awesome React Component
npm i --save @fortawesome/react-fontawesome@latest

echo "FontAwesome installation complete! ✅"

# Ensure src/components and src/managers directories exist
mkdir -p src/components/auth
mkdir -p src/managers

# Create authManager.js with updated JWT endpoints and logic
cat > src/managers/authManager.js <<'EOF'
const _apiUrl = "/api";

export const login = (email, password) => {
  return fetch(`${_apiUrl}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: email, password }),
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
  return fetch(`${_apiUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userProfile),
  })
    .then((res) => (res.ok ? res.json() : null))
    .then(() => tryGetLoggedInUser());
};
EOF

echo "✅ src/managers/authManager.js created successfully!"

# Create AuthorizedRoute.jsx
cat > src/components/auth/AuthorizedRoute.jsx <<EOF
import { Navigate } from "react-router-dom";

export const AuthorizedRoute = ({ children, loggedInUser, roles, all }) => {
  let authed = loggedInUser
    ? roles && roles.length
      ? all
        ? roles.every((r) => loggedInUser.roles.includes(r))
        : roles.some((r) => loggedInUser.roles.includes(r))
      : true
    : false;

  return authed ? children : <Navigate to="/login" />;
};
EOF

echo "✅ src/components/auth/AuthorizedRoute.jsx created!"

# Create Login.jsx file content
cat > src/components/auth/Login.jsx <<EOF
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../managers/authManager";
import { Button, Form, FormControl, FormGroup, FormLabel, Alert } from "react-bootstrap";

export default function Login({ setLoggedInUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password).then((user) => {
      if (!user) {
        setFailedLogin(true);
      } else {
        setLoggedInUser(user);
        navigate("/");
      }
    });
  };

  return (
    <div className="container" style={{ maxWidth: "500px" }}>
      <h3>Login</h3>
      {failedLogin && <Alert variant="danger">Login failed.</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <FormControl type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <FormLabel>Password</FormLabel>
          <FormControl type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormGroup>
        <Button variant="primary" className="my-2" type="submit">Login</Button>
      </Form>
      <p>Not signed up? Register <Link to="/register">here</Link></p>
    </div>
  );
}
EOF

echo "✅ src/components/auth/Login.jsx created successfully!"

# Create the Register.jsx file with correct formatting
cat > src/components/auth/Register.jsx <<EOF
import { useState } from "react";
import { register } from "../../managers/authManager";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Container, Alert } from "react-bootstrap";

export default function Register({ setLoggedInUser }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [registrationFailure, setRegistrationFailure] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      const newUser = {
        firstName,
        lastName,
        userName,
        email,
        address,
        password,
      };
      register(newUser).then((user) => {
        if (user) {
          setLoggedInUser(user);
          navigate("/");
        } else {
          setRegistrationFailure(true);
        }
      });
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "500px" }}>
      <h3>Sign Up</h3>
      {registrationFailure && (
        <Alert variant="danger">Registration failed. Please try again.</Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            isInvalid={passwordMismatch}
            value={password}
            onChange={(e) => {
              setPasswordMismatch(false);
              setPassword(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            isInvalid={passwordMismatch}
            value={confirmPassword}
            onChange={(e) => {
              setPasswordMismatch(false);
              setConfirmPassword(e.target.value);
            }}
          />
          <Form.Control.Feedback type="invalid">
            Passwords do not match!
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={passwordMismatch}>
          Register
        </Button>
      </Form>
      <p className="mt-3">
        Already signed up? Log in <Link to="/login">here</Link>.
      </p>
    </Container>
  );
}
EOF

echo "✅ src/components/auth/Register.jsx has been created successfully!"

echo "Auth components and managers created successfully!"

# Fix `main.jsx`
cat > src/main.jsx <<EOF
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
EOF

echo "✅ src/main.jsx updated!"

# Fix `App.jsx`
cat > src/App.jsx <<EOF
import { useEffect, useState } from "react";
import { tryGetLoggedInUser } from "./managers/authManager";
import { Spinner } from "react-bootstrap";
import ApplicationViews from "./components/ApplicationViews";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, far, fab);

function App() {
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    tryGetLoggedInUser().then(setLoggedInUser);
  }, []);

  return loggedInUser === undefined ? (
    <Spinner animation="border" role="status" />
  ) : (
    <>
      <ApplicationViews loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
    </>
  );
}

export default App;
EOF

echo "✅ src/App.jsx updated!"

# Fix `index.css`
cat > src/index.css <<EOF
/* Import the google web fonts you want to use */
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@300&family=Quicksand&family=Roboto:wght@100&display=swap");

/* FONTS
font-family: "Nunito", sans-serif;
font-family: "Quicksand", sans-serif;
font-family: "Roboto", sans-serif; 
*/

/* COLOR PALETTE Feel Free to change*/
:root {
  --darkest: #000000;
  --less-dark: #444444;
  --accent: #ffa600;
  --lightest: #ffffff;
  --less-light: #cccccc;
}

/* GLOBAL STYLES */
body,
button,
input,
select,
textarea {
  font-family: "Nunito", sans-serif;
}

body {
  background-color: var(--appBackground);
  margin: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Roboto", serif;
}
EOF
echo "✅ src/index.css updated!"

rm -f src/app.css

# Replace eslint.config.js to disable prop validation
cat > eslint.config.js <<EOF
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      // Disable props validation
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
EOF

echo "✅ eslint.config.js updated to disable prop validation!"

# Create ApplicationViews.jsx
cat > src/components/ApplicationViews.jsx <<EOF
import { Outlet, Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import NavBar from "./NavBar";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      {/* PARENT ROUTE */}
      <Route
        path="/"
        element={
          <>
            <NavBar
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
            <Outlet />
          </>
        }
      >
        {/* CHILD ROUTES */}
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <h1 className="text-center">Welcome</h1>
            </AuthorizedRoute>
          }
        />

        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />

        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>

      {/* CATCH-ALL ROUTE */}
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}
EOF

echo "✅ src/components/ApplicationViews.jsx created!"

# Fix NavBar.jsx
cat > src/components/NavBar.jsx <<EOF
import { NavLink } from "react-router-dom";
import { Button, Navbar, Nav } from "react-bootstrap";
import { logout } from "../managers/authManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={NavLink} to="/" className="mx-5">
        <FontAwesomeIcon icon="fa-solid fa-home" />
      </Navbar.Brand>
      <Nav className="ms-auto mx-5">
        {loggedInUser ? (
          <Button
            variant="outline-danger"
            onClick={() => logout().then(() => setLoggedInUser(null))}
          >
            Logout
          </Button>
        ) : (
          <Nav.Link as={NavLink} to="/login">
            <Button variant="outline-primary">Login</Button>
          </Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
}
EOF

echo "✅ src/components/NavBar.jsx created!"
