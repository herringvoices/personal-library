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
