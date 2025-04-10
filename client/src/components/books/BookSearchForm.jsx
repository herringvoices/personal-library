import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function BookSearchForm({
  categories,
  bookcases,
  series,
  onSearch,
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [bookcaseId, setBookcaseId] = useState("");
  const [seriesId, setSeriesId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      title,
      author,
      categoryId,
      bookcaseId,
      seriesId,
    });
  };

  const handleReset = () => {
    setTitle("");
    setAuthor("");
    setCategoryId("");
    setBookcaseId("");
    setSeriesId("");
    onSearch({}); // Reset to show all books
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-light">
      <Row className="mb-3">
        <Form.Group as={Col} md={6}>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Search by title"
          />
        </Form.Group>
        <Form.Group as={Col} md={6}>
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Search by author"
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md={4}>
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Bookshelf</Form.Label>
          <Form.Select
            value={bookcaseId}
            onChange={(e) => setBookcaseId(e.target.value)}
          >
            <option value="">All Bookshelves</option>
            {bookcases.map((bookcase) => (
              <option key={bookcase.id} value={bookcase.id}>
                {bookcase.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md={4}>
          <Form.Label>Series</Form.Label>
          <Form.Select
            value={seriesId}
            onChange={(e) => setSeriesId(e.target.value)}
          >
            <option value="">All Series</option>
            {series.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>
      <div className="d-flex gap-2">
        <Button type="submit" variant="primary">
          Search
        </Button>
        <Button type="button" variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </Form>
  );
}
