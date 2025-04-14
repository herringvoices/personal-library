import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { updateBook, deleteBook } from "../../managers/bookManager";
import { createCategory } from "../../managers/categoryManager";
import SeriesSelector from "./SeriesSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EditBookModal({
  book,
  onHide,
  bookcases = [],
  categories = [],
  seriesList = [],
  onSave,
}) {
  const [bookshelfId, setBookshelfId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [seriesId, setSeriesId] = useState(null);
  const [volumeNumber, setVolumeNumber] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Update form state when book changes
  useEffect(() => {
    if (book) {
      setBookshelfId(book.bookshelf?.toString() || "");
      setCategoryId(book.category?.toString() || "");
      setSeriesId(book.series || null);
      setVolumeNumber(book.volume_number || null);
      setError("");
      setShowDeleteConfirm(false);
    }
  }, [book]);

  const handleSave = async () => {
    if (!bookshelfId) {
      setError("Please select a bookshelf");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      await updateBook({
        id: book.id,
        isbn: book.isbn,
        title: book.title,
        subtitle: book.subtitle,
        author: book.author,
        bookshelf: parseInt(bookshelfId),
        category: categoryId ? parseInt(categoryId) : null,
        series: seriesId,
        volume_number: volumeNumber,
      });

      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("Error updating book:", error);
      setError("Failed to update book. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    setError("");

    try {
      await deleteBook(book.id);

      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      setError("Failed to delete book. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsProcessing(true);
    try {
      const newCategory = await createCategory({
        name: newCategoryName.trim(),
      });
      if (newCategory) {
        setCategoryId(newCategory.id.toString());
        setShowAddCategory(false);
        setNewCategoryName("");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setError("Failed to create category. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!book) return null;

  return (
    <Modal show={!!book} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {showDeleteConfirm ? (
          <Alert variant="danger">
            <p>Are you sure you want to delete this book?</p>
            <p>This action cannot be undone.</p>
          </Alert>
        ) : (
          <>
            <div className="mb-4 d-flex">
              {book.google_data?.imageLinks?.thumbnail && (
                <img
                  src={book.google_data.imageLinks.thumbnail}
                  alt={book.title}
                  style={{ width: "100px" }}
                  className="me-3"
                />
              )}
              <div>
                <h4>{book.title}</h4>
                {book.subtitle && <p>{book.subtitle}</p>}
                <p className="text-muted">By {book.author}</p>
              </div>
            </div>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Bookshelf</Form.Label>
                <Form.Select
                  value={bookshelfId}
                  onChange={(e) => setBookshelfId(e.target.value)}
                  required
                >
                  <option value="">Select a bookshelf</option>
                  {bookcases.map((bookcase) => (
                    <option key={bookcase.id} value={bookcase.id}>
                      {bookcase.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                {showAddCategory ? (
                  <InputGroup>
                    <Form.Control
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter new category name"
                    />
                    <Button
                      variant="outline-success"
                      onClick={handleCreateCategory}
                      disabled={!newCategoryName.trim() || isProcessing}
                    >
                      Create
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        setShowAddCategory(false);
                        setNewCategoryName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </InputGroup>
                ) : (
                  <InputGroup>
                    <Form.Select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value="">No category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowAddCategory(true)}
                    >
                      <FontAwesomeIcon icon="plus" />
                    </Button>
                  </InputGroup>
                )}
              </Form.Group>

              <SeriesSelector
                seriesList={seriesList}
                selectedSeriesId={seriesId}
                onChange={setSeriesId}
                volumeNumber={volumeNumber}
                onVolumeChange={setVolumeNumber}
              />
            </Form>
          </>
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
