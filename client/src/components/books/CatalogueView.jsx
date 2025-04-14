import { useState, useEffect } from "react";
import { Container, Button, ButtonGroup, Spinner } from "react-bootstrap";
import { getBooks } from "../../managers/bookManager";
import { getBookcases, createBookcase } from "../../managers/bookcaseManager";
import { getCategories, createCategory } from "../../managers/categoryManager";
import { getAllSeries } from "../../managers/seriesManager";
import BookList from "./BookList";
import BookSearchForm from "./BookSearchForm";
import BookFormOffcanvas from "./BookFormOffcanvas";
import CreateEntityModal from "../common/CreateEntityModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BookDetailsModal from "./BookDetailsModal";
import EditBookModal from "./EditBookModal";

export default function CatalogueView() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookcases, setBookcases] = useState([]);
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [showAddBook, setShowAddBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Add state for modals
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddBookcase, setShowAddBookcase] = useState(false);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksData, bookcasesData, categoriesData, seriesData] =
          await Promise.all([
            getBooks(),
            getBookcases(),
            getCategories(),
            getAllSeries(),
          ]);

        setBooks(booksData || []);
        setFilteredBooks(booksData || []);
        setBookcases(bookcasesData || []);
        setCategories(categoriesData || []);
        setSeries(seriesData || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search/filter
  const handleSearch = (searchCriteria) => {
    let results = [...books];

    // Filter by title
    if (searchCriteria.title) {
      results = results.filter((book) =>
        book.google_data?.title
          ?.toLowerCase()
          .includes(searchCriteria.title.toLowerCase())
      );
    }

    // Filter by author
    if (searchCriteria.author) {
      results = results.filter((book) =>
        book.google_data?.authors?.some((author) =>
          author.toLowerCase().includes(searchCriteria.author.toLowerCase())
        )
      );
    }

    // Filter by series
    if (searchCriteria.seriesId) {
      results = results.filter(
        (book) => book.series === parseInt(searchCriteria.seriesId)
      );
    }

    // Filter by category
    if (searchCriteria.categoryId) {
      results = results.filter(
        (book) => book.category === parseInt(searchCriteria.categoryId)
      );
    }

    // Filter by bookcase
    if (searchCriteria.bookcaseId) {
      results = results.filter(
        (book) => book.bookshelf === parseInt(searchCriteria.bookcaseId)
      );
    }

    setFilteredBooks(results);
  };

  // Handle book added or updated
  const handleBookSaved = async () => {
    // Refresh all data when something changes
    try {
      const [booksData, bookcasesData, categoriesData, seriesData] =
        await Promise.all([
          getBooks(),
          getBookcases(),
          getCategories(),
          getAllSeries(),
        ]);

      setBooks(booksData || []);
      setFilteredBooks(booksData || []);
      setBookcases(bookcasesData || []);
      setCategories(categoriesData || []);
      setSeries(seriesData || []);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setShowAddBook(false);
  };

  // Handle new category creation
  const handleCreateCategory = async (name) => {
    const newCategory = await createCategory({ name });
    if (newCategory) {
      setCategories([...categories, newCategory]);
    }
  };

  // Handle new bookcase creation
  const handleCreateBookcase = async (name) => {
    const newBookcase = await createBookcase({ name });
    if (newBookcase) {
      setBookcases([...bookcases, newBookcase]);
    }
  };



  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowBookDetails(true);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>Book Catalogue</h2>
        <ButtonGroup>
          <Button
            variant="outline-secondary"
            onClick={() => setShowAddCategory(true)}
            className="me-2"
          >
            <FontAwesomeIcon icon="tags" className="me-2" />
            Add Category
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => setShowAddBookcase(true)}
            className="me-2"
          >
            <FontAwesomeIcon icon="bookmark" className="me-2" />
            Add Bookshelf
          </Button>
          <Button variant="primary" onClick={() => setShowAddBook(true)}>
            <FontAwesomeIcon icon="plus" className="me-2" />
            Add Book
          </Button>
        </ButtonGroup>
      </div>

      <BookSearchForm
        categories={categories}
        bookcases={bookcases}
        series={series}
        onSearch={handleSearch}
      />

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <BookList
          books={filteredBooks}
          onBookClick={handleBookClick}
          onEditClick={(book) => {
            setEditingBook(book);
          }}
          loading={loading}
        />
      )}

      <BookFormOffcanvas
        show={showAddBook}
        onHide={() => setShowAddBook(false)}
        bookcases={bookcases}
        categories={categories}
        seriesList={series}
        onSave={handleBookSaved}
      />

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

      {/* Edit Book Modal */}
      <EditBookModal
        book={editingBook}
        onHide={() => setEditingBook(null)}
        bookcases={bookcases}
        categories={categories}
        seriesList={series}
        onSave={handleBookSaved}
      />
    </Container>
  );
}
