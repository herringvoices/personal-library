import { useState, useEffect } from "react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { getCategories, deleteCategory } from "../../managers/categoryManager";
import CreateEntityModal from "../common/CreateEntityModal";
import EditCategoryModal from "./EditCategoryModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data || []);
      setError("");
    } catch (error) {
      console.error("Error loading categories:", error);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (name) => {
    try {
      // The API call is made in CreateEntityModal component
      // After successful creation, refresh the list
      await loadCategories();
      return true;
    } catch (error) {
      console.error("Error creating category:", error);
      return false;
    }
  };

  const handleCategoryUpdated = () => {
    loadCategories();
    setEditingCategory(null);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" />
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Categories</h3>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FontAwesomeIcon icon="plus" className="me-2" /> Add Category
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {categories.length === 0 ? (
        <Alert variant="info">You don't have any categories yet.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => setEditingCategory(category)}
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
        title="Add New Category"
        entityName="Category"
        onCreate={handleCreateCategory}
      />

      <EditCategoryModal
        category={editingCategory}
        onHide={() => setEditingCategory(null)}
        onSaved={handleCategoryUpdated}
      />
    </div>
  );
}