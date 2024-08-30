import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './EmployeeHeader.css'; // Import the CSS file for styling

const EmployeeHeader = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    window.location.href = '/';
  };

  const handleHomeRedirect = () => {
    navigate('/employee');
  };

  return (
    <Navbar className="navbar" expand="lg" fixed="top">
      <Navbar.Brand onClick={handleHomeRedirect}>
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}d
          alt="Club Curry Logo"
          height="40"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <div className="buttons-container">
          <Button variant="outline-light" onClick={handleHomeRedirect}>
            <i className="fas fa-user" style={{ marginRight: '5px' }}></i> Employee
          </Button>
          {isLoggedIn && (
            <Button variant="outline-light" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" style={{ marginRight: '5px' }}></i>Logout
            </Button>
          )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default EmployeeHeader;
