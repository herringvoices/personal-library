import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Breadcrumb,
  Spinner,
} from "react-bootstrap";
import { getBookcaseById } from "../../managers/bookcaseManager";
import { getBooksByBookcase } from "../../managers/bookManager";
import { getCategories } from "../../managers/categoryManager";
import { getAllSeries } from "../../managers/seriesManager";
import BookFormOffcanvas from "../books/BookFormOffcanvas";
import EditBookModal from "../books/EditBookModal";
import BookDetailsModal from "../books/BookDetailsModal";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BookshelfView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookshelf, setBookshelf] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookDetails, setShowBookDetails] = useState(false);

  // For forms
  const [categories, setCategories] = useState([]);
  const [seriesList, setSeriesList] = useState([]);

  // Load data when component mounts or id changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookshelfData, booksData, categoriesData, seriesData] =
          await Promise.all([
            getBookcaseById(id),
            getBooksByBookcase(id),
            getCategories(),
            getAllSeries(),
          ]);

        if (!bookshelfData) {
          setError("Bookshelf not found");
          return;
        }

        setBookshelf(bookshelfData);
        setBooks(booksData || []);
        setCategories(categoriesData || []);
        setSeriesList(seriesData || []);
      } catch (error) {
        console.error("Error loading bookshelf data:", error);
        setError("Failed to load bookshelf data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Group books by category
  const booksByCategory = books.reduce((acc, book) => {
    const categoryName = book.category_name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(book);
    return acc;
  }, {});

  // Handle book saved (new or updated)
  const handleBookSaved = async () => {
    try {
      const booksData = await getBooksByBookcase(id);
      setBooks(booksData || []);
    } catch (error) {
      console.error("Error refreshing books:", error);
    }
    setShowAddBook(false);
    setEditingBook(null);
  };

  // Handle book click to show details
  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowBookDetails(true);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p>Loading bookshelf...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/bookshelves" variant="primary">
          Back to Bookshelves
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/bookshelves" }}>
          Bookshelves
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{bookshelf?.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{bookshelf?.name}</h2>
        <Button variant="primary" onClick={() => setShowAddBook(true)}>
          <FontAwesomeIcon icon="plus" className="me-2" />
          Add Book
        </Button>
      </div>

      {books.length === 0 ? (
        <Alert variant="info">
          This bookshelf is empty. Add some books to get started!
        </Alert>
      ) : (
        Object.entries(booksByCategory).map(([category, categoryBooks]) => (
          <div key={category} className="mb-4">
            <h3>{category}</h3>
            <Row>
              {categoryBooks.map((book) => (
                <Col key={book.id} md={6} lg={4} className="mb-3">
                  <Card
                    className="h-100"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleBookClick(book)}
                  >
                    <div className="row g-0">
                      <div className="col-4">
                        {book.google_data?.imageLinks?.thumbnail ? (
                          <img
                            src={book.google_data.imageLinks.thumbnail}
                            alt={book.google_data.title}
                            className="card-img-top h-100 object-fit-cover"
                          />
                        ) : (
                          <div className="bg-light h-100 d-flex align-items-center justify-content-center">
                            <FontAwesomeIcon icon="book" size="3x" />
                          </div>
                        )}
                      </div>
                      <div className="col-8">
                        <div className="card-body position-relative">
                          <Button
                            variant="link"
                            className="position-absolute top-0 end-0 text-secondary p-0"
                            onClick={() => setEditingBook(book)}
                          >
                            <FontAwesomeIcon icon="edit" />
                          </Button>
                          <h5 className="card-title">
                            {book.google_data?.title}
                          </h5>
                          {book.google_data?.authors && (
                            <p className="card-text text-muted">
                              {book.google_data.authors.join(", ")}
                            </p>
                          )}
                          {book.series_title && (
                            <p className="card-text">
                              <small className="text-muted">
                                Series: {book.series_title}
                                {book.volume_number &&
                                  ` #${book.volume_number}`}
                              </small>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))
      )}

      {/* Add Book Offcanvas */}
      <BookFormOffcanvas
        show={showAddBook}
        onHide={() => setShowAddBook(false)}
        bookcases={[bookshelf].filter(Boolean)}
        categories={categories}
        seriesList={seriesList}
        onSave={handleBookSaved}
        initialBookshelfId={bookshelf?.id}
      />

      {/* Edit Book Modal */}
      <EditBookModal
        book={editingBook}
        onHide={() => setEditingBook(null)}
        bookcases={[bookshelf].filter(Boolean)}
        categories={categories}
        seriesList={seriesList}
        onSave={handleBookSaved}
      />

      {/* Book Details Modal */}
      <BookDetailsModal
        book={selectedBook}
        show={showBookDetails}
        onHide={() => setShowBookDetails(false)}
        onEdit={(book) => {
          setEditingBook(book);
          setShowBookDetails(false);
        }}
      />
    </Container>
  );
}
