import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import StarRating from '../../Common/StarRating';
import '../Customer/CustomerCss/CustomerReviews.css';
import review from '../../../images/review.svg';
import QR from '../../../images/QR.png';
import RestaurantDetails from "./RestaurantDetails";
import FAQ from './FAQ';
import yReviews from '../../../images/yReviews.png'


// Mapping numeric ratings to enum values
const ratingValues = {
  0: 'ZERO',
  1: 'ONE',
  2: 'TWO',
  3: 'THREE',
  4: 'FOUR',
  5: 'FIVE',
};

const CustomerReviews = ({ onAddReview, onDeleteReview, customer }) => {
  const [existingReviews, setExistingReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [foodRating, setFoodRating] = useState('ZERO'); // Use string values
  const [serviceRating, setServiceRating] = useState('ZERO'); // Use string values
  const [atmosphereRating, setAtmosphereRating] = useState('ZERO'); // Use string values
  const [comments, setComments] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/ClubCurry/review/getAllByCustomerEmail/${customer.email}`);
        setExistingReviews(response.data);
      } catch (error) {
        console.error('Error fetching customer reviews:', error);
      }
    };

    if (customer?.email) {
      fetchReviews();
    }
  }, [customer]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setAlertMessage('');
    resetFormFields();
  };

  const resetFormFields = () => {
    setFoodRating('ZERO'); // Reset to string
    setServiceRating('ZERO'); // Reset to string
    setAtmosphereRating('ZERO'); // Reset to string
    setComments('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    console.log('Submitting review...');
    console.log('Food Rating:', foodRating);
    console.log('Service Rating:', serviceRating);
    console.log('Atmosphere Rating:', atmosphereRating);
    console.log('Comments:', comments);

    if (foodRating === 'ZERO' || serviceRating === 'ZERO' || atmosphereRating === 'ZERO' || !comments) {
      setAlertMessage('Please fill in all required fields.');
      console.log('Validation failed:', alertMessage);
      return;
    }

    const newReview = {
      customer: { email: customer.email },
      rating: {
        foodQuality: foodRating,
        serviceQuality: serviceRating,
        atmosphereQuality: atmosphereRating,
      },
      note :comments,
    };

    try {
      const response = await axios.post('http://localhost:8080/ClubCurry/review/save', newReview);
      console.log('Review submitted successfully:', response.data);
      setExistingReviews([...existingReviews, response.data]);
      setAlertMessage('Thank you for your review!');
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting review:', error);
      setAlertMessage('Error submitting review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`http://localhost:8080/ClubCurry/review/delete/${reviewId}`);
        setExistingReviews(existingReviews.filter((review) => review.id !== reviewId));
        onDeleteReview(reviewId);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  return (
    <div className="review-section">
      <img src={review} alt="review header" className="review-image"  />

      <div className="reviews-container">
      <img src={yReviews} className="reviews-section-image" />
      {existingReviews.length === 0 ? (
          <p>No reviews found. Click below to make a review.</p>
        ) : (
          <div className="reviews-slider">
            <button className="arrow left-arrow" onClick={() => { /* Handle left scroll */ }}>
              &lt;
            </button>
            <div className="reviews-list">
              {existingReviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span>{review.customerName}</span> {/* Dynamic customer name */}
                    <span className="review-timestamp">{review.timestamp}</span>
                  </div>
                  <div className="review-body">
                    <div className="rating-item">
                      <p><strong>Food Rating:</strong> {review.rating.foodQuality}</p>
                      <StarRating rating={review.rating.foodQuality} readOnly />
                    </div>
                    <div className="rating-item">
                      <p><strong>Service Rating:</strong> {review.rating.serviceQuality}</p>
                      <StarRating rating={review.rating.serviceQuality} readOnly />
                    </div>
                    <div className="rating-item">
                      <p><strong>Atmosphere Rating:</strong> {review.rating.atmosphereQuality}</p>
                      <StarRating rating={review.rating.atmosphereQuality} readOnly />
                    </div>
                    <div className="rating-item">
                      {/* Horizontal line below the customer name */}
                      <hr className="review-divider" />
                      <p>{review.note}</p>
                    </div>
                  </div>
                  <div className="review-actions">
                    <Button variant="danger" onClick={() => handleDeleteReview(review.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <button className="arrow right-arrow" onClick={() => { /* Handle right scroll */ }}>
              &gt;
            </button>
          </div>
        )}
      </div>

      <div className="feedback-section">
        <div className="feedback-text">
        <h3>Thank you for being part of our family!</h3>
<p>Your continued support means the world to us, and we are truly grateful for your loyalty. As a token of our appreciation, every reviewer will receive a <strong>10% discount</strong> on their next visit.</p>
<p>Whether it's for a quick bite or a special occasion, we can't wait to serve you again. Don't forget to ask us about the discount when you're here, and show your review to redeem it!</p>
<p>We hope to continue delighting you with every meal and experience. Thank you for being an essential part of the <strong>ClubCurry</strong> community!</p>

          <Button  onClick={handleOpenModal} className="add-review-button">
            Add Review
          </Button>
        </div>
        <img src={QR} alt="QR code" className="qr-image" />
      </div>

      {/* Modal for adding a review */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Your Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertMessage && <Alert variant="success">{alertMessage}</Alert>}
          <Form onSubmit={handleSubmitReview}>
            <Form.Group>
              <Form.Label>Food Rating</Form.Label>
              <StarRating rating={foodRating} onRate={(rate) => setFoodRating(ratingValues[rate])} /> {/* Update here */}
            </Form.Group>
            <Form.Group>
              <Form.Label>Service Rating</Form.Label>
              <StarRating rating={serviceRating} onRate={(rate) => setServiceRating(ratingValues[rate])} /> {/* Update here */}
            </Form.Group>
            <Form.Group>
              <Form.Label>Atmosphere Rating</Form.Label>
              <StarRating rating={atmosphereRating} onRate={(rate) => setAtmosphereRating(ratingValues[rate])} /> {/* Update here */}
            </Form.Group>
            <Form.Group>
              <Form.Label>Comments</Form.Label>
              <Form.Control as="textarea" rows={3} value={comments} onChange={(e) => setComments(e.target.value)} required />
            </Form.Group>
            <Button type="submit" variant="primary">
              Submit Review
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <FAQ/>
      <RestaurantDetails />
    </div>
  );
};

CustomerReviews.propTypes = {
  onAddReview: PropTypes.func.isRequired,
  onDeleteReview: PropTypes.func.isRequired,
  customer: PropTypes.object.isRequired,
};

export default CustomerReviews;
