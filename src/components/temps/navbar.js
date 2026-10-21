import React, { useContext, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { authContext } from '../pages/auth-context';
import './NavBar.css'; 
import { FaHome } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import { MdOutlineInventory } from "react-icons/md";


const NavBar = () => {
  const { user, loading, logout } = useContext(authContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Navbar className={`custom-pink-navbar variant-dark ${isCollapsed ? 'collapsed' : ''}`}>
      <Container>
        <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
          {isCollapsed ? '❯' : '❮'}
        </button>

        <div className="navbar-collapse-centered">
          <Nav>
            {user && !loading && (
              <div className="user-profile-container">
                <div className="avatar-wrapper">
                  <img 
                    className="avatar-image" 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <small className="user-greeting">Hi, {user.displayName}!</small>
              </div>
            )}

            <Nav.Link href='/'>
              {isCollapsed ? <FaHome /> : <span className="nav-link-text">Home</span>}
            </Nav.Link>
            <Nav.Link href='/inventory'>
              {isCollapsed ? <MdOutlineInventory /> : <span className="nav-link-text">Inventory</span>}
            </Nav.Link>
            <Nav.Link href='/categories'>
              {isCollapsed ? <BiCategory /> : <span className="nav-link-text">Categories</span>}
            </Nav.Link>
            <Nav.Link href='/create'>
              {isCollapsed ? <IoMdAddCircleOutline /> : <span className="nav-link-text">Add New Product</span>}
            </Nav.Link>

            {user && !loading && (
              <button onClick={logout} className="btn btn-sm btn-signout" title="Sign out">
                {isCollapsed ? <LuLogOut /> : 'Sign out'}
              </button>
            )}
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;


