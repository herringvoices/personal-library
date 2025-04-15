import { useState, useEffect } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { getBookcases } from "../../managers/bookcaseManager";
import CreateEntityModal from "../common/CreateEntityModal";
import EditBookshelfModal from "../bookshelves/EditBookshelfModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function BookshelvesManager() {
  const [bookshelves, setBookshelves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBookshelf, setEditingBookshelf] = useState(null);

  const loadBookshelves = async () => {
    setLoading(true);
    try {
      const data = await getBookcases();
      setBookshelves(data || []);
      setError("");
    } catch (error) {
      console.error("Error loading bookshelves:", error);
      setError("Failed to load bookshelves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookshelves();
  }, []);

  const handleCreateBookshelf = async (name) => {
    try {
      // The API call is made in CreateEntityModal component
      // After successful creation, refresh the list
      await loadBookshelves();
      return true;
    } catch (error) {
      console.error("Error creating bookshelf:", error);
      return false;
    }
  };

  const handleBookshelfUpdated = () => {
    loadBookshelves();
    setEditingBookshelf(null);
  };

  if (loading && bookshelves.length === 0) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
        <p>Loading bookshelves...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Bookshelves</h3>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FontAwesomeIcon icon="plus" className="me-2" /> Add Bookshelf
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {bookshelves.length === 0 ? (
        <Alert variant="info">You don't have any bookshelves yet.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: "220px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookshelves.map((bookshelf) => (
              <tr key={bookshelf.id}>
                <td>{bookshelf.name}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/bookshelves/${bookshelf.id}`}
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                  >
                    <FontAwesomeIcon icon="eye" /> View
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setEditingBookshelf(bookshelf)}
                  >
                    <FontAwesomeIcon icon="edit" /> Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
        bookshelf={editingBookshelf}
        onHide={() => setEditingBookshelf(null)}
        onSaved={handleBookshelfUpdated}
      />
    </div>
  );
}