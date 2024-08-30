import React from 'react';
import EmployeeHeader from './EmployeeHeader'; // Import the EmployeeHeader component
import './OrderManagement.css';

// Mock data for demonstration purposes
const deliveryData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', address: '123 Main St', note: 'Leave at door', driver: 'Driver 1', status: 'Pending' },
];

const collectionData = [
    { id: 1, name: 'Jane Smith', phone: '123-456-7890', time: '12:00', note: 'Call on arrival', status: 'Collected' },
];

const bookingData = [
    { id: 1, name: 'Mike Johnson', phone: '987-654-3210', time: '18:00', table: 5, section: 2 },
];

const OrderManagement = () => {
    return (
        <div className="order-management-container">
            <EmployeeHeader isLoggedIn={true} onLogout={() => console.log('Logged out')} /> {/* Use EmployeeHeader component */}
            <h1 className="order-header">Order Management</h1>

            <div className="order-container">
                <h2>Delivery</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Delivery Address</th>
                            <th>Order Note</th>
                            <th>Driver</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveryData.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.name}</td>
                                <td>{order.email}</td>
                                <td>{order.address}</td>
                                <td>{order.note}</td>
                                <td>{order.driver}</td>
                                <td>{order.status}</td>
                                <td><button className="btn-edit">Edit Order</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="collection-container">
                <h2>Collection</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Name</th>
                            <th>Phone Number</th>
                            <th>Collection Time</th>
                            <th>Order Note</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collectionData.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.name}</td>
                                <td>{order.phone}</td>
                                <td>{order.time}</td>
                                <td>{order.note}</td>
                                <td>{order.status}</td>
                                <td><button className="btn-edit">Edit Order</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="booking-container">
                <h2>Booking</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Name</th>
                            <th>Phone Number</th>
                            <th>Booking Time</th>
                            <th>Table Number</th>
                            <th>Section Number</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookingData.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.name}</td>
                                <td>{order.phone}</td>
                                <td>{order.time}</td>
                                <td>{order.table}</td>
                                <td>{order.section}</td>
                                <td><button className="btn-edit">Edit Booking</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
