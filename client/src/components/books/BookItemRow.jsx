import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BookItemRow({
  book,
  showBookshelf = true,
  onDetailsClick,
  onEditClick,
}) {
  if (!book) return null;

  return (
    <tr style={{ fontSize: "1.1rem" }}>
      <td className="text-center align-middle">
        {book.small_thumbnail ? (
          <img
            src={book.small_thumbnail}
            alt={book.title}
            style={{ width: "70px", height: "auto", maxHeight: "100px" }}
            className="my-1"
          />
        ) : (
          <div
            className="bg-light d-flex align-items-center justify-content-center"
            style={{ width: "70px", height: "100px", margin: "0 auto" }}
          >
            <FontAwesomeIcon icon="book" />
          </div>
        )}
      </td>
      <td className="align-middle">
        {book.title}
        {book.subtitle && ` (${book.subtitle})`}
      </td>
      <td className="align-middle">{book.author || "Unknown"}</td>
      <td className="align-middle">
        {book.series_title && (
          <>
            {book.series_title}
            {book.volume_number && ` #${book.volume_number}`}
          </>
        )}
      </td>
      <td className="align-middle">{book.category_name || "Uncategorized"}</td>
      {showBookshelf && (
        <td className="align-middle">{book.bookshelf_name || "None"}</td>
      )}
      <td className="text-end align-middle">
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onDetailsClick && onDetailsClick(book)}
          >
            <FontAwesomeIcon icon="eye" className="me-1" /> Details
          </Button>
          {onEditClick && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => onEditClick && onEditClick(book)}
            >
              <FontAwesomeIcon icon="edit" className="me-1" /> Edit
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
