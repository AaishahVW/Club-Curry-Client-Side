import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeHeader from './EmployeeHeader';
import './Employee.css';

const Employee = () => {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('');
    const [orderType, setOrderType] = useState('delivery');
    const [cart, setCart] = useState([]);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
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

    const menus = [
        { name: 'Starters', icon: 'fa-utensils' },
        { name: 'Curries', icon: 'fa-pepper-hot'},
        { name: 'Mains', icon:  'fa-drumstick-bite'},
        { name: 'Drinks', icon: 'fa-glass-martini-alt' },
        { name: 'Desserts', icon: 'fa-ice-cream' },
        { name: 'Specials', icon: 'fa-star' }

    ];

    const menuItems = {
        Starters: [
            { name: 'Butter Chicken', price: 120 },
            { name: 'Palak Paneer', price: 100 },
            { name: 'Chicken Tikka Masala', price: 130 }
        ],
        Curries: [
            { name: 'Gulab Jamun', price: 50 },
            { name: 'Rasmalai', price: 60 },
            { name: 'Kheer', price: 55 }
        ],
        Mains: [
            { name: 'Samosa', price: 40 },
            { name: 'Pakora', price: 35 },
            { name: 'Papadum', price: 25 }
        ],
        Drinks: [
            { name: 'Mango Lassi', price: 45 },
            { name: 'Masala Chai', price: 30 },
            { name: 'Fresh Lime Soda', price: 35 }
        ],
        Desserts: [
            { name: 'Tandoori Chicken', price: 150 },
            { name: 'Lamb Biryani', price: 180 },
            { name: 'Fish Curry', price: 160 }
        ],
        Specials: [
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
    const selectedMenuItems = menuItems[selectedMenu] || [];

    return (
        <div className="employee-container">
            <EmployeeHeader isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            
            <div className="employee-main-content">
                <h1 className="employee-header">Club Curry Employee</h1>
                <div className="menu-grid">
                    {menus.map((menu) => (
                        <div 
                            key={menu.name} 
                            className="menu-block"
                            onClick={() => {
                                setSelectedMenu(menu.name);
                                setShowMenuModal(true);
                            }}
                        >
                            <i className={`fas ${menu.icon}`}></i>
                            <p>{menu.name}</p>
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
                                            {['Curries', 'Mains', 'Vegetarian'].includes(item.menu) ? (
                                                <select class="spice-lvl-dropdown"
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
                                        <td><button className="btn-remove" onClick={() => removeFromCart(index)}>Remove</button></td>
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
                <h2 className="orders-header">Orders</h2>
                <div className="orders-section" id="orders-section">
                    
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <h4>Order #{order.id}</h4>
                            <p>Date: {order.date}</p>
                            <p>Total: R{order.total}</p>
                            <div className="order-items">
                                {order.items.map((item, index) => (
                                    <p key={index}>
                                        {item.name} x{item.quantity} - R{item.price * item.quantity}
                                        {['Curries', 'Mains', 'Vegetarian'].includes(item.menu) && ` (Spiciness: ${item.spiciness})`}
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
                        <h2>New Order</h2>
                        <label>
                            Select Order Type:
                            <select 
                                value={orderType}
                                onChange={(e) => setOrderType(e.target.value)}
                            >
                                <option value="delivery">Delivery</option>
                                <option value="takeaway">Takeaway</option>
                            </select>
                        </label>
                        <button onClick={handleConfirmTakeOrder}>Confirm</button>
                    </div>
                </div>
            )}
            {showMenuModal && (
                <div className="employee-modal">
                    <div className="employee-modal-content">
                        <span className="close" onClick={() => setShowMenuModal(false)}>&times;</span>
                        <h2>{selectedMenu}</h2>
                        <div className="menu-items">
                            {selectedMenuItems.length === 0 ? (
                                <p>No items available for this menu.</p>
                            ) : (
                                selectedMenuItems.map((item, index) => (
                                    <div key={index} className="employee-menu-item">
                                        <span>{item.name}</span>
                                        <span>R{item.price}</span>
                                        <button onClick={() => addToCart({ ...item, menu: selectedMenu })}>Add to Cart</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showCheckoutModal && (
                <div className="employee-modal">
                    <div className="employee-modal-content">
                        <span className="close" onClick={() => setShowCheckoutModal(false)}>&times;</span>
                        <h2>Checkout</h2>
                        <p>Total Amount: R{calculateTotal()}</p>
                        <button onClick={confirmOrder} class="btn-confirm-order">Confirm Order</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employee;
