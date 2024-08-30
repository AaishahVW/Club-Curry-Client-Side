import React, { useState } from 'react';
import { Tab, Tabs, Row, Col, Card, Button, FormControl } from 'react-bootstrap';
import DriverDashboardHeader from './DriverDashboardHeader';
import './DriverDashboardContainer.css'; // Import the CSS file for styling

const DriverDashboardContainer = ({ onLogout }) => {
  // State to hold delivery data
  const [deliveries, setDeliveries] = useState([
    
    // Expanded sample delivery data
    {
      deliveryId: 1,
      orderId: 101,
      order: 'Pizza',
      price: 12.99,
      customerName: 'John Doe',
      customerContact: '123-456-7890',
      address: '123 Main St',
      status: 'pending',
      deliveryTime: null,
      deliveryNote: 'Please ring the doorbell',
    },
    {
      deliveryId: 2,
      orderId: 102,
      order: 'Burger',
      price: 9.99,
      customerName: 'Jane Smith',
      customerContact: '987-654-3210',
      address: '456 Elm St',
      status: 'in transit',
      deliveryTime: null,
      deliveryNote: 'Leave at the doorstep',
    },
    {
      deliveryId: 3,
      orderId: 103,
      order: 'Sushi',
      price: 15.99,
      customerName: 'Emily Johnson',
      customerContact: '555-123-4567',
      address: '789 Oak St',
      status: 'delivered',
      deliveryTime: '13:25',
      deliveryNote: '',
    },
    // Add more sample data as needed
  ]);

  // State to manage the search term for filtering completed deliveries
  const [searchTerm, setSearchTerm] = useState('');

  // Function to update the status of a delivery
  const handleUpdateStatus = (deliveryId, newStatus) => {
    const currentTime = newStatus === 'delivered' ? new Date().toLocaleString() : null;
    setDeliveries((prevDeliveries) =>
      prevDeliveries.map((delivery) =>
        delivery.deliveryId === deliveryId
          ? { ...delivery, status: newStatus, deliveryTime: currentTime }
          : delivery
      )
    );
  };

  // Function to handle changes in the search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter deliveries to get outstanding (not delivered) deliveries
  const outstandingDeliveries = deliveries.filter(
    (delivery) => delivery.status !== 'delivered'
  );

  // Filter deliveries to get completed (delivered) deliveries
  const deliveredDeliveries = deliveries.filter(
    (delivery) => delivery.status === 'delivered'
  );

  // Further filter completed deliveries based on the search term
  const filteredDeliveredDeliveries = deliveredDeliveries.filter(delivery =>
    delivery.orderId.toString().includes(searchTerm)
  );

  // Calculate the total number of new and completed orders
  const totalNewOrders = outstandingDeliveries.length;
  const totalCompletedOrders = deliveredDeliveries.length;

  // Sample driver profile data
  const driverProfile = {
    name: 'Jane Smith',
    vehicle: 'Toyota Prius',
    licensePlate: 'XYZ 1234',
    contact: '987-654-3210',
  };

  return (
    <div className="driver-dashboard-container">
      <DriverDashboardHeader isLoggedIn={true} onLogout={onLogout} />
      <div className="tabs-container">
        <Tabs defaultActiveKey="profile" id="driver-dashboard-tabs">
          <Tab eventKey="profile" title="Driver Profile">
            <Row className="m-3">
              <Col md={4}>
                {/* Driver Profile Card */}
                <Card className="dashboard-card mb-3">
                  <Card.Header>Driver Profile</Card.Header>
                  <Card.Body>
                    <p><strong>Name:</strong> {driverProfile.name}</p>
                    <p><strong>Vehicle:</strong> {driverProfile.vehicle}</p>
                    <p><strong>License Plate:</strong> {driverProfile.licensePlate}</p>
                    <p><strong>Contact:</strong> {driverProfile.contact}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={8}>
                <Row>
                  {/* Summary Cards */}
                  <Col md={12} className="mb-3">
                    <Card className="dashboard-card">
                      <Card.Header>Total New Orders</Card.Header>
                      <Card.Body>
                        <p><strong>{totalNewOrders}</strong></p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={12}>
                    <Card className="dashboard-card">
                      <Card.Header>Total Completed Orders</Card.Header>
                      <Card.Body>
                        <p><strong>{totalCompletedOrders}</strong></p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="new-orders" title="New Deliveries">
            <Row className="m-3">
              {outstandingDeliveries.length > 0 ? (
                outstandingDeliveries.map((delivery) => (
                  <Col md={6} lg={4} key={delivery.deliveryId}>
                    <Card className="dashboard-card mb-3">
                      <Card.Header>Order ID: {delivery.orderId}</Card.Header>
                      <Card.Body>
                        <p><strong>Address:</strong> {delivery.address}</p>
                        <p><strong>Status:</strong> {delivery.status}</p>
                        <p><strong>Customer Contact:</strong> {delivery.customerContact}</p>
                        <p><strong>Customer Name:</strong> {delivery.customerName}</p>
                        <p><strong>Order:</strong> {delivery.order}</p>
                        <p><strong>Price:</strong> ${delivery.price.toFixed(2)}</p>
                        <p><strong>Delivery Note:</strong> {delivery.deliveryNote}</p>
                        {delivery.status === 'pending' && (
                          <Button
                            className="btn btn-primary me-2"
                            onClick={() => handleUpdateStatus(delivery.deliveryId, 'in transit')}
                          >
                            Mark as In Transit
                          </Button>
                        )}
                        {delivery.status === 'in transit' && (
                          <Button
                            className="btn btn-success"
                            onClick={() => handleUpdateStatus(delivery.deliveryId, 'delivered')}
                          >
                            Mark as Delivered
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col>
                  <p>No new deliveries.</p>
                </Col>
              )}
            </Row>
          </Tab>
          <Tab eventKey="completed-orders" title="Completed Deliveries">
            <Row className="m-3">
              <Col md={12} className="mb-3">
                <FormControl
                  type="text"
                  placeholder="Search by Order ID"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </Col>
              {filteredDeliveredDeliveries.length > 0 ? (
                filteredDeliveredDeliveries.map((delivery) => (
                  <Col md={6} lg={4} key={delivery.deliveryId}>
                    <Card className="dashboard-card mb-3">
                      <Card.Header>Order ID: {delivery.orderId}</Card.Header>
                      <Card.Body>
                        <p><strong>Address:</strong> {delivery.address}</p>
                        <p><strong>Status:</strong> {delivery.status}</p>
                        <p><strong>Customer Contact:</strong> {delivery.customerContact}</p>
                        <p><strong>Customer Name:</strong> {delivery.customerName}</p>
                        <p><strong>Order:</strong> {delivery.order}</p>
                        <p><strong>Price:</strong> ${delivery.price.toFixed(2)}</p>
                        <p><strong>Delivery Time:</strong> {delivery.deliveryTime}</p>
                        <p><strong>Delivery Note:</strong> {delivery.deliveryNote}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col>
                  <p>No completed deliveries.</p>
                </Col>
              )}
            </Row>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverDashboardContainer;
