import React, { useContext, useEffect, useState } from 'react';
import { authContext } from './pages/auth-context';
import { Link, useSearchParams } from 'react-router-dom'; 
import { Card, Container, Spinner, Alert, Table } from "react-bootstrap";
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { CiShop } from "react-icons/ci";

const ItemListView = () => {
  const [itemsList, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(authContext);
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchItems = async () => {
      try {
        const inventoryCollection = collection(db, 'inventory');
        const q = query(inventoryCollection, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user]);

  const displayedItems = activeCategory
    ? itemsList.filter(item => item.type?.toLowerCase() === activeCategory.toLowerCase())
    : itemsList;

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" style={{ color: '#ff69b4' }} />
        <p className="text-muted mt-2">Loading items...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className='body py-4'>
      <Container>
        <h2 className="mb-4 text-center fw-bold" style={{ color: '#ff69b4' }}>
          {activeCategory ? `${activeCategory} Inventory` : "Inventory Dashboard"}
        </h2>

        {activeCategory && (
          <div className="text-center mb-4">
            <Link to="/" className="btn btn-sm btn-light border rounded-pill px-3 text-secondary text-decoration-none">
              Clear Category Filter ✕
            </Link>
          </div>
        )}

        {displayedItems.length === 0 ? (
          <p className="text-center text-muted py-4">
            {activeCategory ? `No items found matching "${activeCategory}".` : "Your inventory is empty."}
          </p>
        ) : (
          /* Main Tabular Display Container Card */
          <Card className="shadow-sm border-0 overflow-hidden">
            <Table responsive hover className="align-middle mb-0 text-nowrap">
              <thead className="bg-light">
                <tr className="text-secondary small fw-bold">
                  <th style={{ width: '120px' }}>Preview</th>
                  <th>Item Details</th>
                  <th className="text-center">Supplier Status</th>
                  <th className="text-end" style={{ paddingRight: '20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.map((item) => (
                  <tr key={item.id}>
                    
                    <td>
                      <div 
                        className="bg-light d-flex align-items-center justify-content-center border rounded overflow-hidden" 
                        style={{ width: '80px', height: '80px' }}
                      >
                        {item.photoURL ? (
                          <img 
                            src={item.photoURL} 
                            alt={item.item} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: '1.5rem' }}>📦</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <h6 className="mb-1 fw-bold text-dark text-capitalize">
                        {item.item || "Untitled Item"}
                      </h6>
                      <span className="badge rounded-pill" style={{ backgroundColor: '#fff0f5', color: '#ff69b4', fontWeight: '500' }}>
                        {item.type || "No Category"}
                      </span>
                    </td>

                    <td className="text-center">
                      {item.supplierURL ? (
                        <a 
                          href={item.supplierURL} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="d-inline-flex align-items-center justify-content-center small text-decoration-none fw-bold px-3 py-2 rounded-pill shadow-sm"
                          style={{ backgroundColor: '#fff0f5', color: '#ff69b4', border: '1px solid rgba(255, 105, 180, 0.2)' }}
                        >
                          <CiShop className="me-1" style={{ fontSize: '1.1rem' }} /> Visit Supplier ↗
                        </a>
                      ) : (
                        <span className="text-muted small fst-italic">No Supplier Linked</span>
                      )}
                    </td>

                    <td className="text-end" style={{ paddingRight: '20px' }}>
                      <div className="d-inline-flex gap-2">
                        <Link 
                          to={`/${item.id}`} 
                          className='btn btn-sm px-3 rounded-pill fw-semibold text-white'
                          style={{ backgroundColor: '#ff69b4', borderColor: '#ff69b4' }}
                        >
                          View
                        </Link>
                        
                        <Link to={`/edit/${item.id}`} className='btn btn-secondary btn-sm px-3 rounded-pill fw-semibold'>
                          Edit
                        </Link>
                        
                        <Link to={`/delete/${item.id}`} className='btn btn-outline-danger btn-sm px-3 rounded-pill fw-semibold'>
                          Delete
                        </Link>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default ItemListView;
