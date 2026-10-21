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
  const [brand, setBrand] = useState('');
  const [collectionName, setCollectionName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [inStock, setInStock] = useState(true); 

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
        brand: brand || null,
        collectionName: collectionName || null,
        supplier: supplier || null,
        inStock: inStock,
        uid: user.uid
      });
      console.log('Document written with ID: ', docRef.id);
      alert("Item successfully added!"); 
      
      setItem("");
      setType("");
      setBrand("");
      setCollectionName("");
      setSupplier("");
      setInStock("");

      setImageLink("");
      setSupplierLink("");
      
      navigate('/inventory');
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
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Item Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={item} 
                  onChange={(e) => setItem(e.target.value)} 
                  placeholder="e.g., MG.11, Pink Nude, Syrup 20" 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formItemType">
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Type</Form.Label>
                <Form.Control 
                  type="text" 
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  placeholder="e.g., Cat Eye Polish, Gel Polish, 3D Gel"
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formItemBrand">
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Product Brand</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g., DOI, Yogurt Gel, Mia Secrets" 
                  value={brand} 
                  onChange={(e) => setBrand(e.target.value)} 
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formItemCollection">
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Product Collection Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g., BunnyChu, Fruit Syrup, Bubble Magnet" 
                  value={collectionName} 
                  onChange={(e) => setCollectionName(e.target.value)} 
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="imageLink">
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Image Preview URL Link</Form.Label>
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

              <Form.Group className="mb-3" controlId="formItemSupplier">
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Supplier Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g., Sweetie Nail Supply, Zillabeau, Amazon" 
                  value={supplier} 
                  onChange={(e) => setSupplier(e.target.value)} 
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="supplierLink">
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Supplier Website URL</Form.Label>
                <Form.Control 
                    type="url" 
                    placeholder="https://supplier-website.com" 
                    value={supplierLink}
                    onChange={(e) => setSupplierLink(e.target.value)}
                />
              </Form.Group>
              
               <Form.Group className="mb-4" controlId="formItemInStock">
                <Form.Check 
                  type="switch"
                  id="in-stock-switch-create"
                  label={inStock ? "Item is Active & In Stock" : "Item is Out of Stock / Unstocked"}
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="fw-semibold custom-stock-switch" 
                  style={{ cursor: 'pointer', color: '#ff69b4' }}
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
                  onClick={() => navigate('/inventory')} 
                  style={{ backgroundColor: '#ff69b4', borderColor: '#ff69b4' }}
                >
                  Add Item
                </Button>
                
                <Button  
                  type="button" 
                  onClick={() => navigate('/inventory')} 
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


