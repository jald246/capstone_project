import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import { FiCheck } from "react-icons/fi";

const ItemEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState("");
  const [type, setType] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [supplierLink, setSupplierLink] = useState("");
  const [brand, setBrand] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [inStock, setInStock] = useState(true); 

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
          setBrand(data.brand || "");
          setCollectionName(data.collection || ""); 
          setSupplier(data.supplier || "");
          setInStock(data.inStock !== false); 
        }
      };
      fetchData().catch((error) => console.error(error));
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
        brand: brand || null,
        collection: collectionName || null, 
        supplier: supplier || null,
        inStock: inStock
      });
      navigate("/inventory"); 
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border-0 p-4 bg-white rounded-3">
            <h2 className="mb-4 text-center fw-bold" style={{ color: '#ff69b4' }}>Edit Item</h2>
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3" controlId="formItemName">
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Item Name</Form.Label>
                <Form.Control type="text" value={item} onChange={(e) => setItem(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formItemType">
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Type</Form.Label>
                <Form.Control type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g., Cat Eye Polish, Gel Polish, 3D Gel" required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formItemBrand">
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Product Brand</Form.Label>
                <Form.Control type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g., DOI, Yogurt Gel, Mia Secrets" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formItemCollection">
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Product Collection Group</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g., BunnyChu, Fruit Syrup" 
                  value={collectionName} 
                  onChange={(e) => setCollectionName(e.target.value)} 
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="imageLink">
                <Form.Label className="fw-semibold" style={{ color: '#ff69b4' }}>Image Preview URL Link</Form.Label>
                <Form.Control type="url" value={imageLink} onChange={(e) => setImageLink(e.target.value)} />
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
                <Form.Control type="url" value={supplierLink} onChange={(e) => setSupplierLink(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formItemInStockEdit">
                <Form.Check 
                  type="switch"
                  id="in-stock-switch-edit"
                  label={inStock ? "Item is Active & In Stock" : "Item is Out of Stock / Unstocked"}
                  checked={inStock}
                  className="fw-semibold custom-stock-switch" style={{ color: '#ff69b4' }}
                  onChange={(e) => setInStock(e.target.checked)}
                />
              </Form.Group>

              <div className="d-flex gap-3 mt-4">
                <Button type="submit" className="w-100 fw-bold shadow-sm d-inline-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#ff69b4', borderColor: '#ff69b4' }}>
                  <span>Save Changes</span>
                  <FiCheck size={18} />
                </Button>
                <Button type="button" onClick={() => navigate('/inventory')} variant="outline-danger" className="w-100 fw-semibold">Cancel</Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemEdit;


