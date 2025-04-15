import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { updateCategory, deleteCategory } from "../../managers/categoryManager";

export default function EditCategoryModal({ category, onHide, onSaved }) {
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setError("");
      setShowDeleteConfirm(false);
    }
  }, [category]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      await updateCategory({
        id: category.id,
        name: name.trim(),
      });

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Failed to update category. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    setError("");

    try {
      await deleteCategory(category.id);

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!category) return null;

  return (
    <Modal show={!!category} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {!showDeleteConfirm ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
              />
            </Form.Group>
          </Form>
        ) : (
          <Alert variant="danger">
            <p>Are you sure you want to delete this category?</p>
            <p>Books with this category will have their category removed.</p>
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
            <Button variant="secondary" onClick={onHide} disabled={isProcessing}>
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