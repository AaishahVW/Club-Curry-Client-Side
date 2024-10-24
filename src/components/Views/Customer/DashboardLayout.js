import React, { useState, useEffect } from "react";
import CustomerDashboardHeader from "./CustomerDashboardHeader";
import CustomerNavbar from "./CustomerNavbar";
import CustomerDashboard from "./CustomerDashboard";
import CustomerReviews from "./CustomerReviews";
import OrderHistorySection from "./OrderHistorySection";
import Cart from "./Cart"; // Import the Cart component
import PropTypes from "prop-types";
import axios from "axios";
import "./CustomerCss/DashboardLayout.css";

const DashboardLayout = ({ isLoggedIn, onLogout, decodedValue }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [customer, setCustomer] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false); // State to toggle cart visibility
  const [error, setError] = useState(null);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, uniqueId: Date.now() }];
      }
    });
  };
  const handleShowCart = () => {
    setShowCart(true);
  };
  const handleCloseCart = () => {
    setShowCart(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:8080/ClubCurry/customer/readByUsername/${decodedValue.sub}`
        );
        const userData = await userResponse.data;
        const userId = userData.email;
        const customerResponse = await axios.get(
          `http://localhost:8080/ClubCurry/customer/get/${userId}`
        );
        const customerData = await customerResponse.data;
        setCustomer(customerData);
      } catch (error) {
        console.error("Error fetching user data or customer data:", error);
        setError("Failed to load customer data");
      }
    };
    if (decodedValue) {
      fetchUserData();
    }
  }, [decodedValue]);

  //const toggleCart = () => setShowCart(!showCart);

  return (
    <div className="dashboard-layout">
      <CustomerDashboardHeader
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
        onShowCart={handleShowCart}
      />
      <CustomerNavbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        {activeSection === "dashboard" && (
          <CustomerDashboard customer={customer} addToCart={addToCart} />
        )}
        {activeSection === "reviews" && <CustomerReviews customer={customer} />}
        {activeSection === "order-history" && (
          <OrderHistorySection customer={customer} />
        )}
      </div>
      <Cart
        cartItems={cartItems}
        onRemoveItem={(id) =>
          setCartItems(cartItems.filter((item) => item.uniqueId !== id))
        }
        onUpdateQuantity={(id, change) => {
          setCartItems(
            cartItems.map((item) =>
              item.uniqueId === id
                ? { ...item, quantity: item.quantity + change }
                : item
            )
          );
        }}
        onCheckout={() => alert("Checkout functionality to be implemented.")}
        showCart={showCart}
        onCloseCart={handleCloseCart}
        isLoggedIn={isLoggedIn}
        customer = {customer}
      />
    </div>
  );
};

DashboardLayout.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  decodedValue: PropTypes.object.isRequired,
};

export default DashboardLayout;
