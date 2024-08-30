import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon
import axios from 'axios';
import styles from './Menu.module.css';

const Menu = ({ addToCart }) => {
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [spiceLevel, setSpiceLevel] = useState('Mild');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState('');
  
  const [structuredMenu, setStructuredMenu] = useState({});

  useEffect(() => {
    const loadItems = async () => {
      try {
        const results = await axios.get("http://localhost:8080/ClubCurry/menuItem/getAll");
        structureMenuItems(results.data);
      } catch (error) {
        console.error('Error loading items:', error);
      }
    };

    loadItems();
  }, []);

  const structureMenuItems = (items) => {
    const structured = {};
    items.forEach(item => {
      const category = item.menuId.name;
      if (!structured[category]) {
        structured[category] = [];
      }
      structured[category].push({
        id: item.id,
        name: item.name,
        description: item.description,
        image: `http://localhost:8080/ClubCurry/image/getByMenuId/${item.id}`,
        price: item.price,
      });
    });
    setStructuredMenu(structured);
  };

  const handleShow = (category, item) => {
    setSelectedItem(item);
    setShowModal(category);
  };

  const handleClose = () => setShowModal(null);

  const handleAddToCart = () => {
    addToCart({ ...selectedItem, spiceLevel, notes, quantity });
    setQuantity(1); // Reset quantity after adding to cart
    setNotes(''); // Reset notes after adding to cart
    setNotification(`Added ${quantity} ${selectedItem.name} to cart`);
    setTimeout(() => setNotification(''), 1000); // Clear message after 1 second
  };

  return (
    <div className="menu-wrapper">
      <div className="menu-container">
        <div className="alert-info">
          Note: Curries contain nuts. Please specify if you have any allergies.
        </div>
        {Object.keys(structuredMenu).map((category, index) => (
          <div key={index} className="category-section">
            <h2>{category}</h2>
            {structuredMenu[category].map((item) => (
              <Button
                key={item.id}
                className="menu-button"
                onClick={() => handleShow(category, item)}
              >
                <img src={item.image} alt={item.name} />
                <span className="menu-text">
                  <strong>{item.name}</strong>
                  <br/>
                  R{item.price.toFixed(2)}
                </span>
              </Button>
            ))}
          </div>
        ))}
      </div>

      {selectedItem && (
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedItem.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedItem.image} alt={selectedItem.name} />
            <p>{selectedItem.description}</p>
            <Form>
              <Form.Group>
                <Form.Label>Spice Level</Form.Label>
                <Form.Control as="div">
                  <Form.Check 
                    type="radio" 
                    label="Mild" 
                    name="spiceLevel" 
                    checked={spiceLevel === 'Mild'}
                    onChange={() => setSpiceLevel('Mild')}
                  />
                  <Form.Check 
                    type="radio" 
                    label="Medium" 
                    name="spiceLevel" 
                    checked={spiceLevel === 'Medium'}
                    onChange={() => setSpiceLevel('Medium')}
                  />
                  <Form.Check 
                    type="radio" 
                    label="Medium to Hot" 
                    name="spiceLevel" 
                    checked={spiceLevel === 'Medium to Hot'}
                    onChange={() => setSpiceLevel('Medium to Hot')}
                  />
                  <Form.Check 
                    type="radio" 
                    label="Hot" 
                    name="spiceLevel" 
                    checked={spiceLevel === 'Hot'}
                    onChange={() => setSpiceLevel('Hot')}
                  />
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)} 
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <div className="item-quantity">
                  <Button 
                    variant="secondary" 
                    onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                  >
                    -
                  </Button>
                  <span>{quantity}</span>
                  <Button 
                    variant="secondary" 
                    onClick={() => setQuantity(prev => prev + 1)}
                  >
                    +
                  </Button>
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <p><strong>R{selectedItem.price.toFixed(2)}</strong></p>
              </Form.Group>
              <Button 
                variant="primary" 
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              {notification && <div className="notification">{notification}</div>}
              <Button 
                variant="link" 
                className="cart-icon" 
              >
                <FaShoppingCart />
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default Menu;
