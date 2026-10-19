import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { doc, getDoc, deleteDoc } from 'firebase/firestore'; 
import { db } from '../firebase'; 
import { BiSolidCategory } from "react-icons/bi";

const ItemDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState("");
  const [imageLink, setImageLink] = useState(""); 

  useEffect(() => {
    const fetchItem = async () => {
      if (id) {
        try {
          const docRef = doc(db, "inventory", id);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            const data = snapshot.data();
            setItem(data.item || "");
            setImageLink(data.photoURL || ""); 
          } else {
            console.error("Item not found");
          }
        } catch (error) {
          console.error("Error fetching:", error);
        }
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "inventory", id);
      await deleteDoc(docRef); 
      console.log("Item deleted successfully!");
      navigate('/');
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border-0 p-4 bg-white rounded-3 text-center">
            <h2 className="mb-3 fw-bold text-dark" style={{ fontSize: '1.5rem' }}>
              Are you sure you want to delete this item?
            </h2>
            <p className="text-muted small mb-4">This action cannot be undone.</p>

            <Card className="mx-auto mb-4 shadow-sm border-0" style={{ maxWidth: '240px', overflow: 'hidden' }}>
              {imageLink ? (
                <Card.Img 
                  variant="top" 
                  src={imageLink} 
                  alt={item}
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
              ) : (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '150px' }}>
                  <span className="text-muted tracking-wide" style={{ fontSize: '2.5rem' }}><BiSolidCategory /></span>
                </div>
              )}
              <Card.Body className="p-3 bg-light border-top">
                <h5 className="mb-0 text-truncate fw-bold text-secondary">
                  {item || "Untitled Item"}
                </h5>
              </Card.Body>
            </Card>

            <div className="d-flex gap-3 justify-content-center">
              <Button 
                onClick={handleDelete} 
                variant="danger"
                className="w-100 fw-bold shadow-sm"
              >
                Confirm Delete
              </Button>
              
              <Button  
                type="button" 
                onClick={() => navigate('/')} 
                variant="outline-secondary" 
                className="w-100 fw-semibold"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemDelete;
