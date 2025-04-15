import React from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import BookItemRow from "./BookItemRow";

export default function BookTable({
  books,
  loading = false,
  showBookshelf = true,
  onBookDetailsClick,
  onBookEditClick,
}) {
  // Sort books by sort_key
  const sortedBooks = books
    ? [...books].sort((a, b) => {
        if (!a.sort_key || !b.sort_key) return 0;

        // Compare each element of the sort_key array
        for (
          let i = 0;
          i < Math.min(a.sort_key.length, b.sort_key.length);
          i++
        ) {
          if (a.sort_key[i] < b.sort_key[i]) return -1;
          if (a.sort_key[i] > b.sort_key[i]) return 1;
        }
        return 0;
      })
    : [];

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return <Alert variant="info">No books found.</Alert>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th style={{ width: "60px" }}></th> {/* Thumbnail column */}
          <th>Title</th>
          <th>Author</th>
          <th>Series</th>
          <th>Category</th> 
          {showBookshelf && <th>Bookshelf</th>}
          <th className="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedBooks.map((book) => (
          <BookItemRow
            key={book.id}
            book={book}
            showBookshelf={showBookshelf}
            onDetailsClick={onBookDetailsClick}
            onEditClick={onBookEditClick}
          />
        ))}
      </tbody>
    </Table>
  );
}
