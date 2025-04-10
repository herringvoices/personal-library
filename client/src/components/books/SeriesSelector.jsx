import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { createSeries } from "../../managers/seriesManager";

export default function SeriesSelector({
  seriesList,
  selectedSeriesId,
  onChange,
  volumeNumber,
  onVolumeChange,
}) {
  const [showNewSeries, setShowNewSeries] = useState(false);
  const [newSeriesTitle, setNewSeriesTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSeriesChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setShowNewSeries(true);
    } else {
      setShowNewSeries(false);
      onChange(value !== "" ? parseInt(value) : null);
    }
  };

  const handleCreateSeries = async () => {
    if (!newSeriesTitle.trim()) return;

    setIsCreating(true);
    try {
      const newSeries = await createSeries({ title: newSeriesTitle });
      if (newSeries && newSeries.id) {
        onChange(newSeries.id);
        setShowNewSeries(false);
        setNewSeriesTitle("");
      }
    } catch (error) {
      console.error("Error creating series:", error);
    } finally {
      setIsCreating(false);
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
          <InputGroup>
            <Form.Control
              type="text"
              value={newSeriesTitle}
              onChange={(e) => setNewSeriesTitle(e.target.value)}
              placeholder="Enter series title"
            />
            <Button
              variant="outline-success"
              onClick={handleCreateSeries}
              disabled={!newSeriesTitle.trim() || isCreating}
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </InputGroup>
        </Form.Group>
      )}
    </>
  );
}
