import React, { useState } from "react";
import { Modal, Button, Accordion, Form, Alert } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import axios from 'axios';
//import { useNavigate } from "react-router-dom";

const Cart = ({
  cartItems, // Default to an empty array to avoid undefined error
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  showCart,
  onCloseCart,
  isLoggedIn,
  onShowLogin,
  onShowSignup,
  customer, // Add customer prop to access customer details. 

}) => {
  // State hooks for managing various input values
  const [orderType, setOrderType] = useState("");
  const [streetName, setStreetName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [suburbName, setSuburbName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [driverNote, setDriverNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  

  //const navigate = useNavigate(); // Use navigate to redirect to home page

  // Function to handle quantity change for an item
  const handleQuantityChange = (uniqueId, change) => {
    onUpdateQuantity(uniqueId, change);
  };

   // Function to handle removal of an item from the cart
  const handleRemove = (uniqueId) => {
    onRemoveItem(uniqueId);
  };

  // Function to calculate total price of items in the cart
  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  console.log(customer)
  console.log(cartItems)
  const handleCheckout = async () => {
    if (isLoggedIn) {
      if (
        !orderType ||
        (orderType === "Delivery" && // If delivery, ensure all details are provided
          (!streetName ||
            !streetNumber ||
            !suburbName ||
            !postalCode ||
            !driverNote)) ||
        !paymentMethod
      ) {
        alert("Please complete all fields before proceeding.");
        return;
      }

      // NEW CODE !!!!!!

    
      try {
        // Step 1: Save the Cart with only the customer
        console.log(customer.email)

        const cart = {
          customer:{email:customer.email}
         };
        const cartResponse = await axios.post('http://localhost:8080/ClubCurry/cart/save', 
        cart 
        );

        if (!cartResponse.data) throw new Error('Failed to save cart.');

        const cartId = cartResponse.data.id; // Get the saved cart ID

         const items = {
          id: cartId,
          items: cartItems.map(item => ({ // Map through each item in the cartItems array
            menuItem: {
              id: item.menuItem.id,
              name: item.menuItem.name,
              description: item.menuItem.description,
              image: item.menuItem.image,
              price: item.menuItem.price,
            },
            spiceLevel: item.spiceLevel,
            note: item.note,
            quantity: item.quantity,
          })),
        };

         console.log(JSON.stringify(items, null, 2));
        // Step 2: Update the Cart with items
        const updateResponse = await axios.put('http://localhost:8080/ClubCurry/cart/updateItems', items); 
         

        if (!updateResponse.data) throw new Error('Failed to update cart items.');

        
        const cartObj = await axios.get(`http://localhost:8080/ClubCurry/cart/readByCustomer/${customer.email}`)
        console.log('CartObj:', cartObj);

        const isComplete = false
         // Step 3: Prepare and log the order details
      const orderDetails = {
        cart: { id: cartId }, // Include the cart ID in the order object
        orderType,
        streetName,
        streetNumber,
        suburbName,
        postalCode,
        driverNote,
        paymentMethod, 
        isComplete       
      };

      console.log('Order Details:', JSON.stringify(orderDetails, null, 2)); // Log order details

      // Save the Order
      const orderResponse = await axios.post('http://localhost:8080/ClubCurry/orders/save', orderDetails);


        if (orderResponse.status === 200) {
          alert('Order placed successfully!');
          onCheckout(); // Call the onCheckout function passed in props
          onCloseCart(); // Close the cart modal after successful checkout
        } else {
          alert('Failed to place order. Please try again.');
        }

      }catch (error) {
        console.error('Checkout error:', error);
        alert('An error occurred during checkout. Please try again.');
      }
    } else {
      setShowLoginPrompt(true);
    } 
  }; 

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
    onShowLogin();
  };

  const handleSignupPromptClose = () => {
    setShowLoginPrompt(false);
    onShowSignup();
  };

  const handleModalClose = () => {
    onCloseCart();
  };

  return (
    <>
      <div
        className={`modal-overlay ${showCart ? "active" : ""}`}
        onClick={handleModalClose}
      ></div>
      <Modal show={showCart} onHide={handleModalClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartItems.length > 0 ? (
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.uniqueId} className="cart-item">
                   <img src={item.image} alt={item.name} />
                  <div className="cart-item-details">
                    <span>{item.name}</span>
                    <span>{item.spiceLevel}</span>
                    <span>Special Instructions: {item.specialNote}</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="item-quantity">
                      <Button
                        variant="secondary"
                        onClick={() => handleQuantityChange(item.uniqueId, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="secondary"
                        onClick={() => handleQuantityChange(item.uniqueId, 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => handleRemove(item.uniqueId)}
                      className="remove-button"
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Your cart is empty.</p>
          )}

          {isLoggedIn && (
            <Accordion defaultActiveKey="0" className="mt-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Order Type</Accordion.Header>
                <Accordion.Body>
                  <Form>
                    <Form.Check
                      type="radio"
                      label="Delivery"
                      name="orderType"
                      id="delivery"
                      value="Delivery"
                      onChange={(e) => setOrderType(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      label="Collection"
                      name="orderType"
                      id="collection"
                      value="Collection"
                      onChange={(e) => setOrderType(e.target.value)}
                    />
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
              {orderType === "Delivery" && (
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Delivery Details</Accordion.Header>
                  <Accordion.Body>
                    <Form.Group controlId="streetName">
                      <Form.Label>Street Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter street name"
                        value={streetName}
                        onChange={(e) => setStreetName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="streetNumber" className="mt-3">
                      <Form.Label>Street Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter street number"
                        value={streetNumber}
                        onChange={(e) => setStreetNumber(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="suburbName" className="mt-3">
                      <Form.Label>Suburb Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter suburb name"
                        value={suburbName}
                        onChange={(e) => setSuburbName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="postalCode" className="mt-3">
                      <Form.Label>Postal Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter postal code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="driverNote" className="mt-3">
                      <Form.Label>Driver Instructions</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter instructions for the driver"
                        value={driverNote}
                        onChange={(e) => setDriverNote(e.target.value)}
                      />
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>
              )}
              <Accordion.Item eventKey="2">
                <Accordion.Header>Payment Method</Accordion.Header>
                <Accordion.Body>
                  <Form>
                    <Form.Check
                      type="radio"
                      label="Card"
                      name="paymentMethod"
                      id="card"
                      value="Card"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      label="Cash"
                      name="paymentMethod"
                      id="cash"
                      value="Cash"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      label="SnapScan"
                      name="paymentMethod"
                      id="snapscan"
                      value="SnapScan"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="cart-footer">
            <h4>Total: R{getTotal()}</h4>
            <p>
              <i>A tip would be appreciated!</i>
            </p>
            <Button variant="success" onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showLoginPrompt}
        onHide={() => setShowLoginPrompt(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Please Log In or Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            You need to be logged in to proceed with checkout.
          </Alert>
          <Button
            variant="primary"
            onClick={handleLoginPromptClose}
            className="mr-2"
          >
            Log In
          </Button>
          <Button variant="secondary" onClick={handleSignupPromptClose}>
            Sign Up
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Cart;
