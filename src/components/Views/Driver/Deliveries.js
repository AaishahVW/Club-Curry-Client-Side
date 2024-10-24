import React from 'react';
import PropTypes from 'prop-types';
import '../Driver/DriverCSS/Deliveries.css';
import PendingDeliveries from '../../../images/PendingDeliveries.png';

const Deliveries = ({ deliveries = [], onUpdateStatus }) => {
  // Filter only pending deliveries
  const pendingDeliveries = deliveries.filter(delivery => delivery.status === 'pending');

  // Calculate total deliveries and percentage (for demo purposes, using static values)
  const totalPendingDeliveries = pendingDeliveries.length;
  const previousTotalDeliveries = 100; // Example previous value for total deliveries
  const percentageIncrease = ((totalPendingDeliveries - previousTotalDeliveries) / previousTotalDeliveries) * 100;

  return (
    <div className="deliveries-container">
      <div className="deliveries-summary"></div>
      <img src={PendingDeliveries} className="p-table-image" />
      <div className="total-pending-deliveries">
        <h4>Total Pending Deliveries</h4>
        <h1>{totalPendingDeliveries}</h1>
        
        <p className="percentage-change" style={{ color: percentageIncrease > 0 ? 'green' : 'red' }}>
          {percentageIncrease > 0 ? '▲' : '▼'} {Math.abs(percentageIncrease).toFixed(2)}%
        </p>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Customer Contact</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingDeliveries.length === 0 ? (
            <tr>
              <td colSpan="6">No pending deliveries</td>
            </tr>
          ) : (
            pendingDeliveries.map(delivery => (
              <tr key={delivery.deliveryId}>
                <td>{delivery.orderId}</td>
                <td>{delivery.customerName}</td>
                <td>{delivery.customerContact}</td>
                <td>{delivery.address}</td>
                <td>{delivery.status}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => onUpdateStatus(delivery.deliveryId, 'in transit')}
                  >
                    In Transit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

Deliveries.propTypes = {
  deliveries: PropTypes.array,
  onUpdateStatus: PropTypes.func.isRequired,
};

export default Deliveries;
