import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const MenuAdmin = () => {
  // Existing state hooks
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', menuId: '' });
  const [editItem, setEditItem] = useState(null);
  const [newMenuName, setNewMenuName] = useState('');
  const [categories, setCategories] = useState([]);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [structuredMenu, setStructuredMenu] = useState({});

  // New state hooks for bookings and drivers
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [newBooking, setNewBooking] = useState({ customerName: '', date: '', time: '', driverId: '' });
  const [newDriver, setNewDriver] = useState({ name: '', phone: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const itemsResponse = await axios.get("http://localhost:8080/ClubCurry/menuItem/getAll");
        structureMenuItems(itemsResponse.data);

        const menuResponse = await axios.get("http://localhost:8080/ClubCurry/menu/getAll");
        setCategories(menuResponse.data);

        // Fetch bookings and drivers data
        const bookingsResponse = await axios.get("http://localhost:8080/ClubCurry/booking/getAll");
        setBookings(bookingsResponse.data);

        const driversResponse = await axios.get("http://localhost:8080/ClubCurry/driver/getAll");
        setDrivers(driversResponse.data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
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

  const handleAddItemShow = () => {
    setNewItem({ name: '', description: '', price: '', menuId: '' });
    setImageFile(null);
    setShowAddItemModal(true);
  };

  const handleAddItemClose = () => setShowAddItemModal(false);

  const handleAddMenuShow = () => {
    setNewMenuName('');
    setShowAddMenuModal(true);
  };

  const handleAddMenuClose = () => setShowAddMenuModal(false);

  const handleMenuNameChange = (e) => {
    setNewMenuName(e.target.value);
  };

  const handleSaveNewMenu = async () => {
    try {
      await axios.post('http://localhost:8080/ClubCurry/menu/save', { name: newMenuName });
      const response = await axios.get("http://localhost:8080/ClubCurry/menu/getAll");
      setCategories(response.data);
      handleAddMenuClose();
    } catch (error) {
      alert("Unable to save new menu, please check the details.");
      console.error('Error saving new menu', error);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const itemToSave = {
      name: newItem.name,
      price: parseFloat(newItem.price),
      description: newItem.description,
      menuId: { id: newItem.menuId }
    };

    try {
      const results = await axios.post('http://localhost:8080/ClubCurry/menuItem/save', itemToSave);
      const resultData = { ...results.data };
      formData.append("itemId", Number(resultData.id));

      try {
        await axios.post(`http://localhost:8080/ClubCurry/image/save`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const itemsResponse = await axios.get("http://localhost:8080/ClubCurry/menuItem/getAll");
        structureMenuItems(itemsResponse.data);

        const menuResponse = await axios.get("http://localhost:8080/ClubCurry/menu/getAll");
        setCategories(menuResponse.data);
        handleAddItemClose();

      } catch (error) {
        alert("Unable to save Image to database, please check the details.");
        console.error('Error uploading image:', error);
      }
    } catch (error) {
      alert("Unable to save Item to database, please check the details.");
      console.error('Error saving item', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prevItem => ({ ...prevItem, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleDeleteShow = (id) => {
    setItemToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteClose = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/ClubCurry/image/deleteByItemId/${itemToDeleteId}`);
      await axios.delete(`http://localhost:8080/ClubCurry/menuItem/delete/${itemToDeleteId}`);

      const itemsResponse = await axios.get("http://localhost:8080/ClubCurry/menuItem/getAll");
      structureMenuItems(itemsResponse.data);

      const menuResponse = await axios.get("http://localhost:8080/ClubCurry/menu/getAll");
      setCategories(menuResponse.data);
      handleDeleteClose();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    try {
      const itemsToDelete = structuredMenu[categoryName];

      if (itemsToDelete.length > 0) {
        await Promise.all(itemsToDelete.map(item => 
          axios.delete(`http://localhost:8080/ClubCurry/image/deleteByItemId/${item.id}`)
        ));
        await Promise.all(itemsToDelete.map(item => 
          axios.delete(`http://localhost:8080/ClubCurry/menuItem/delete/${item.id}`)
        ));
      }

      setStructuredMenu(prevStructuredMenu => {
        const updatedMenu = { ...prevStructuredMenu };
        delete updatedMenu[categoryName]; 
        return updatedMenu;
      });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditShow = (item) => {
    setEditItem(item); 
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setEditItem(null); 
    setShowEditModal(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditItem(prevItem => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleEditSave = async () => {
    try {
      const updatedItem = {
        id: editItem.id,
        name: editItem.name,
        description: editItem.description,
        price: parseFloat(editItem.price),
        menuId: { id: editItem.menuId },
      };

      await axios.put(`http://localhost:8080/ClubCurry/menuItem/update`, updatedItem);

      const itemsResponse = await axios.get("http://localhost:8080/ClubCurry/menuItem/getAll");
      structureMenuItems(itemsResponse.data);

      handleEditClose();
    } catch (error) {
      alert("Unable to update Item, please check the details.");
      console.error('Error updating item', error);
    }
  };

  // New handlers for bookings and drivers
  const handleAddBookingShow = () => setShowBookingModal(true);
  const handleAddBookingClose = () => setShowBookingModal(false);
  
  const handleAddDriverShow = () => setShowDriverModal(true);
  const handleAddDriverClose = () => setShowDriverModal(false);

  const handleSaveBooking = async () => {
    try {
      await axios.post('http://localhost:8080/ClubCurry/booking/save', newBooking);
      const bookingsResponse = await axios.get("http://localhost:8080/ClubCurry/booking/getAll");
      setBookings(bookingsResponse.data);
      handleAddBookingClose();
    } catch (error) {
      alert("Unable to save booking, please check the details.");
      console.error('Error saving booking', error);
    }
  };

  const handleSaveDriver = async () => {
    try {
      await axios.post('http://localhost:8080/ClubCurry/driver/save', newDriver);
      const driversResponse = await axios.get("http://localhost:8080/ClubCurry/driver/getAll");
      setDrivers(driversResponse.data);
      handleAddDriverClose();
    } catch (error) {
      alert("Unable to save driver, please check the details.");
      console.error('Error saving driver', error);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setNewBooking(prevBooking => ({ ...prevBooking, [name]: value }));
  };

  const handleDriverChange = (e) => {
    const { name, value } = e.target;
    setNewDriver(prevDriver => ({ ...prevDriver, [name]: value }));
  };

  return (
    <div className="menu-admin-container mt-5 p-5">
      <div className="add-item-section">
        <Button className="add-item-button" onClick={handleAddMenuShow}>
          Add New Menu Category
        </Button>
        <Button className="add-item-button" onClick={handleAddItemShow}>
          Add New Item
        </Button>
        <Button className="add-item-button" onClick={handleAddBookingShow}>
          Add New Booking
        </Button>
        <Button className="add-item-button" onClick={handleAddDriverShow}>
          Add New Driver
        </Button>
      </div>

      <div className="menu-items">
        {Object.keys(structuredMenu).map(category => (
          <div key={category} className="menu-category">
            <div style={{ alignItems: 'center', paddingBottom: '20px' }}>
              <h4>{category}</h4>
              <Button variant="danger" onClick={() => handleDeleteCategory(category)}>
                Delete whole menu
              </Button>
            </div>
            {structuredMenu[category].map(item => (
              <div 
                key={item.id} 
                className="menu-item" 
                onClick={() => handleEditShow(item)} 
              >
                <img src={item.image} alt={item.name} />
                <div>
                  <h5>{item.name}</h5>
                  <p>{item.description}</p>
                </div>
                <p>Price: ${item.price}</p>
                <Button 
                  variant="danger" 
                  onClick={(e) => { e.stopPropagation(); handleDeleteShow(item.id); }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Modal show={showAddItemModal} onHide={handleAddItemClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formItemName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item name"
                name="name"
                value={newItem.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formItemDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item description"
                name="description"
                value={newItem.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formItemPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter item price"
                name="price"
                value={newItem.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formItemCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="menuId"
                value={newItem.menuId}
                onChange={handleChange}
                required
              >
                <option value="">please select a category...</option>
                {categories.length > 0 ? (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="">Loading...</option>
                )}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemImage">
              <Form.Label>Image Upload</Form.Label>
              <Form.Control
                type="file"
                accept="image/*" 
                onChange={handleImageChange}
                required
              />
            </Form.Group>
          </Form>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showAddMenuModal} onHide={handleAddMenuClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewMenuName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new menu name"
                value={newMenuName}
                onChange={handleMenuNameChange}
                required
              />
            </Form.Group>
          </Form>
          <Button variant="primary" onClick={handleSaveNewMenu}>
            Save
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the item with ID: {itemToDeleteId}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleEditClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editItem && (
            <Form>
              <Form.Group controlId="formEditItemName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter item name"
                  name="name"
                  value={editItem.name}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEditItemDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter item description"
                  name="description"
                  value={editItem.description}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEditItemPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="Enter item price"
                  name="price"
                  value={editItem.price}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEditItemCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  name="menuId"
                  value={editItem.menuId}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">please select a category...</option>
                  {categories.length > 0 ? (
                    categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="">Loading...</option>
                  )}
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Booking Modals */}
      <Modal show={showBookingModal} onHide={handleAddBookingClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBookingCustomerName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter customer name"
                name="customerName"
                value={newBooking.customerName}
                onChange={handleBookingChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBookingDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter date"
                name="date"
                value={newBooking.date}
                onChange={handleBookingChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBookingTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                placeholder="Enter time"
                name="time"
                value={newBooking.time}
                onChange={handleBookingChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBookingDriver">
              <Form.Label>Driver</Form.Label>
              <Form.Control
                as="select"
                name="driverId"
                value={newBooking.driverId}
                onChange={handleBookingChange}
                required
              >
                <option value="">please select a driver...</option>
                {drivers.length > 0 ? (
                  drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
                    </option>
                  ))
                ) : (
                  <option value="">Loading...</option>
                )}
              </Form.Control>
            </Form.Group>
          </Form>
          <Button variant="primary" onClick={handleSaveBooking}>
            Save
          </Button>
        </Modal.Body>
      </Modal>

      {/* Driver Modals */}
      <Modal show={showDriverModal} onHide={handleAddDriverClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Driver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDriverName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter driver name"
                name="name"
                value={newDriver.name}
                onChange={handleDriverChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDriverPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter driver phone number"
                name="phone"
                value={newDriver.phone}
                onChange={handleDriverChange}
                required
              />
            </Form.Group>
          </Form>
          <Button variant="primary" onClick={handleSaveDriver}>
            Save
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MenuAdmin;
