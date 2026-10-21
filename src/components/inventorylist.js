import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { authContext } from './pages/auth-context';
import { Container, Spinner, Alert, Card, Table, Pagination } from 'react-bootstrap';

import SearchBar from './searchBar';
import TableRowItem from './tableRowItem';

const ItemListView = () => {
  const [itemsList, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { user } = useContext(authContext);
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get('category');
  const activeBrand = searchParams.get('brand');
  const activeCollection = searchParams.get('collection');
  const activeSupplier = searchParams.get('supplier')
  const hasActiveClassification = activeCategory || activeBrand || activeCollection || activeSupplier;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, activeBrand, activeCollection, activeSupplier]);

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
          quantity: doc.data().quantity !== undefined ? Number(doc.data().quantity) : 1,
          inStock: doc.data().inStock !== false 
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

  const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
    const nextQuantity = Math.max(0, currentQuantity + change);
    const calculatedStockStatus = nextQuantity > 0;

    try {
      const itemDocRef = doc(db, "inventory", itemId);
      await updateDoc(itemDocRef, { quantity: nextQuantity, inStock: calculatedStockStatus });
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: nextQuantity, inStock: calculatedStockStatus } : i));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStockStatus = async (itemId, currentStatus) => {
  try {
    const itemDocRef = doc(db, "inventory", itemId);
    const nextStatus = !currentStatus;
    
    const matchingItem = itemsList.find(i => i.id === itemId);

    let nextQuantity = matchingItem.quantity;
    if (!nextStatus) {
      nextQuantity = 0;
    } else if (nextStatus && matchingItem.quantity === 0) {
      nextQuantity = 1;
    }
    await updateDoc(itemDocRef, { 
      inStock: nextStatus, 
      quantity: nextQuantity 
    });
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, inStock: nextStatus, quantity: nextQuantity } : item
      )
    );
  } catch (err) {
    console.error("Failed to update stock status:", err);
  }
};

    const displayedItems = itemsList.filter(item => {
    const matchesCategory = activeCategory ? item.type?.toLowerCase() === activeCategory.toLowerCase() : true;
    const matchesBrand = activeBrand ? item.brand?.toLowerCase() === activeBrand.toLowerCase() : true;
    const matchesCollection = activeCollection ? item.collection?.toLowerCase() === activeCollection.toLowerCase() : true;
    const matchesSupplier = activeSupplier ? item.supplier?.toLowerCase() === activeSupplier.toLowerCase() : true;

    return matchesCategory && matchesBrand && matchesCollection && matchesSupplier &&(
      item.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.collection?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsSlice = displayedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayedItems.length / itemsPerPage);

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" style={{ color: '#ff69b4' }} /></Container>;
  if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <div className='body py-4'>
      <Container>
        <h2 className="mb-4 text-center fw-bold text-capitalize" style={{ color: '#ff69b4' }}>
          {activeCategory || activeBrand || activeCollection || activeSupplier || "Inventory Dashboard"}
        </h2>

        {hasActiveClassification && (
          <div className="text-center mb-4">
            <Link to="/categories" className="btn btn-sm btn-light border rounded-pill px-3 text-secondary text-decoration-none shadow-sm">
              ✕ Back to Categories Dashboard
            </Link>
          </div>
        )}

        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          itemsPerPage={itemsPerPage} 
          setItemsPerPage={setItemsPerPage} 
          hasActiveClassification={hasActiveClassification} 
        />

        {displayedItems.length === 0 ? (
          <p className="text-center text-muted py-5 card shadow-sm bg-white border-0">No items match your active search terms.</p>
        ) : (
          <>
            <Card className="shadow-sm border-0 overflow-hidden mb-4">
              <Table responsive hover className="align-middle mb-0 text-nowrap">
                <thead className="bg-light">
                  <tr className="text-secondary small fw-bold">
                    <th style={{ width: '120px', paddingLeft: '20px' }}>Preview</th>
                    <th>Item Details</th>
                    <th>Brand</th>
                    <th className="text-center" style={{ width: '140px' }}>Quantity</th>
                    <th className="text-center">Supplier Link</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItemsSlice.map((item) => (
                    <TableRowItem 
                      key={item.id} 
                      item={item} 
                      handleUpdateQuantity={handleUpdateQuantity} 
                      toggleStockStatus={toggleStockStatus} 
                    />
                  ))}
                </tbody>
              </Table>
            </Card>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center">
                <Pagination className="custom-pagination">
                  <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} />
                  {[...Array(totalPages)].map((_, idx) => (
                    <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>
                      {idx + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setCurrentPage(prev => Math.max(1, Math.min(totalPages, prev + 1)))} disabled={currentPage === totalPages} />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default ItemListView;


