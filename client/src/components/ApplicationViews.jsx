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
