import { useState, useEffect } from "react";
import {
  Offcanvas,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
  InputGroup,
} from "react-bootstrap";
import {
  searchBookByISBN,
  createBook,
  updateBook,
} from "../../managers/bookManager";
import { createCategory } from "../../managers/categoryManager";
import { createBookcase } from "../../managers/bookcaseManager";
import { createSeries } from "../../managers/seriesManager";
import SeriesSelector from "./SeriesSelector";
import CreateEntityModal from "../common/CreateEntityModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BookFormOffcanvas({
  show,
  onHide,
  bookId = null,
  bookcases = [],
  categories = [],
  seriesList = [],
  onSave,
  initialBookshelfId = null,
}) {
  // Form states
  const [isbn, setIsbn] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [bookshelfId, setBookshelfId] = useState(initialBookshelfId || "");
  const [categoryId, setCategoryId] = useState("");
  const [seriesId, setSeriesId] = useState(null);
  const [volumeNumber, setVolumeNumber] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [newSeriesTitle, setNewSeriesTitle] = useState(null);

  // Add state for modals
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddBookcase, setShowAddBookcase] = useState(false);

  // Add state for the lists of entities
  const [localBookcases, setLocalBookcases] = useState(bookcases);
  const [localCategories, setLocalCategories] = useState(categories);

  // Use useEffect to update local state when props change
  useEffect(() => {
    setLocalBookcases(bookcases);
  }, [bookcases]);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  // Search for book by ISBN
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!isbn || isbn.trim() === "") {
      setSearchError("Please enter an ISBN");
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const data = await searchBookByISBN(isbn.trim());
      if (!data || Object.keys(data).length === 0) {
        setSearchError("No book found with this ISBN");
        setBookData(null);
      } else {
        setBookData(data);
      }
    } catch (error) {
      console.error("Error searching for book:", error);
      setSearchError("Error searching for book");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle saving the book
  const handleSave = async () => {
    if (!bookData) {
      setFormError("Please search for a book first");
      return;
    }

    if (!bookshelfId) {
      setFormError("Please select a bookshelf");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      let finalSeriesId = seriesId;

      // If we have a new series title, create the series first
      if (newSeriesTitle && newSeriesTitle.trim()) {
        try {
          const createdSeries = await createSeries({
            title: newSeriesTitle.trim(),
          });
          if (createdSeries && createdSeries.id) {
            finalSeriesId = createdSeries.id;

            // Update parent component's series list
            if (onSave && seriesList) {
              onSave({
                seriesOnly: true,
                updatedSeriesList: [...seriesList, createdSeries],
              });
            }
          }
        } catch (error) {
          console.error("Error creating new series:", error);
          setFormError("Failed to create new series. Please try again.");
          setIsSaving(false);
          return;
        }
      }

      const bookPayload = {
        isbn: isbn,
        bookshelf: parseInt(bookshelfId),
        category: categoryId ? parseInt(categoryId) : null,
        series: finalSeriesId,
        volume_number: volumeNumber,
      };

      if (bookId) {
        // Update existing book
        bookPayload.id = bookId;
        await updateBook(bookPayload);
      } else {
        // Create new book
        await createBook(bookPayload);
      }

      onSave();
    } catch (error) {
      console.error("Error saving book:", error);
      setFormError("Error saving book");
      // Don't close on error - this is correct behavior to let the user retry
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form when closed
  const handleClose = () => {
    setIsbn("");
    setSearchError("");
    setBookData(null);
    setBookshelfId(initialBookshelfId || "");
    setCategoryId("");
    setSeriesId(null);
    setVolumeNumber(null);
    setNewSeriesTitle(null); // Reset new series title
    setFormError("");
    onHide();
  };

  // Handle new category creation
  const handleCreateCategory = async (name) => {
    const newCategory = await createCategory({ name });
    if (newCategory) {
      const updatedCategories = [...localCategories, newCategory];
      setLocalCategories(updatedCategories);
      setCategoryId(newCategory.id.toString());
      // Removed this call to onSave() which was causing the offcanvas to close
      // Might want to add it back in later?
      // if (onSave) {
      //   onSave();
      // }
    }
  };

  // Handle new bookcase creation
  const handleCreateBookcase = async (name) => {
    const newBookcase = await createBookcase({ name });
    if (newBookcase) {
      const updatedBookcases = [...localBookcases, newBookcase];
      setLocalBookcases(updatedBookcases);
      setBookshelfId(newBookcase.id.toString());
      // Remove this call to onSave() which was causing the offcanvas to close
      // if (onSave) {
      //   onSave();
      // }
    }
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      className="w-50"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {bookId ? "Edit Book" : "Add New Book"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* ISBN Search Form */}
        <Form onSubmit={handleSearch} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Search by ISBN</Form.Label>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="Enter ISBN"
                />
              </Col>
              <Col xs="auto">
                <Button type="submit" variant="primary" disabled={isSearching}>
                  {isSearching ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </Col>
            </Row>
            {searchError && (
              <Alert variant="danger" className="mt-2">
                {searchError}
              </Alert>
            )}
          </Form.Group>
        </Form>

        {/* Book Details */}
        {bookData && (
          <div className="mb-4">
            <div className="d-flex mb-3">
              {bookData.imageLinks?.thumbnail && (
                <img
                  src={bookData.imageLinks.thumbnail}
                  alt={bookData.title}
                  className="me-3"
                  style={{ maxWidth: "100px" }}
                />
              )}
              <div>
                <h4>{bookData.title}</h4>
                {bookData.subtitle && (
                  <p className="text-muted">{bookData.subtitle}</p>
                )}
                {bookData.authors && <p>By {bookData.authors.join(", ")}</p>}
              </div>
            </div>

            {bookData.description && (
              <div className="mb-3">
                <h5>Description</h5>
                <div
                  dangerouslySetInnerHTML={{ __html: bookData.description }}
                />
              </div>
            )}
          </div>
        )}

        {/* Book Form */}
        {bookData && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Bookshelf</Form.Label>
              <InputGroup>
                <Form.Select
                  value={bookshelfId}
                  onChange={(e) => setBookshelfId(e.target.value)}
                  required
                >
                  <option value="">Select a bookshelf</option>
                  {localBookcases.map((bookcase) => (
                    <option key={bookcase.id} value={bookcase.id}>
                      {bookcase.name}
                    </option>
                  ))}
                </Form.Select>
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowAddBookcase(true)}
                >
                  <FontAwesomeIcon icon="plus" />
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <InputGroup>
                <Form.Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {localCategories.map((category) => (
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
            </Form.Group>

            <SeriesSelector
              seriesList={seriesList}
              selectedSeriesId={seriesId}
              onChange={setSeriesId}
              volumeNumber={volumeNumber}
              onVolumeChange={setVolumeNumber}
              onNewSeriesTitleChange={setNewSeriesTitle}
            />

            {formError && (
              <Alert variant="danger" className="my-3">
                {formError}
              </Alert>
            )}

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Spinner animation="border" size="sm" />
                ) : bookId ? (
                  "Update"
                ) : (
                  "Add Book"
                )}
              </Button>
            </div>
          </Form>
        )}

        {/* Add Category Modal */}
        <CreateEntityModal
          show={showAddCategory}
          onHide={() => setShowAddCategory(false)}
          title="Add New Category"
          entityName="Category"
          onCreate={handleCreateCategory}
        />

        {/* Add Bookshelf Modal */}
        <CreateEntityModal
          show={showAddBookcase}
          onHide={() => setShowAddBookcase(false)}
          title="Add New Bookshelf"
          entityName="Bookshelf"
          onCreate={handleCreateBookcase}
        />
      </Offcanvas.Body>
    </Offcanvas>
  );
}
