import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeHeader from './EmployeeHeader';
import './Employee.css';

const Employee = () => {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('');
    const [orderType, setOrderType] = useState('delivery');
    const [cart, setCart] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [orders, setOrders] = useState([]);
    
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const handleLogout = () => {
        setIsLoggedIn(false);
      };

    const navigate = useNavigate();

    const handleOrderManagementRedirect = () => {
        navigate('/orderManagement');
    };

    const categories = [
        { name: 'Curries', icon: 'fa-utensils' },
        { name: 'Desserts', icon: 'fa-ice-cream' },
        { name: 'Appetizers', icon: 'fa-pepper-hot' },
        { name: 'Drinks', icon: 'fa-glass-martini-alt' },
        { name: 'Mains', icon: 'fa-drumstick-bite' },
        { name: 'Vegetarian', icon: 'fa-leaf' }
    ];

    const menuItems = {
        Curries: [
            { name: 'Butter Chicken', price: 120 },
            { name: 'Palak Paneer', price: 100 },
            { name: 'Chicken Tikka Masala', price: 130 }
        ],
        Desserts: [
            { name: 'Gulab Jamun', price: 50 },
            { name: 'Rasmalai', price: 60 },
            { name: 'Kheer', price: 55 }
        ],
        Appetizers: [
            { name: 'Samosa', price: 40 },
            { name: 'Pakora', price: 35 },
            { name: 'Papadum', price: 25 }
        ],
        Drinks: [
            { name: 'Mango Lassi', price: 45 },
            { name: 'Masala Chai', price: 30 },
            { name: 'Fresh Lime Soda', price: 35 }
        ],
        Mains: [
            { name: 'Tandoori Chicken', price: 150 },
            { name: 'Lamb Biryani', price: 180 },
            { name: 'Fish Curry', price: 160 }
        ],
        Vegetarian: [
            { name: 'Dal Makhani', price: 90 },
            { name: 'Vegetable Korma', price: 110 },
            { name: 'Baingan Bharta', price: 100 }
        ]
    };

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            setCart(cart.map(cartItem => 
                cartItem.name === item.name 
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1, spiciness: 'Medium' }]);
        }
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const updateSpiciness = (index, spiciness) => {
        const newCart = [...cart];
        newCart[index].spiciness = spiciness;
        setCart(newCart);
    };

    const updateQuantity = (index, change) => {
        const newCart = [...cart];
        newCart[index].quantity = Math.max(1, newCart[index].quantity + change);
        setCart(newCart);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = () => {
        setShowCheckoutModal(true);
    };

    const confirmOrder = () => {
        const newOrder = {
            id: Date.now(),
            items: cart,
            total: calculateTotal(),
            date: new Date().toLocaleString()
        };
        setOrders([...orders, newOrder]);
        setCart([]);
        setShowCheckoutModal(false);
    };

    const handleConfirmTakeOrder = () => {
        setShowModal(false);
    };

    const todayDate = new Date().toISOString().split('T')[0];

    return (
        <div className="employee-container">
            <EmployeeHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <nav className="side-nav">
                <ul>
                    <li><a href="#" onClick={() => setShowModal(true)}><i className="fas fa-plus-circle"></i> New Order</a></li>
                    <li>
                        <a href="#" onClick={handleOrderManagementRedirect}>
                            <i className="fas fa-clock"></i> Order Management
                        </a>
                    </li>
                    <li><a href="#" onClick={() => { setActiveTab('booking'); setShowModal(true); }}><i className="fas fa-calendar-alt"></i> Bookings</a></li>
                </ul>
            </nav>
            <div className="employee-main-content">
                <h1 class="employee-header">Club Curry Employee</h1>
                <div className="category-grid">
                    {categories.map((category) => (
                        <div 
                            key={category.name} 
                            className="category-block"
                            onClick={() => {
                                setSelectedCategory(category.name);
                                setShowCategoryModal(true);
                            }}
                        >
                            <i className={`fas ${category.icon}`}></i>
                            <p>{category.name}</p>
                        </div>
                    ))}
                </div>

                <div className="order-summary">
                    <h3>Order Summary</h3>
                    {cart.length === 0 ? (
                        <p>No items in the cart.</p>
                    ) : (
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Spiciness</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>
                                            <div className="quantity-control">
                                                <button onClick={() => updateQuantity(index, -1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(index, 1)}>+</button>
                                            </div>
                                        </td>
                                        <td>R{item.price * item.quantity}</td>
                                        <td>
                                            {['Curries', 'Mains', 'Vegetarian'].includes(item.category) ? (
                                                <select 
                                                    value={item.spiciness} 
                                                    onChange={(e) => updateSpiciness(index, e.target.value)}
                                                >
                                                    <option value="Mild">Mild</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hot">Hot</option>
                                                </select>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                        <td><button class="btn-remove" onClick={() => removeFromCart(index)}>Remove</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className="total">Total: R{calculateTotal()}</div>
                    <button 
                        className="emp-checkout-btn" 
                        onClick={handleCheckout} 
                        disabled={cart.length === 0}
                        style={{
                            backgroundColor: cart.length === 0 ? '#d3d3d3' : '#10921b',
                            cursor: cart.length === 0 ? 'not-allowed' : 'pointer', 
                        }}
                    >
                        Checkout
                    </button>
                </div>


                <div className="orders-section" id="orders-section">
                    <h2 class="orders-header">Orders</h2>
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <h4>Order #{order.id}</h4>
                            <p>Date: {order.date}</p>
                            <p>Total: R{order.total}</p>
                            <div className="order-items">
                                {order.items.map((item, index) => (
                                    <p key={index}>
                                        {item.name} x{item.quantity} - R{item.price * item.quantity}
                                        {['Curries', 'Mains', 'Vegetarian'].includes(item.category) && ` (Spiciness: ${item.spiciness})`}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showModal && (
                <div className="employee-modal">
                    <div className="employee-modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <div className="employee-tab">
                            <button 
                                className={orderType === 'delivery' ? 'active' : ''} 
                                onClick={() => setOrderType('delivery')}
                            >
                                Delivery
                            </button>
                            <button 
                                className={orderType === 'collection' ? 'active' : ''} 
                                onClick={() => setOrderType('collection')}
                            >
                                Collection
                            </button>
                            <button 
                                className={orderType === 'dinein' ? 'active' : ''} 
                                onClick={() => setOrderType('dinein')}
                            >
                                Booking
                            </button>
                        </div>
                        {orderType === 'delivery' && (
                            <form class="employee-form">
                                <h2>Delivery</h2>
                                <div className="employee-form-group">
                                    <label>Order ID</label>
                                    <input type="text" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Name</label>
                                    <input type="text" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Email</label>
                                    <input type="email" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Delivery Address</label>
                                    <input type="text" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Order Note</label>
                                    <input type="text" />
                                </div>
                                <div className="employee-form-group">
                                    <label>Driver</label>
                                    <select required>
                                        <option value="">Select Driver</option>
                                        <option value="driver1">Driver 1</option>
                                        <option value="driver2">Driver 2</option>
                                    </select>
                                </div>
                                <button type="button" className="confirm-btn" onClick={handleConfirmTakeOrder}>Confirm</button>
                            </form>
                        )}
                        {orderType === 'collection' && (
                            <form class="employee-form">
                                <h2>Collection</h2>
                                <div className="employee-form-group">
                                    <label>Order ID</label>
                                    <input type="text" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Name</label>
                                    <input type="text" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Collection Time</label>
                                    <input type="time" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Order Note</label>
                                    <input type="text" />
                                </div>
                                <button type="button" className="confirm-btn" onClick={handleConfirmTakeOrder}>Confirm</button>
                            </form>
                        )}
                        {orderType === 'dinein' && (
                            <form class="employee-form">
                                <h2>Booking</h2>
                                <div className="employee-form-group">
                                    <label>Customer Name</label>
                                    <input type="text" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Customer Phone Number</label>
                                    <input type="tel" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Booking Time</label>
                                    <input type="time" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Table Number</label>
                                    <input type="number" required />
                                </div>
                                <div className="employee-form-group">
                                    <label>Section Number</label>
                                    <input type="number" required />
                                </div>
                                <button type="button" className="confirm-btn" onClick={handleConfirmTakeOrder}>Confirm</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
            {showCategoryModal && (
                <div className="employee-modal">
                    <div className="employee-modal-content">
                        <span className="close" onClick={() => setShowCategoryModal(false)}>&times;</span>
                        <h2>{selectedCategory}</h2>
                        <div className="menu-items">
                            {menuItems[selectedCategory].map((item, index) => (
                                <div key={index} className="employee-menu-item">
                                    <span>{item.name}</span>
                                    <span>R{item.price}</span>
                                    <button onClick={() => addToCart({ ...item, category: selectedCategory })}>Add to Cart</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showCheckoutModal && (
                <div className="employee-modal">
                    <div className="employee-modal-content">
                        <span className="close" onClick={() => setShowCheckoutModal(false)}>&times;</span>
                        <h2>Checkout</h2>
                        <div className="checkout-summary">
                            {cart.map((item, index) => (
                                <div key={index} className="checkout-item">
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>R{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="total">Total: R{calculateTotal()}</div>
                        <button className="confirm-btn" onClick={confirmOrder}>Confirm Order</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employee;

 