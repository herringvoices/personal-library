import { useState, useEffect } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { getAllSeries } from "../../managers/seriesManager";
import CreateEntityModal from "../common/CreateEntityModal";
import EditSeriesModal from "./EditSeriesModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SeriesManager() {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null);

  const loadSeries = async () => {
    setLoading(true);
    try {
      const data = await getAllSeries();
      setSeriesList(data || []);
      setError("");
    } catch (error) {
      console.error("Error loading series:", error);
      setError("Failed to load series");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeries();
  }, []);

  const handleCreateSeries = async (title) => {
    try {
      // The API call is made in CreateEntityModal component
      // After successful creation, refresh the list
      await loadSeries();
      return true;
    } catch (error) {
      console.error("Error creating series:", error);
      return false;
    }
  };

  const handleSeriesUpdated = () => {
    loadSeries();
    setEditingSeries(null);
  };

  if (loading && seriesList.length === 0) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
        <p>Loading series...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Series</h3>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FontAwesomeIcon icon="plus" className="me-2" /> Add Series
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {seriesList.length === 0 ? (
        <Alert variant="info">You don't have any series yet.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {seriesList.map((series) => (
              <tr key={series.id}>
                <td>{series.title}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => setEditingSeries(series)}
                  >
                    <FontAwesomeIcon icon="edit" /> Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modals */}
      <CreateEntityModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        title="Add New Series"
        entityName="Series" 
        onCreate={handleCreateSeries}
      />

      <EditSeriesModal
        series={editingSeries}
        onHide={() => setEditingSeries(null)}
        onSaved={handleSeriesUpdated}
      />
    </div>
  );
}