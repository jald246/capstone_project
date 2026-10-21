"use client";
import React, { useState, useEffect, useContext } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase'; 
import { authContext } from './pages/auth-context';
import { Link } from 'react-router-dom';
import { Container, Spinner, Alert, Card, Row, Col, Tabs, Tab, Badge } from 'react-bootstrap';
import { CiGrid41, CiBookmark, CiFolderOn, CiShoppingBasket } from "react-icons/ci";

const CategoriesPage = () => {
  const [itemsList, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('categories');

  const { user } = useContext(authContext);

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
        console.error("Error loading categories overview:", err);
        setError("Failed to load inventory groupings.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user]);

  const generateGroupMetrics = (fieldName, urlParamName) => {
    const counts = {};
    
    itemsList.forEach(item => {
      const rawValue = item[fieldName]?.trim().toLowerCase();
      
      if (rawValue) {
        const titleCaseValue = rawValue
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        counts[titleCaseValue] = (counts[titleCaseValue] || 0) + 1;
      }
    });

    return Object.keys(counts).map(name => ({
      name: name,
      count: counts[name],
      path: `/inventory?${urlParamName}=${encodeURIComponent(name.toLowerCase())}`
    })).sort((a, b) => b.count - a.count);
  };

  const categoriesGroups = generateGroupMetrics('type', 'category');
  const brandsGroups = generateGroupMetrics('brand', 'brand');
  const collectionsGroups = generateGroupMetrics('collection', 'collection');
  const supplierGroups = generateGroupMetrics('supplier', 'supplier');

  const renderGridSection = (groups, sectionIcon, typeLabel) => {
    if (groups.length === 0) {
      return (
        <p className="text-center text-muted py-5 card bg-white border border-light shadow-sm mt-3">
          No {typeLabel.toLowerCase()} have been added yet. Add or edit items to populate this list!
        </p>
      );
    }

    return (
      <Row className="g-4 mt-2">
        {groups.map((group, index) => (
          <Col key={index} sm={12} md={6} lg={4}>
            <Link to={group.path} className="text-decoration-none text-dark d-block h-100">
              <Card 
                className="h-100 border-0 shadow-sm p-3 bg-white" 
                style={{ 
                  borderRadius: '12px', 
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  border: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                }}
              >
                <Card.Body className="d-flex align-items-center justify-content-between p-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-center border rounded-3" style={{ width: '48px', height: '48px', backgroundColor: '#fff0f5' }}>
                      {sectionIcon}
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: '1.15rem' }}>{group.name}</h5>
                      <span className="text-muted small">View items</span>
                    </div>
                  </div>
                  <Badge pill style={{ backgroundColor: '#ff69b4', fontSize: '0.9rem', padding: '8px 12px' }}>
                    {group.count} {group.count === 1 ? 'item' : 'items'}
                  </Badge>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    );
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" style={{ color: '#ff69b4' }} /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="py-4">
      <header className="text-center mb-5">
        <h2 className="fw-bold mb-2" style={{ color: '#ff69b4' }}>Inventory Breakdown</h2>
        <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
          Monitor your inventory automatically grouped by category types, manufacturing brands, supplier names, and custom collection groups.
        </p>
      </header>

      <Tabs id="taxonomy-dashboard-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 justify-content-center border-bottom-0">
        <Tab eventKey="categories" title={<span className="d-flex align-items-center gap-2 px-2 py-1"><CiGrid41 size={18}/> Type</span>}>
          {renderGridSection(categoriesGroups, <CiGrid41 size={22} style={{ color: '#ff69b4' }} />, "Categories")}
        </Tab>
        <Tab eventKey="brands" title={<span className="d-flex align-items-center gap-2 px-2 py-1"><CiBookmark size={18}/> Brands</span>}>
          {renderGridSection(brandsGroups, <CiBookmark size={22} style={{ color: '#ff69b4' }} />, "Brands")}
        </Tab>
        <Tab eventKey="collections" title={<span className="d-flex align-items-center gap-2 px-2 py-1"><CiFolderOn size={18}/> Collections</span>}>
          {renderGridSection(collectionsGroups, <CiFolderOn size={22} style={{ color: '#ff69b4' }} />, "Collections")}
        </Tab>
        <Tab eventKey="supplier" title={<span className="d-flex align-items-center gap-2 px-2 py-1"><CiShoppingBasket size={18}/> Supplier</span>}>
          {renderGridSection(supplierGroups, <CiShoppingBasket size={22} style={{ color: '#ff69b4' }} />, "Supplier")}
        </Tab>  
      </Tabs>
    </Container>
  );
};

export default CategoriesPage;


