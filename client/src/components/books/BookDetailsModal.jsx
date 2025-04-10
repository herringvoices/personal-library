import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BookDetailsModal({ book, show, onHide, onEdit }) {
  if (!book) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{book.google_data?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex mb-4">
          <div className="me-4" style={{ minWidth: "150px" }}>
            {book.google_data?.imageLinks?.thumbnail ? (
              <img
                src={book.google_data.imageLinks.thumbnail}
                alt={book.google_data.title}
                className="img-fluid"
              />
            ) : (
              <div
                className="bg-light d-flex align-items-center justify-content-center"
                style={{ width: "128px", height: "192px" }}
              >
                <FontAwesomeIcon icon="book" size="3x" />
              </div>
            )}
          </div>
          <div>
            {book.google_data?.subtitle && (
              <h5 className="text-muted">{book.google_data.subtitle}</h5>
            )}
            {book.google_data?.authors && (
              <p className="mb-2">
                <strong>Author(s):</strong>{" "}
                {book.google_data.authors.join(", ")}
              </p>
            )}
            {book.series_title && (
              <p className="mb-2">
                <strong>Series:</strong> {book.series_title}
                {book.volume_number && ` #${book.volume_number}`}
              </p>
            )}
            <p className="mb-2">
              <strong>ISBN:</strong> {book.isbn}
            </p>
            <p className="mb-2">
              <strong>Shelf:</strong> {book.bookshelf_name}
            </p>
            {book.category_name && (
              <p className="mb-2">
                <strong>Category:</strong> {book.category_name}
              </p>
            )}
          </div>
        </div>

        {book.google_data?.description && (
          <div>
            <h5>Description</h5>
            <div
              dangerouslySetInnerHTML={{ __html: book.google_data.description }}
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {onEdit && (
          <Button variant="primary" onClick={() => onEdit(book)}>
            <FontAwesomeIcon icon="edit" className="me-2" />
            Edit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
