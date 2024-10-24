import React from 'react';
import './DriverCSS/CompletedDeliveries.css';
import cDeliveries from '../../../images/cDeliveries.png';

const CompletedDeliveries = () => {
  // Dummy data for completed deliveries
  const dummyDeliveries = [
    {
      deliveryId: 1,
      orderId: 101,
      order: 'Pizza',
      price: 12.99,
      customerName: 'John Doe',
      customerContact: '123-456-7890',
      address: '123 Main St',
      status: 'completed',
      deliveryTime: '12:30 PM',
      deliveryNote: 'Please ring the doorbell',
    },
    {
      deliveryId: 2,
      orderId: 102,
      order: 'Burger',
      price: 8.99,
      customerName: 'Jane Smith',
      customerContact: '987-654-3210',
      address: '456 Elm St',
      status: 'pending',
      deliveryTime: null,
      deliveryNote: 'Leave it at the front desk',
    },
    {
      deliveryId: 3,
      orderId: 103,
      order: 'Pasta',
      price: 15.99,
      customerName: 'Anna Brown',
      customerContact: '555-789-1234',
      address: '789 Oak St',
      status: 'completed',
      deliveryTime: '1:00 PM',
      deliveryNote: 'Knock twice, please',
    },
    {
      deliveryId: 4,
      orderId: 104,
      order: 'Salad',
      price: 10.99,
      customerName: 'Tom Hanks',
      customerContact: '321-654-0987',
      address: '123 Cedar Blvd',
      status: 'pending',
      deliveryTime: null,
      deliveryNote: 'Call when you arrive',
    },
    {
      deliveryId: 5,
      orderId: 105,
      order: 'Sushi',
      price: 22.50,
      customerName: 'Lucy Hale',
      customerContact: '321-789-6540',
      address: '321 Cedar Blvd',
      status: 'completed',
      deliveryTime: '2:30 PM',
      deliveryNote: 'Leave on the porch',
    },
  ];

  // Filter only completed deliveries
  const completedDeliveries = dummyDeliveries.filter(delivery => delivery.status === 'completed');

  // Calculate total deliveries and percentage change (for demo purpose, using static values)
  const totalDeliveries = completedDeliveries.length;
  const previousTotalDeliveries = 1000; // Example previous value
  const percentageIncrease = ((totalDeliveries - previousTotalDeliveries) / previousTotalDeliveries) * 100;

  return (
    <div className="completed-deliveries-container">
      <div className="deliveries-summary">
        <img src={cDeliveries} className="c-table-image" />
        <div className="total-deliveries">
          <h4>Total Deliveries</h4>
          <h1>{totalDeliveries}</h1>
          <p className="percentage-change" style={{ color: percentageIncrease > 0 ? 'green' : 'red' }}>
            {percentageIncrease > 0 ? '▲' : '▼'} {Math.abs(percentageIncrease).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="deliveries-grid">
        {completedDeliveries.map(delivery => (
          <div key={delivery.deliveryId} className="delivery-card">
            <h3>Order #{delivery.orderId}</h3>
            <p>Customer: {delivery.customerName}</p>
            <p>Address: {delivery.address}</p>
            <p>Delivery Time: {delivery.deliveryTime || 'Not yet delivered'}</p>
            <p>Note: {delivery.deliveryNote}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedDeliveries;
