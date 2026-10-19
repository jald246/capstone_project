import React, { useState, useContext } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import SignIn from './components/pages/signIn';
import { authContext } from './components/pages/auth-context';

import ItemListView from './components/inventorylist';
import NavBar from './components/temps/navbar';
import CreateItem from './components/inventory/create';
import ItemView from './components/inventory/show';
import ItemDelete from './components/inventory/delete';
import ItemEdit from './components/inventory/edit';
import CategoriesPage from './components/categories';

function App() {
  const { user, loading } = useContext(authContext);
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Verifying authentication...</p>
      </div>
    );
  }
  
  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="*" element={<SignIn />} />
        ) : (
          <Route
            path="*"
            element={
              <>
                <NavBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <main 
                  style={{ 
                    marginLeft: isCollapsed ? '80px' : '260px', 
                    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    minHeight: '100vh',
                    padding: '20px'
                  }}
                >
                  <Routes>
                    <Route path="/" element={<ItemListView />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/create" element={<CreateItem />} />
                    <Route path="/:id" element={<ItemView />} />
                    <Route path="/edit/:id" element={<ItemEdit />} />
                    <Route path="/delete/:id" element={<ItemDelete />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </>
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;



