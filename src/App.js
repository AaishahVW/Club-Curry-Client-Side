import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Menu from './components/Views/Customer/Menu';
import HomePage from './components/Views/Customer/HomePage';
import CustomerDashboard from './components/Views/Customer/CustomerDashboard';
import LoginModal from './components/Common/LoginModal';
import SignupModal from './components/Common/SignupModal';
import DriverDashboardContainer from './components/Views/Driver/DriverDashboardContainer';
import Employee from './components/Views/GeneralEmployee/Employee';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './CSS/App.css';
import './CSS/Cart.css';
import './CSS/Header.css';
import './CSS/Footer.css';
import './CSS/Overlay.css';
import './CSS/HomePage.css';
import AdminDashboard from './components/Views/Admin/AdminDashboard';
import { OrderProvider } from './components/Views/GeneralEmployee/OrderContext';

function AppRoutes({ isLoggedIn, userRole }) {
  const navigate = useNavigate();

  // This effect will run when userRole changes
  useEffect(() => {
    if (userRole) {
      console.log(`User role set to: ${userRole}`);
      navigate(getDashboardRoute(userRole)); // Navigate to the appropriate dashboard
    }
  }, [userRole, navigate]);

  const getDashboardRoute = (role) => {
    switch (role) {
      case 'customer':
        return '/customer-dashboard';
      case 'admin':
        return '/admin';
      case 'driver':
        return '/driver';
      case 'generalStaff':
        return '/employee';
      default:
        return '/'; // Fallback route
    }
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/customer-dashboard" element={isLoggedIn && userRole === 'customer' ? <CustomerDashboard /> : <div>Page Not Found</div>} />
      <Route path="/admin" element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <div>Page Not Found</div>} />
      <Route path="/driver" element={isLoggedIn && userRole === 'driver' ? <DriverDashboardContainer /> : <div>Page Not Found</div>} />
      <Route path="/employee" element={isLoggedIn && userRole === 'generalStaff' ? <Employee /> : <div>Page Not Found</div>} />
      <Route path="/menu" element={<Menu />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = async (userData) => {
    let role = null;
  
    // Determine the role based on the email domain
    if (userData.email.endsWith('@ccadmin.com')) {
      role = 'admin';
    } else if (userData.email.endsWith('@ccdriver.com')) {
      role = 'driver';
    } else if (userData.email.endsWith('@ccstaff.com')) {
      role = 'generalStaff';
    } else {
      role = 'customer'; // Default role if email doesn't match any specific case
    }
  
    try {
      // Formulate loginData based on determined role
      const loginData = role === 'customer'
        ? { email: userData.email, password: userData.password }
        : { username: userData.email, password: userData.password };
  
      // Attempt to login for the determined role
      const response = await axios.post(`http://localhost:8080/ClubCurry/${role}/login`, loginData);
  
      console.log(loginData)
      console.log(response)
      console.log(`http://localhost:8080/ClubCurry/${role}/login`)
  
      // Successful login
      if (response.status === 200 && response.data) {
        console.log(`Successful login for role: ${role}`);
        
        // Set the token and user state
        localStorage.setItem('token', response.data);
        setIsLoggedIn(true);
        setUserRole(role);
        setShowLogin(false);
        return; // Exit the function after successful login
      }
    } catch (error) {
      console.error(`Error logging in as ${role}:`, error.response ? error.response.data : error.message);
    }
  
    // If we reach here, login has failed
    alert('Invalid username or password.');
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    // Check for existing token and set initial state if it exists
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Determine userRole based on the stored token
      // Since you mentioned you don't derive role from the JWT, this is a placeholder
      const existingRole = determineUserRoleBasedOnToken(token);
      setIsLoggedIn(true);
      setUserRole(existingRole);
    }
  }, []);

  const determineUserRoleBasedOnToken = (token) => {
    // Replace this with logic to determine the role based on which API returned the token
    // A hypothetical implementation could be based on stored information or some other logic
    // If you have logic based on previous conditions, implement it here, for now, it can return null
    return null; // Placeholder: implement your logic here
  };

  return (
    <OrderProvider>
      <Router>
        <div className="App">
          <Header
            isLoggedIn={isLoggedIn}
            onShowLogin={() => setShowLogin(true)}
            onShowSignup={() => setShowSignup(true)}
            onLogout={handleLogout}
          />
          <Container>
            <AppRoutes 
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          </Container>

          <Footer />
          <LoginModal 
            show={showLogin} 
            handleClose={() => setShowLogin(false)} 
            handleLogin={handleLogin} 
          />
          <SignupModal 
            show={showSignup} 
            handleClose={() => setShowSignup(false)} 
          />
        </div>
      </Router>
    </OrderProvider>
  );
}

export default App;