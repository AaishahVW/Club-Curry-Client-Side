import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import './MenuAdmin.css';
import menum from '../../../images/menum.png'

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const itemsResponse = await axios.get("http://localhost:8080/ClubCurry/menuItem/getAll");
        structureMenuItems(itemsResponse.data);

        const menuResponse = await axios.get("http://localhost:8080/ClubCurry/menu/getAll");
        setCategories(menuResponse.data);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const structureMenuItems = async (items) => {
    const structured = {};
  
    await Promise.all(items.map(async (item) => {
      const category = item.menuId.name;
      if (!structured[category]) {
        structured[category] = [];
      }
  
      // Fetch the image data (binary)
      try {
        const response = await axios.get(`http://localhost:8080/ClubCurry/image/getByMenuId/${item.id}`, {
          responseType: 'blob' // Expecting binary data
        });
  
        // Create a URL for the image blob
        const imageUrl = URL.createObjectURL(response.data);
        
        structured[category].push({
          id: item.id,
          name: item.name,
          description: item.description,
          image: imageUrl, // Now storing the object URL
          price: item.price,
        });
      } catch (error) {
        console.error('Error fetching image for item:', item.id, error);
        // Handle image fetching error; you can set a default image here if required
        structured[category].push({
          id: item.id,
          name: item.name,
          description: item.description,
          image:'fail', // Placeholder for missing images
          price: item.price,
        });
      }
    }));
  
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
        const respone = await axios.get(`http://localhost:8080/ClubCurry/menu/getByName/${categoryName}`)
        await axios.delete(`http://localhost:8080/ClubCurry/menu/delete/${respone.data.id}`)
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

  return (
    <div className="menu-admin-container">
            <img src={menum} className="menu-table-image" alt='menu'/>
            <div className="add-item-section">
        <Button className="add-item-button" onClick={handleAddMenuShow}>
          Add New Menu
        </Button>
        <Button className="add-item-button" onClick={handleAddItemShow}>
          Add New Item
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
                  <p>Price: R{item.price}</p>
                </div>
                
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

      {/* Add Item Modal */}
      <Modal show={showAddItemModal} onHide={handleAddItemClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formItemName">
              <Form.Label>Item Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={newItem.name} 
                onChange={handleChange} 
              />
            </Form.Group>
            <Form.Group controlId="formItemDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                type="text" 
                name="description" 
                value={newItem.description} 
                onChange={handleChange} 
              />
            </Form.Group>
            <Form.Group controlId="formItemPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control 
                type="number" 
                name="price" 
                value={newItem.price} 
                onChange={handleChange} 
              />
            </Form.Group>
            <Form.Group controlId="formItemMenuId">
              <Form.Label>Category</Form.Label>
              <Form.Control 
                as="select" 
                name="menuId" 
                value={newItem.menuId} 
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map(menu => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemImage">
              <Form.Label>Image</Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleImageChange} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddItemClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Menu Modal */}
      <Modal show={showAddMenuModal} onHide={handleAddMenuClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Menu Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formMenuName">
              <Form.Label>Menu Name</Form.Label>
              <Form.Control 
                type="text" 
                value={newMenuName} 
                onChange={handleMenuNameChange} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddMenuClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveNewMenu}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Item Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this item?
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

      {/* Edit Item Modal */}
      <Modal show={showEditModal} onHide={handleEditClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editItem && (
            <Form>
              <Form.Group controlId="formEditItemName">
                <Form.Label>Item Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="name" 
                  value={editItem.name} 
                  onChange={handleEditChange} 
                />
              </Form.Group>
              <Form.Group controlId="formEditItemDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  type="text" 
                  name="description" 
                  value={editItem.description} 
                  onChange={handleEditChange} 
                />
              </Form.Group>
              <Form.Group controlId="formEditItemPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control 
                  type="number" 
                  name="price" 
                  value={editItem.price} 
                  onChange={handleEditChange} 
                />
              </Form.Group>
              <Form.Group controlId="formEditItemMenuId">
                <Form.Label>Category</Form.Label>
                <Form.Control 
                  as="select" 
                  name="menuId" 
                  value={editItem.menuId} 
                  onChange={handleEditChange}
                >
                  <option value="">Select Category</option>
                  {categories.map(menu => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MenuAdmin;
