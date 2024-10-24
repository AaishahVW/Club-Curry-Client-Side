import React, {useEffect, useState} from 'react';
import './OrderManagement.css';
import axios from "axios";
import orderManagement from '../../../images/orderManagement.svg';

// Modal component for viewing details
const OrdersModal = ({ order, onClose }) => {
  if (!order) return null; // Don't render if no order is selected

  return (
    <div className="orders-modal-overlay">
      <div className="orders-modal">
      <img src={orderManagement} className="order-table-image" />
      <div className="modal-content">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Payment Type:</strong> {order.paymentMethod}</p>
          <p><strong>Customer Name:</strong> {order.cart.customer.name ? order.cart.customer.name : 'Walk-in Customer'}</p>
          <p><strong>Total:</strong> R{order.cart.items.reduce((total, current) => (total + current.menuItem.price * current.quantity), 0)}</p>
          <h3>Cart Items</h3>
          {order.cart && order.cart.items.length > 0 ? (
              <ul>
              {order.cart.items.map((item, index) => (
                <li key={index}>
                  <p><strong>{item.menuItem.name}</strong> x {item.quantity}</p>
                  <p>Price: R {item.menuItem.price}</p>
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
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drivers, setDriver] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/ClubCurry/orders/getAll");
        setOrders(response.data);
        console.log("Loaded orders successfully" + orders)
      }
      catch (error){
        console.log("Error fetching orders" + error);
      }
    }

    const fetchDrivers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/ClubCurry/driver/getAll");
        setDriver(response.data);
        console.log("Loaded drivers successfully" + drivers);
      }

      catch (error){
        console.log("Error fetching drivers " + drivers);
      }

    }

    fetchOrders();
    fetchDrivers();
  }, []);

  const handleStatusChange = (order, newStatus) => {
    const updateStatus = async () => {
      if(order.collectionType ==="DELIVERY") {
        return;
      }
      try{
        order.orderStatus = newStatus;
        console.log(order.valueOf())
        const response = await axios.put("http://localhost:8080/ClubCurry/orders/update", order);
        const response2 = await axios.get("http://localhost:8080/ClubCurry/orders/getAll");
        setOrders(response2.data);
      }

      catch (error){
        console.log("Error while status update " + error);
      }
    }
    updateStatus();
  };

  const handleDriverChange= (order, driver) => {
    const updateDriver = async () =>{
      try {
        const response = await axios.get(`http://localhost:8080/ClubCurry/delivery/getByOrderId/${order.id}`);
        const delivery = response.data;

        const updatedDelivery= {...delivery, driver: {id: driver}};
        await axios.put("http://localhost:8080/ClubCurry/delivery/update", updatedDelivery)
      }
      catch (error){
        console.log("Error occured while changing driver " + error);
      }
      }
    updateDriver();
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order); // Set the selected order to be viewed in modal
  };

  const handleCloseModal = () => {
    setSelectedOrder(null); // Close the modal
  };

  const getStatusOptions = (collectionType) => {
    if (collectionType === 'DELIVERY') {
      return ['PENDING', 'IN_TRANSIT', 'DELIVERED'];
    } else {
      return ['PENDING', 'PREPARING', 'CANCELLED', 'COMPLETED'];
    }
  };



  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchQuery) ||
    (order.cart.customer.name && order.cart.customer.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="order-management">
     
      <h2 id="OM-header">Order Management</h2>

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              .filter((order) => order.collectionType === 'DINE_IN')
              .map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.ordered}</td>
                  <td>{order.time}</td>
                  <td>{order.cart.customer.name ? order.cart.customer.name : 'Walk-in Customer'}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <select className="status-dropdown"
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      disabled={order.status === 'Cancelled'}
                    >
                      {getStatusOptions(order.collectionType).map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="action-cell">
                    <button onClick={() => handleViewDetails(order)} className="btn-view-details">
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
              <th>Driver</th>
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
              .filter((order) => order.collectionType === 'DELIVERY')
              .map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.deliveryId}</td>
                  <td>
                    <select
                        value={order}
                        onChange={(e) => handleDriverChange(order, e.target.value)}
                        disabled={order.status === 'Cancelled'}
                    >
                      {drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                      ))}
                    </select>
                  </td>
                  <td>{order.ordered}</td>
                  <td>{order.time}</td>
                  <td>{order.cart.customer.name}</td>
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
                  <td className="action-cell">
                    <button onClick={() => handleViewDetails(order)} className="btn-view-details">
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
              .filter((order) => order.collectionType === 'PICKUP')
              .map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.ordered}</td>
                  <td>{order.time}</td>
                  <td>{order.cart.customer.name ? order.cart.customer.name : 'Walk-in Customer'}</td>
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
                  <td className="action-cell">
                    <button onClick={() => handleViewDetails(order)} className="btn-view-details">
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
