import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, Container, Spinner, Row, Col } from "react-bootstrap";

const ItemView = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, 'inventory', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setItem({ ...docSnap.data(), id: docSnap.id });
                } else {
                    setItem(null);
                }
            } catch (error) {
                console.error("Error fetching item:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchItem();
    }, [id]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" style={{ color: '#ff69b4' }} />
                <p className="text-muted mt-2">Loading item details...</p>
            </Container>
        );
    }

    if (!item) {
        return (
            <Container className="mt-5 text-center">
                <Card className="p-4 border-0 shadow-sm bg-light">
                    <p className="text-muted mb-0">Item not found.</p>
                    <Link to="/" className="btn btn-sm mt-3 fw-semibold text-white" style={{ backgroundColor: '#ff69b4' }}>
                        Return to Dashboard
                    </Link>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow border-0 overflow-hidden rounded-3 bg-white">
                        <Row className="g-0">
                            <Col sm={5} className="bg-light d-flex align-items-center justify-content-center" style={{ minHeight: '250px' }}>
                                {item.photoURL ? (
                                    <img 
                                        src={item.photoURL} 
                                        alt={item.item} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="text-center py-4">
                                        <span style={{ fontSize: '4.5rem' }}>📦</span>
                                        <p className="text-muted small mt-2 mb-0">No Image Provided</p>
                                    </div>
                                )}
                            </Col>
                            <Col sm={7} className="d-flex flex-column justify-content-between p-4">
                                <div>
                                    <span className="badge mb-2 px-3 py-2 rounded-pill" style={{ backgroundColor: '#fff0f5', color: '#ff69b4', fontWeight: '600' }}>
                                        {item.type || "Uncategorized"}
                                    </span>
                                    
                                    <h2 className="fw-bold mb-3 text-dark text-capitalize">
                                        {item.item}
                                    </h2>
                                    
                                    <hr className="text-muted my-3" />
                                    
                                    <p className="text-muted small">
                                        <b>Item ID:</b> <code className="text-dark bg-light px-2 py-1 rounded">{item.id}</code>
                                    </p>
                                </div>
                                {item.supplierURL && (
                                <div className="mt-3">
                                    <a 
                                    href={item.supplierURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-sm fw-semibold d-inline-flex align-items-center gap-1"
                                    style={{ borderColor: '#ff69b4', color: '#ff69b4' }}
                                    >
                                    Go to Supplier Page ↗
                                    </a>
                                </div>
                                )}

                                <div className="d-flex gap-2 mt-4">
                                    <Link 
                                        to={`/edit/${item.id}`} 
                                        className='btn btn-sm px-4 fw-semibold text-white' 
                                        style={{ backgroundColor: '#ff69b4', borderColor: '#ff69b4' }}
                                    >
                                        Edit Item
                                    </Link>
                                    <Link 
                                        to={`/delete/${item.id}`} 
                                        className='btn btn-outline-danger btn-sm px-3 fw-medium'
                                    >
                                        Delete
                                    </Link>
                                    <Link 
                                        to="/" 
                                        className='btn btn-link btn-sm text-secondary ms-auto text-decoration-none fw-medium'
                                    >
                                        Back to List
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ItemView;
