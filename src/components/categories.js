import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { authContext } from './pages/auth-context'; // Adjust path if necessary
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const CategoriesPage = () => {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(authContext);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAndGroupItems = async () => {
      try {
        const inventoryCollection = collection(db, 'inventory');
        const q = query(inventoryCollection, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        // Group and count categories in real-time
        const counts = {};
        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          // Fallback to "Uncategorized" if the type string is empty
          const categoryName = data.type?.trim() || "Uncategorized";
          counts[categoryName] = (counts[categoryName] || 0) + 1;
        });

        setCategoryCounts(counts);
      } catch (err) {
        console.error("Error loading categories:", err);
        setError("Failed to compile categories list.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupItems();
  }, [user]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" style={{ color: '#ff69b4' }} />
        <p className="text-muted mt-2">Compiling your categories...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>
    );
  }

  const uniqueCategories = Object.keys(categoryCounts);

  return (
    <Container className="py-5">
      <h2 className="mb-2 text-center fw-bold" style={{ color: '#ff69b4' }}>Inventory Categories</h2>
      <p className="text-muted text-center mb-5">Browse your stock grouped by category labels</p>

      {uniqueCategories.length === 0 ? (
        <p className="text-center text-muted">No categorized items found in your inventory.</p>
      ) : (
        <Row className="g-4">
          {uniqueCategories.map((category) => (
            <Col key={category} xs={12} sm={6} md={4} lg={3}>
              {/* Clicking a card links directly to your already built dashboard filter routing */}
              <Link to={`/?category=${encodeURIComponent(category)}`} className="text-decoration-none">
                <Card className="h-100 shadow-sm border-0 category-card text-center p-4 bg-white rounded-3">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <div 
                      className="category-icon-bubble mb-3 d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: '#fff0f5', width: '70px', height: '70px', borderRadius: '50%' }}
                    >
                      {/* Fun placeholder graphic mapping based on word keywords */}
                      <span style={{ fontSize: '2rem' }}>
                        {category.toLowerCase().includes('foot') || category.toLowerCase().includes('shoe') ? '👟' : 
                         category.toLowerCase().includes('cloth') || category.toLowerCase().includes('dress') ? '👗' : 
                         category.toLowerCase().includes('access') || category.toLowerCase().includes('bag') ? '👜' : '📦'}
                      </span>
                    </div>
                    <Card.Title className="fw-bold text-dark text-capitalize mb-1">
                      {category}
                    </Card.Title>
                    <Card.Text className="text-muted small fw-medium">
                      {categoryCounts[category]} {categoryCounts[category] === 1 ? 'Item' : 'Items'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CategoriesPage;
