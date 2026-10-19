"use client";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState, useContext } from "react";
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { authContext } from "../pages/auth-context";

const CreateItem = () => {
  const [item, setItem] = useState("");
  const [type, setType] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [supplierLink, setSupplierLink] = useState("");

  const { user } = useContext(authContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    
    try {
      const docRef = await addDoc(collection(db, "inventory"), {
        item: item,
        type: type,
        photoURL: imageLink || null,
        supplierURL: supplierLink || null,
        uid: user.uid
      });
      console.log('Document written with ID: ', docRef.id);
      alert("Item successfully added!"); 
      navigate('/');
      
      setItem("");
      setType("");
      setImageLink("");
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border-0 p-4 bg-white rounded-3">
            <h2 className="mb-4 text-center fw-bold" style={{ color: '#ff69b4' }}>
              Add New Item
            </h2>
            
            <Form onSubmit={submit}>
              <Form.Group className="mb-3" controlId="formItemName">
                <Form.Label className="fw-semibold text-secondary">Item Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={item} 
                  onChange={(e) => setItem(e.target.value)} 
                  placeholder="e.g., Pink Sunglasses" 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formItemType">
                <Form.Label className="fw-semibold text-secondary">Type / Category</Form.Label>
                <Form.Control 
                  type="text" 
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  placeholder="e.g., Accessories" 
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
                  Paste any direct image web link to see a live visual card below.
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
                  Add Item
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

export default CreateItem;

