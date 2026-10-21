"use client";
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { authContext } from './auth-context';
import { Container, Spinner, Card, ProgressBar, Row, Col } from 'react-bootstrap';

export default function HomeView() {
  const [itemsList, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useContext(authContext);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchDashboardStats = async () => {
      try {
        const inventoryCollection = collection(db, 'inventory');
        const q = query(inventoryCollection, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setItems(data);
      } catch (err) {
        console.error("Error generating dashboard summaries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user]);
  
  const totalItemsCount = itemsList.length; 
  const outOfStockCount = itemsList.filter(item => item.inStock === false || Number(item.quantity) === 0).length;
  
  const activeInStockCount = totalItemsCount - outOfStockCount;

  const inStockPercentage = totalItemsCount > 0 ? Math.round((activeInStockCount / totalItemsCount) * 100) : 0;
  const outOfStockPercentage = totalItemsCount > 0 ? Math.round((outOfStockCount / totalItemsCount) * 100) : 0;

  const getUniqueCount = (fieldName) => {
    const uniqueValues = new Set(
      itemsList
        .map(item => item[fieldName]?.trim().toLowerCase())
        .filter(Boolean)
    );
    return uniqueValues.size;
  };

  const totalCategoriesCount = getUniqueCount('type');
  const totalBrandsCount = getUniqueCount('brand');
  const totalCollectionsCount = getUniqueCount('collection');

  const navigationCards = [
    {
      title: "View Inventory List",
      description: "Browse, filter, and inspect your inventory stock.",
      path: "/inventory",
      color: "#eb89ff", 
      metric: `${totalItemsCount} Distinct Items`, 
      subMetric: `${outOfStockCount} items sold out`,
      badgeColor: outOfStockCount > 0 ? '#fee2e2' : '#f0fdf4',
      badgeTextColor: outOfStockCount > 0 ? '#eb89ff' : '#16a34a'
    },
    {
      title: "Manage Groupings",
      description: "View inventory through by type, brand, collection name, or supplier.",
      path: "/categories",
      color: "#be60f8", 
      metric: `${totalCategoriesCount} Categories`,
      subMetric: `${totalBrandsCount} Brands · ${totalCollectionsCount} Collections`,
      badgeColor: '#f8ecfd',
      badgeTextColor: '#be60f8'
    },
    {
      title: "Add New Product",
      description: "Register a new item.",
      path: "/create",
      color: "#7c3aed", 
      metric: "Create Item",
      subMetric: "Instantly update catalogs",
      badgeColor: '#f5f3ff',
      badgeTextColor: '#7c3aed'
    },
  ];

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" style={{ color: '#ff69b4' }} />
        <p className="text-muted mt-2">Loading live statistics...</p>
      </Container>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#111827', margin: '0 0 8px 0', fontWeight: 'bold' }}>
          Inventory Management Dashboard
        </h1>
        <p style={{ color: '#4b5563', fontSize: '1.1rem', margin: 0 }}>
          Welcome back! Select a module below to get started.
        </p>
      </header>

      {totalItemsCount > 0 && (
        <Card className="shadow-sm border-0 p-4 mb-4 bg-white" style={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="fw-bold mb-0 text-secondary" style={{ fontSize: '1.05rem' }}>Stock Availability</h5>
          </div>
          
          <ProgressBar style={{ height: '12px', borderRadius: '6px', overflow: 'hidden' }} className="mb-3">
            <ProgressBar now={inStockPercentage} key={1} style={{ backgroundColor: '#a575ff' }} />
            <ProgressBar now={outOfStockPercentage} key={2} style={{ backgroundColor: '#e4d2f3' }} />
          </ProgressBar>

          <Row className="text-center g-2 small text-secondary fw-semibold">
            <Col xs={12} md={4} className="text-start border-end">
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#a575ff', display: 'inline-block' }}></span>
                <span>In Stock Varieties: {activeInStockCount} ({inStockPercentage}%)</span>
              </div>
            </Col>
            <Col xs={12} md={4} className="text-start ps-md-3">
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e4d2f3', display: 'inline-block' }}></span>
                <span>Out of Stock Varieties: {outOfStockCount} ({outOfStockPercentage}%)</span>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px' 
        }}
      >
        {navigationCards.map((card, index) => (
          <Link 
            key={index}
            to={card.path}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              borderRadius: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
            }}
          >
            <div 
              style={{ 
                width: '40px', 
                height: '6px', 
                borderRadius: '3px', 
                backgroundColor: card.color, 
                marginBottom: '16px' 
              }} 
            />
            <div 
              style={{
                alignSelf: 'flex-start',
                backgroundColor: card.badgeColor,
                color: card.badgeTextColor,
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '700',
                marginBottom: '16px'
              }}
            >
              {card.metric}
            </div>

            <h2 style={{ fontSize: '1.4rem', margin: '0 0 6px 0', color: '#1f2937', fontWeight: 'bold' }}>
              {card.title}
            </h2>
            
            <p style={{ color: '#6b7280', lineHeight: '1.5', margin: '0 0 20px 0', flexGrow: 1 }}>
              {card.description}
            </p>

            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px', display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
              <span style={{ fontSize: '0.85rem', color: '#6b7280', flexGrow: 1 }}>
                {card.subMetric}
              </span>
              <span 
                style={{ 
                  color: card.color, 
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.95rem'
                }}
              >
                Open &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
