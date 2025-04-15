import { Outlet, Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import NavBar from "./NavBar";
import CatalogueView from "./books/CatalogueView";
import BookshelvesView from "./bookshelves/BookshelvesView";
import BookshelfView from "./bookshelves/BookshelfView";
import SettingsView from "./settings/SettingsView";

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
              <h1 className="text-center">Welcome to Your Personal Library</h1>
              <div className="text-center mt-4">
                <p>What would you like to do today?</p>
              </div>
            </AuthorizedRoute>
          }
        />

        <Route
          path="catalogue"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <CatalogueView />
            </AuthorizedRoute>
          }
        />

        <Route
          path="bookshelves"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <BookshelvesView />
            </AuthorizedRoute>
          }
        />

        <Route
          path="bookshelves/:id"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <BookshelfView />
            </AuthorizedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <SettingsView />
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
