import { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getBookById } from "../../managers/bookManager";

export default function BookDetailsModal({ book, show, onHide, onEdit }) {
  const [detailedBook, setDetailedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch detailed book information when modal opens
  useEffect(() => {
    if (show && book?.id) {
      setLoading(true);
      setError(null);
      getBookById(book.id)
        .then((data) => {
          if (data) {
            setDetailedBook(data);
          } else {
            setError("Could not load book details");
          }
        })
        .catch((err) => {
          console.error("Error fetching book details:", err);
          setError("Error loading book details");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [show, book]);

  // Clean up state when modal closes
  useEffect(() => {
    if (!show) {
      setDetailedBook(null);
      setError(null); // Also reset error state
    }
  }, [show]);

  // Show loading spinner while fetching details
  if (!book) return null;

  // The book to display is either the detailed version or the original book as fallback
  const displayBook = detailedBook || book;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{loading ? "Loading..." : displayBook.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" />
            <p className="mt-2">Loading book details...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="d-flex mb-4">
            <div className="me-4" style={{ minWidth: "150px" }}>
              {displayBook.google_data?.imageLinks?.thumbnail ? (
                <img
                  src={displayBook.google_data.imageLinks.thumbnail}
                  alt={displayBook.title}
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
              {displayBook.subtitle && (
                <h5 className="text-muted">{displayBook.subtitle}</h5>
              )}
              <p className="mb-2">
                <strong>Author:</strong> {displayBook.author}
              </p>
              {displayBook.series_title && (
                <p className="mb-2">
                  <strong>Series:</strong> {displayBook.series_title}
                  {displayBook.volume_number &&
                    ` #${displayBook.volume_number}`}
                </p>
              )}
              <p className="mb-2">
                <strong>ISBN:</strong> {displayBook.isbn}
              </p>
              <p className="mb-2">
                <strong>Shelf:</strong> {displayBook.bookshelf_name}
              </p>
              {displayBook.category_name && (
                <p className="mb-2">
                  <strong>Category:</strong> {displayBook.category_name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Only show description if google data is available and not loading */}
        {!loading && displayBook.google_data?.description && (
          <div>
            <h5>Description</h5>
            <div
              dangerouslySetInnerHTML={{
                __html: displayBook.google_data.description,
              }}
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {onEdit && !loading && (
          <Button variant="primary" onClick={() => onEdit(displayBook)}>
            <FontAwesomeIcon icon="edit" className="me-2" />
            Edit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
