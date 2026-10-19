import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; 

const ItemEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState("");
  const [type, setType] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [supplierLink, setSupplierLink] = useState("");

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const docRef = doc(db, "inventory", id); 
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setItem(data.item || "");
          setType(data.type || "");
          setImageLink(data.photoURL || ""); 
          setSupplierLink(data.supplierURL || "");
        } else {
          console.error("Item not found");
        }
      };
      fetchData().catch((error) => console.error("Error fetching:", error));
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "inventory", id);
      await updateDoc(docRef, {
        item: item,
        type: type,
        photoURL: imageLink || null,
        supplierURL: supplierLink || null,
      });
      console.log("Item updated successfully!");
      navigate("/"); 
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border-0 p-4 bg-white rounded-3">
            <h2 className="mb-4 text-center fw-bold" style={{ color: '#ff69b4' }}>
              Edit Item
            </h2>
            
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3" controlId="formItemName">
                <Form.Label className="fw-semibold text-secondary">Item Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={item} 
                  onChange={(e) => setItem(e.target.value)} 
                  placeholder="Item Name" 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formItemType">
                <Form.Label className="fw-semibold text-secondary">Type / Category</Form.Label>
                <Form.Control 
                  type="text" 
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  placeholder="Type" 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="imageLink">
                <Form.Label className="fw-semibold text-secondary">Image Preview URL Link</Form.Label>
                <Form.Control 
                  type="url" 
                  placeholder="https://example.com" 
                  value={imageLink}
                  onChange={(e) => setImageLink(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Update or paste a direct image web link to see a live visual card below.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-4" controlId="supplierLink">
                <Form.Label className="fw-semibold text-secondary">Supplier Website URL</Form.Label>
                <Form.Control 
                    type="url" 
                    placeholder="https://supplier-website.com" 
                    value={supplierLink}
                    onChange={(e) => setSupplierLink(e.target.value)}
                />
                </Form.Group>

              {imageLink && (
                <div className="mb-4 text-center">
                  <p className="text-muted small mb-2 fw-medium">Live Image Preview:</p>
                  <Card className="mx-auto shadow-sm border-0" style={{ maxWidth: '240px', overflow: 'hidden' }}>
                    <Card.Img 
                      variant="top" 
                      src={imageLink} 
                      alt="Preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="p-2 bg-light">
                      <small className="text-truncate d-block text-muted fw-bold">
                        {item || "Untitled Item"}
                      </small>
                    </Card.Body>
                  </Card>
                </div>
              )}

              <div className="d-flex gap-3 mt-4">
                <Button 
                  type="submit" 
                  className="w-100 fw-bold shadow-sm"
                  style={{ backgroundColor: '#ff69b4', borderColor: '#ff69b4' }}
                >
                  Save Changes
                </Button>
                
                <Button  
                  type="button" 
                  onClick={() => navigate('/')} 
                  variant="outline-danger" 
                  className="w-100 fw-semibold"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemEdit;
