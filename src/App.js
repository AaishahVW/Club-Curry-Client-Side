import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Menu from './components/Views/Customer/Menu';
import MenuAdmin from './components/Views/Admin/MenuAdmin';
import HomePage from './components/Views/Customer/HomePage';
import CustomerDashboard from './components/Views/Customer/CustomerDashboard';
import LoginModal from './components/Common/LoginModal';
import SignupModal from './components/Common/SignupModal';
import Cart from './components/Views/Customer/Cart';
import BookingModal from './components/Common/BookingModal';
import DriverDashboardContainer from './components/Views/Driver/DriverDashboardContainer';
import OrderHistorySection from './components/Views/Customer/OrderHistorySection';
import ReviewSection from './components/Views/Customer/ReviewSection';
import Employee from './components/Views/GeneralEmployee/Employee';
import OrderManagement from './components/Views/GeneralEmployee/OrderManagement';
import { v4 as uuidv4 } from 'uuid';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './CSS/App.css';
// moved the menu import 
import './CSS/Cart.css';
import './CSS/Header.css';
import './CSS/Footer.css';
import './CSS/Overlay.css';
import './CSS/HomePage.css';

const ADMIN_CREDENTIALS = {
  username: 'admin@email.com',
  password: 'admin123',
};

const DRIVER_CREDENTIALS = {
  username: 'driver@email.com',
  password: 'driver123',
};

const EMPLOYEE_CREDENTIALS = {
  username: 'employee@email.com',
  password: 'employee123',
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false); // Define isEmployee state
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [reviews, setReviews] = useState([]);

  const handleLogin = (userData) => {
    if (userData.email === ADMIN_CREDENTIALS.username && userData.password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setIsDriver(false);
      setIsEmployee(false);
      setUser(userData);
    } else if (userData.email === DRIVER_CREDENTIALS.username && userData.password === DRIVER_CREDENTIALS.password) {
      setIsLoggedIn(true);
      setIsDriver(true);
      setIsAdmin(false);
      setIsEmployee(false);
      setUser(userData);
    } else if (userData.email === EMPLOYEE_CREDENTIALS.username && userData.password === EMPLOYEE_CREDENTIALS.password) {
      setIsLoggedIn(true);
      setIsEmployee(true);
      setIsAdmin(false);
      setIsDriver(false);
      setUser(userData);
    } else {
      setIsLoggedIn(true);
      setUser(userData);
      setIsAdmin(false);
      setIsDriver(false);
      setIsEmployee(false);
    }
    setShowLogin(false);
  };

  const handleSignup = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowSignup(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsDriver(false);
    setIsEmployee(false); // Ensure all states are reset
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => [
      ...prevItems,
      { ...item, spiceLevel: item.spiceLevel, specialNote: item.notes, quantity: item.quantity, uniqueId: uuidv4() },
    ]);
  };

  const removeFromCart = (uniqueId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.uniqueId !== uniqueId));
  };

  const handleUpdateQuantity = (uniqueId, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.uniqueId === uniqueId) {
          return { ...item, quantity: Math.max(item.quantity + change, 1) };
        }
        return item;
      })
    );
  };

  const toggleCart = () => {
    setShowCart((prevState) => !prevState);
  };

  const handleCheckout = () => {
    alert('Checkout is not yet implemented.');
    setOrderHistory([...orderHistory, ...cartItems]); // Simulate order history
    setCartItems([]); // Clear cart after checkout
  };

  const handleBooking = (bookingData) => {
    console.log('Booking Data:', bookingData);
    alert('Booking Confirmed!');
  };

  const handleAddReview = (newReview) => {
    setReviews([...reviews, newReview]);
  };

  return (
    <Router>
      <div className="App">
        {!isDriver && (
          <Header
            isLoggedIn={isLoggedIn}
            onShowLogin={() => setShowLogin(true)}
            onShowSignup={() => setShowSignup(true)}
            onLogout={handleLogout}
            onShowCart={toggleCart}
            onShowBooking={() => setShowBooking(true)}
          />
        )}
        {(showCart || showBooking) && <div className="overlay"></div>}
        <Container>
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  isDriver ? (
                    <DriverDashboardContainer onLogout={handleLogout} />
                  ) : isAdmin ? (
                    <HomePage setShowBooking={setShowBooking} showBooking={showBooking} />
                  ) : isEmployee ? (
                    <Employee /> // Employee dashboard route
                  ) : (
                    <CustomerDashboard
                      cartItems={cartItems}
                      menuItems={menuItems}
                      onAddToCart={addToCart}
                      onShowCart={toggleCart}
                      onShowBooking={() => setShowBooking(true)}
                      onCheckout={handleCheckout}
                      onRemoveFromCart={removeFromCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      orderHistory={orderHistory}
                      customerReviews={reviews.filter(review => review.customerId === user.id)}
                      onAddReview={handleAddReview}
                    />
                  )
                ) : (
                  <HomePage setShowBooking={setShowBooking} showBooking={showBooking} />
                )
              }
            />
            <Route path="/menu" element={<Menu addToCart={addToCart} items={menuItems} />} />
            <Route
              path="/admin"
              element={isAdmin ? <MenuAdmin initialItems={menuItems} onUpdateItems={setMenuItems} /> : <div>Access Denied</div>}
            />
            <Route path="/driver" element={<DriverDashboardContainer onLogout={handleLogout} />} />
            <Route path="/employee" element={isEmployee ? <Employee /> : <div>Access Denied</div>} />
            <Route path="/order-history" element={<OrderHistorySection orders={orderHistory} />} />
            <Route path="/reviews" element={<ReviewSection existingReviews={reviews} onAddReview={handleAddReview} />} />
            <Route path="/employee" element={<Employee />} />
             <Route path="/orderManagement" element={<OrderManagement />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Container>

        <Footer />
        <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} handleLogin={handleLogin} />
        <SignupModal show={showSignup} handleClose={() => setShowSignup(false)} onSignup={handleSignup} />
        <Cart
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={handleCheckout}
          showCart={showCart}
          onCloseCart={() => setShowCart(false)}
          isLoggedIn={isLoggedIn}
          onShowLogin={() => setShowLogin(true)}
          onShowSignup={() => setShowSignup(true)}
        />
        <BookingModal
          show={showBooking}
          handleClose={() => setShowBooking(false)}
          handleBooking={handleBooking}
          isLoggedIn={isLoggedIn}
          onShowLogin={() => setShowLogin(true)}
          onShowSignup={() => setShowSignup(true)}
        />
      </div>
    </Router>
  );
}

export default App;
