import { useState } from "react";
import { Form } from "react-bootstrap";

export default function SeriesSelector({
  seriesList,
  selectedSeriesId,
  onChange,
  volumeNumber,
  onVolumeChange,
  onNewSeriesTitleChange, // Used to pass the title up to parent
}) {
  const [showNewSeries, setShowNewSeries] = useState(false);
  const [newSeriesTitle, setNewSeriesTitle] = useState("");

  const handleSeriesChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setShowNewSeries(true);
      onChange(null); // Clear any selected series
      // Pass empty string initially when switching to new series mode
      if (onNewSeriesTitleChange) {
        onNewSeriesTitleChange("");
      }
    } else {
      setShowNewSeries(false);
      onChange(value !== "" ? parseInt(value) : null);
      // Clear new series title when selecting existing series
      if (onNewSeriesTitleChange) {
        onNewSeriesTitleChange(null);
      }
    }
  };

  const handleNewSeriesTitleChange = (e) => {
    const title = e.target.value;
    setNewSeriesTitle(title);
    // Pass new title up to parent
    if (onNewSeriesTitleChange) {
      onNewSeriesTitleChange(title);
    }
  };

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Series</Form.Label>
        <Form.Select
          value={showNewSeries ? "new" : selectedSeriesId || ""}
          onChange={handleSeriesChange}
        >
          <option value="">Not part of a series</option>
          {seriesList.map((series) => (
            <option key={series.id} value={series.id}>
              {series.title}
            </option>
          ))}
          <option value="new">Other (Create New)</option>
        </Form.Select>
      </Form.Group>

      {(selectedSeriesId || showNewSeries) && (
        <Form.Group className="mb-3">
          <Form.Label>Volume Number</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={volumeNumber || ""}
            onChange={(e) =>
              onVolumeChange(e.target.value ? parseInt(e.target.value) : null)
            }
            placeholder="Volume number in series"
          />
        </Form.Group>
      )}

      {showNewSeries && (
        <Form.Group className="mb-3">
          <Form.Label>New Series Title</Form.Label>
          <Form.Control
            type="text"
            value={newSeriesTitle}
            onChange={handleNewSeriesTitleChange}
            placeholder="Enter series title"
          />
        </Form.Group>
      )}
    </>
  );
}
