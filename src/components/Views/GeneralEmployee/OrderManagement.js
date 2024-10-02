import React, { useState } from 'react';
import './OrderManagement.css';

// Modal component for viewing details
const OrdersModal = ({ order, onClose }) => {
  if (!order) return null; // Don't render if no order is selected

  return (
    <div className="orders-modal-overlay">
      <div className="orders-modal">
        <h2>Order Details</h2>
        <div className="modal-content">
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Payment Type:</strong> {order.paymentMethod}</p>
          <p><strong>Customer Name:</strong> {order.customerName ? order.customerName : 'Walk-in Customer'}</p>

          <h3>Cart Items</h3>
          {order.cart && order.cart.items.length > 0 ? (
            <ul>
              {order.cart.items.map((item, index) => (
                <li key={index}>
                  <p><strong>{item.menuItemName}</strong> x {item.quantity}</p>
                  <p>Price: {item.price}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No items in cart</p>
          )}
        </div>
        <button className="modal-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const OrderManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([
    { id: 1, orderId: '12345', date: '2024-09-30', time: '12:30 PM', collectionType: 'Dine-in', customerName: 'John Doe', status: 'Pending', paymentMethod: 'Cash', cart: { items: [{ menuItemName: 'Burger', quantity: 2, price: '50.00' }, { menuItemName: 'Fries', quantity: 1, price: '20.00' }] } },
    { id: 2, orderId: '23456', deliveryId: 'D001', date: '2024-09-30', time: '1:00 PM', collectionType: 'Delivery', customerName: 'Jane Smith', status: 'In Transit', paymentMethod: 'Card', cart: { items: [{ menuItemName: 'Pizza', quantity: 1, price: '100.00' }] } },
    { id: 3, orderId: '34567', date: '2024-09-30', time: '1:30 PM', collectionType: 'Pickup', customerName: null, status: 'Pending', paymentMethod: 'Cash', cart: { items: [{ menuItemName: 'Salad', quantity: 1, price: '30.00' }] } },
    { id: 4, orderId: '45678', deliveryId: 'D002', date: '2024-09-30', time: '2:00 PM', collectionType: 'Delivery', customerName: 'Bob Brown', status: 'Cancelled', paymentMethod: 'Card', cart: { items: [{ menuItemName: 'Soda', quantity: 1, price: '15.00' }] } },
    { id: 5, orderId: '56789', date: '2024-09-30', time: '2:30 PM', collectionType: 'Dine-in', customerName: null, status: 'Preparing', paymentMethod: 'Card', cart: { items: [{ menuItemName: 'Steak', quantity: 1, price: '150.00' }] } },
    { id: 6, orderId: '67890', date: '2024-09-30', time: '3:00 PM', collectionType: 'Pickup', customerName: 'Alice Green', status: 'Completed', paymentMethod: 'Cash', cart: { items: [{ menuItemName: 'Sandwich', quantity: 1, price: '40.00' }] } },
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId && order.status !== 'Cancelled'
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order); // Set the selected order to be viewed in modal
  };

  const handleCloseModal = () => {
    setSelectedOrder(null); // Close the modal
  };

  const getStatusOptions = (collectionType) => {
    if (collectionType === 'Delivery') {
      return ['Pending', 'In Transit', 'Delivered', 'Cancelled'];
    } else if (collectionType === 'Dine-in') {
      return ['Pending', 'Preparing', 'Completed', 'Cancelled'];
    } else {
      return ['Pending', 'Ready for Pickup', 'Completed', 'Cancelled'];
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderId.includes(searchQuery) ||
    (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="order-management">
     
      <h2>Order Management</h2>
      <input
        type="text"
        placeholder="Search by Order ID or Customer Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Dine-in Orders Table */}
      <div className="table-container">
        <h3>Dine-in Orders</h3>
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Customer</th>
              <th>Payment Type</th>
              <th>Status</th>
              <th>Actions</th> {/* New column for actions */}
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              .filter((order) => order.collectionType === 'Dine-in')
              .map((order) => (
                <tr key={order.id}>
                  <td>{order.orderId}</td>
                  <td>{order.date}</td>
                  <td>{order.time}</td>
                  <td>{order.customerName ? order.customerName : 'Walk-in Customer'}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={order.status === 'Cancelled'}
                    >
                      {getStatusOptions(order.collectionType).map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td class="action-cell">
                    <button onClick={() => handleViewDetails(order)} class="btn-view-details">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Delivery Orders Table */}
      <div className="table-container">
        <h3>Delivery Orders</h3>
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Delivery ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Customer</th>
              <th>Payment Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              .filter((order) => order.collectionType === 'Delivery')
              .map((order) => (
                <tr key={order.id}>
                  <td>{order.orderId}</td>
                  <td>{order.deliveryId}</td>
                  <td>{order.date}</td>
                  <td>{order.time}</td>
                  <td>{order.customerName}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={order.status === 'Cancelled'}
                    >
                      {getStatusOptions(order.collectionType).map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td class="action-cell">
                    <button onClick={() => handleViewDetails(order)} class="btn-view-details">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pickup Orders Table */}
      <div className="table-container">
        <h3>Pickup Orders</h3>
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Customer</th>
              <th>Payment Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              .filter((order) => order.collectionType === 'Pickup')
              .map((order) => (
                <tr key={order.id}>
                  <td>{order.orderId}</td>
                  <td>{order.date}</td>
                  <td>{order.time}</td>
                  <td>{order.customerName ? order.customerName : 'Walk-in Customer'}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={order.status === 'Cancelled'}
                    >
                      {getStatusOptions(order.collectionType).map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td class="action-cell">
                    <button onClick={() => handleViewDetails(order)} class="btn-view-details">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing order details */}
      <OrdersModal order={selectedOrder} onClose={handleCloseModal} />
    </div>
  );
};

export default OrderManagement;
