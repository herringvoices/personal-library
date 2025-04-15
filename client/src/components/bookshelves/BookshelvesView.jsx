import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getBookcases, createBookcase } from "../../managers/bookcaseManager";
import CreateEntityModal from "../common/CreateEntityModal";
import EditBookshelfModal from "./EditBookshelfModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BookshelvesView() {
  const [bookshelves, setBookshelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBookshelf, setEditBookshelf] = useState(null);

  // Load bookshelves data
  useEffect(() => {
    const loadBookshelves = async () => {
      setLoading(true);
      try {
        const data = await getBookcases();
        setBookshelves(data || []);
      } catch (error) {
        console.error("Error loading bookshelves:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookshelves();
  }, []);

  // Handle bookshelf creation
  const handleCreateBookshelf = async (name) => {
    try {
      // First create the new bookshelf
      await createBookcase({ name });

      // Then refresh the list
      const updatedBookshelves = await getBookcases();
      setBookshelves(updatedBookshelves || []);
      return true;
    } catch (error) {
      console.error("Error creating bookshelf:", error);
      return false;
    }
  };

  // Handle updates after edit/delete
  const handleBookshelfUpdated = async () => {
    const data = await getBookcases();
    setBookshelves(data || []);
    setEditBookshelf(null);
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <h2>Your Bookshelves</h2>
        <p>Loading bookshelves...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Bookshelves</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FontAwesomeIcon icon="plus" className="me-2" />
          Add Bookshelf
        </Button>
      </div>

      {bookshelves.length === 0 ? (
        <p>You don't have any bookshelves yet. Create one to get started!</p>
      ) : (
        <Row>
          {bookshelves.map((bookshelf) => (
            <Col key={bookshelf.id} md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <Card.Title>{bookshelf.name}</Card.Title>
                    <Button
                      variant="link"
                      className="p-0 text-secondary"
                      onClick={() => setEditBookshelf(bookshelf)}
                    >
                      <FontAwesomeIcon icon="edit" />
                    </Button>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0">
                  <Button
                    as={Link}
                    to={`/bookshelves/${bookshelf.id}`}
                    variant="outline-primary"
                    className="w-100"
                  >
                    View Books
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modals */}
      <CreateEntityModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        title="Add New Bookshelf"
        entityName="Bookshelf"
        onCreate={handleCreateBookshelf}
      />

      <EditBookshelfModal
        bookshelf={editBookshelf}
        onHide={() => setEditBookshelf(null)}
        onSaved={handleBookshelfUpdated}
      />
    </Container>
  );
}
