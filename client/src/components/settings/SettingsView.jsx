import { useState } from "react";
import { Container, Nav, Tab, Row, Col } from "react-bootstrap";
import CategoriesManager from "./CategoriesManager";
import SeriesManager from "./SeriesManager";
import BookshelvesManager from "./BookshelvesManager";

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState("bookshelves");

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Settings</h2>
      
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="bookshelves">Bookshelves</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="categories">Categories</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="series">Series</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="bookshelves">
                <BookshelvesManager />
              </Tab.Pane>
              <Tab.Pane eventKey="categories">
                <CategoriesManager />
              </Tab.Pane>
              <Tab.Pane eventKey="series">
                <SeriesManager />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}