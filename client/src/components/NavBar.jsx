import { NavLink } from "react-router-dom";
import { Button, Navbar, Nav, Container } from "react-bootstrap";
import { logout } from "../managers/authManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavBar({ loggedInUser, setLoggedInUser }) {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <FontAwesomeIcon icon="fa-solid fa-book" className="me-2" />
          Personal Library
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {loggedInUser && (
              <>
                <Nav.Link as={NavLink} to="/catalogue">
                  <FontAwesomeIcon icon="search" className="me-1" />
                  Catalogue
                </Nav.Link>
                <Nav.Link as={NavLink} to="/bookshelves">
                  <FontAwesomeIcon icon="bookmark" className="me-1" />
                  Bookshelves
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {loggedInUser ? (
              <div className="d-flex align-items-center">
                <span className="me-3">Hello, {loggedInUser.username}</span>
                <Button
                  variant="outline-danger"
                  onClick={() => logout().then(() => setLoggedInUser(null))}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Nav.Link as={NavLink} to="/login">
                <Button variant="outline-primary">Login</Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
