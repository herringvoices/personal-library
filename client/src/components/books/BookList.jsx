import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BookList({ books, onBookClick }) {
  if (!books || books.length === 0) {
    return <p>No books found.</p>;
  }

  // Group books by category
  const booksByCategory = books.reduce((acc, book) => {
    const categoryName = book.category_name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(book);
    return acc;
  }, {});

  return (
    <div className="my-4">
      {Object.entries(booksByCategory).map(([category, categoryBooks]) => (
        <div key={category} className="mb-4">
          <h3>{category}</h3>
          <div className="row">
            {categoryBooks.map((book) => (
              <div key={book.id} className="col-md-6 col-lg-4 mb-3">
                <div
                  className="card h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => onBookClick && onBookClick(book)}
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
                      <div className="card-body">
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
                              {book.volume_number && ` #${book.volume_number}`}
                            </small>
                          </p>
                        )}
                        <p className="card-text">
                          <small className="text-muted">
                            Shelf: {book.bookshelf_name}
                          </small>
                        </p>
                        <Button
                          as={Link}
                          to={`/books/${book.id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
