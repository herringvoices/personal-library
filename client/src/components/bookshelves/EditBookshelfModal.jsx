import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { updateBookcase, deleteBookcase } from "../../managers/bookcaseManager";

export default function EditBookshelfModal({ bookshelf, onHide, onSaved }) {
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Set initial values when bookshelf changes
  useEffect(() => {
    if (bookshelf) {
      setName(bookshelf.name);
      setError("");
      setShowDeleteConfirm(false);
    }
  }, [bookshelf]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      await updateBookcase({
        id: bookshelf.id,
        name: name.trim(),
      });

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error("Error updating bookshelf:", error);
      setError("Failed to update bookshelf. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    setError("");

    try {
      await deleteBookcase(bookshelf.id);

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error("Error deleting bookshelf:", error);
      setError("Failed to delete bookshelf. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookshelf) return null;

  return (
    <Modal show={!!bookshelf} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Bookshelf</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {!showDeleteConfirm ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Bookshelf Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter bookshelf name"
              />
            </Form.Group>
          </Form>
        ) : (
          <Alert variant="danger">
            <p>Are you sure you want to delete this bookshelf?</p>
            <p>
              <strong>This will delete all books in this bookshelf!</strong>
            </p>
            <p>This action cannot be undone.</p>
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!showDeleteConfirm ? (
          <>
            <Button
              variant="danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isProcessing}
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={onHide}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
