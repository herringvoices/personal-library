import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { updateSeries, deleteSeries } from "../../managers/seriesManager";

export default function EditSeriesModal({ series, onHide, onSaved }) {
  const [title, setTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (series) {
      setTitle(series.title);
      setError("");
      setShowDeleteConfirm(false);
    }
  }, [series]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      await updateSeries({
        id: series.id,
        title: title.trim(),
      });

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error("Error updating series:", error);
      setError("Failed to update series. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    setError("");

    try {
      await deleteSeries(series.id);

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error("Error deleting series:", error);
      setError("Failed to delete series. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!series) return null;

  return (
    <Modal show={!!series} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Series</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {!showDeleteConfirm ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Series Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter series title"
              />
            </Form.Group>
          </Form>
        ) : (
          <Alert variant="danger">
            <p>Are you sure you want to delete this series?</p>
            <p>Books in this series will no longer be associated with it.</p>
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