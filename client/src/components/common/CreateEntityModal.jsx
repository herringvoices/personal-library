import { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

export default function CreateEntityModal({
  show,
  onHide,
  title,
  entityName,
  onCreate,
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleClose = () => {
    setName("");
    setError("");
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(`Please enter a ${entityName} name`);
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      await onCreate(name);
      handleClose();
    } catch (error) {
      console.error(`Error creating ${entityName}:`, error);
      setError(`Failed to create ${entityName}. Please try again.`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group>
            <Form.Label>{entityName} Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${entityName.toLowerCase()} name`}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isCreating}>
            {isCreating ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Creating...
              </>
            ) : (
              `Create ${entityName}`
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
