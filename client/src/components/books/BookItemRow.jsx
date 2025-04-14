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
    <tr>
      <td>
        {book.title}
        {book.subtitle && ` (${book.subtitle})`}
      </td>
      <td>{book.author || "Unknown"}</td>
      <td>
        {book.series_title && (
          <>
            {book.series_title}
            {book.volume_number && ` #${book.volume_number}`}
          </>
        )}
      </td>
      {showBookshelf && <td>{book.bookshelf_name || "None"}</td>}
      <td className="text-end">
        <Button
          variant="outline-primary"
          size="sm"
          className="me-2"
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
      </td>
    </tr>
  );
}
