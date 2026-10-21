import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

export default function SearchBar({ 
  searchTerm, 
  setSearchTerm, 
  itemsPerPage, 
  setItemsPerPage, 
  hasActiveClassification 
}) {
  return (
    <Row className="mb-4 justify-content-center align-items-center g-3">
      <Col md={5} lg={4}>
        <Form.Group controlId="inventorySearch">
          <Form.Control
            type="text"
            placeholder={hasActiveClassification ? "Search within these filtered results..." : "Search names, brands, suppliers, or collections..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 18px',
              borderRadius: '30px',
              border: '1px solid #ced4da',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)'
            }}
          />
        </Form.Group>
      </Col>
      <Col xs="auto" md={2}>
        <Form.Select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          style={{ borderRadius: '20px', padding: '10px 15px', cursor: 'pointer' }}
          className="text-muted small"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </Form.Select>
      </Col>
    </Row>
  );
}
