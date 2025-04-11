import React from "react";
import BookTable from "./BookTable";

export default function BookList({
  books,
  onBookClick,
  onEditClick,
  loading = false,
}) {
  return (
    <BookTable
      books={books}
      loading={loading}
      onBookDetailsClick={onBookClick}
      onBookEditClick={onEditClick}
    />
  );
}
