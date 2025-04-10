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
