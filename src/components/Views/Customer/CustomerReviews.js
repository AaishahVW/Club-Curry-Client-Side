import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../Customer/CustomerCss/CustomerReviews.css'; // Ensure you have the CSS file for custom styles

// CustomerReviews component definition
const CustomerReviews = ({ onAddReview, onEditReview, onDeleteReview, customerId, existingReviews }) => {

  // State variables for managing modal visibility and form inputs
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [foodRating, setFoodRating] = useState('');
  const [serviceRating, setServiceRating] = useState('');
  const [atmosphereRating, setAtmosphereRating] = useState('');
  const [recommendedDishes, setRecommendedDishes] = useState('');
  const [comments, setComments] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [editReview, setEditReview] = useState(null);

  // Filter reviews for the specific customer
  const customerReviews = existingReviews.filter(review => review.customerId === customerId);

  // Function to show the modal for adding a new review
  const handleOpenModal = () => setShowModal(true);

  // Function to hide the modal for adding a new review and reset form fields
  const handleCloseModal = () => {
    setShowModal(false);
    setAlertMessage('');
    resetFormFields();
  };

  // Function to show the modal for editing an existing review
  const handleOpenEditModal = (review) => {
    setEditReview(review);
    setFoodRating(review.foodRating);
    setServiceRating(review.serviceRating);
    setAtmosphereRating(review.atmosphereRating);
    setRecommendedDishes(review.recommendedDishes.join(', '));
    setComments(review.comments);
    setShowEditModal(true);
  };

   // Function to hide the modal for editing a review and reset form fields
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditReview(null);
    setAlertMessage('');
    resetFormFields();
  };

  // Function to reset all form fields
  const resetFormFields = () => {
    setFoodRating('');
    setServiceRating('');
    setAtmosphereRating('');
    setRecommendedDishes('');
    setComments('');
  };

  // Function to handle form submission for adding a new review
  const handleSubmitReview = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!foodRating || !serviceRating || !atmosphereRating || !comments) {
      setAlertMessage('Please fill in all required fields.');
      return;
    }

    // Create a new review object
    const newReview = {
      id: Date.now().toString(), // Unique ID for the review
      customerId,
      customerName: 'Customer', // Replace with actual customer name if available
      foodRating: parseInt(foodRating),
      serviceRating: parseInt(serviceRating),
      atmosphereRating: parseInt(atmosphereRating),
      recommendedDishes: recommendedDishes.split(',').map(dish => dish.trim()),
      comments,
    };

    // Pass the new review to the parent component
    onAddReview(newReview);
    setAlertMessage('Thank you for your review!');
    handleCloseModal();
  };

  const handleEditReview = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!foodRating || !serviceRating || !atmosphereRating || !comments) {
      setAlertMessage('Please fill in all required fields.');
      return;
    }

    // Create an updated review object
    const updatedReview = {
      ...editReview,
      foodRating: parseInt(foodRating),
      serviceRating: parseInt(serviceRating),
      atmosphereRating: parseInt(atmosphereRating),
      recommendedDishes: recommendedDishes.split(',').map(dish => dish.trim()),
      comments,
    };

    // Pass the updated review to the parent component
    onEditReview(updatedReview);
    setAlertMessage('Review updated successfully!');
    handleCloseEditModal();
  };

  // Function to handle deletion of a review
  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      onDeleteReview(reviewId);
    }
  };

  return (
    <div className="review-section">
      <h3 className="form-heading">Your Reviews</h3>

      {customerReviews.length === 0 ? (
        <p>No reviews found. Click below to make a review.</p>
      ) : (
        <div className="card-slider">
          <div className="card-slider-inner">
            {customerReviews.map((review) => (
              <Card key={review.id} className="review-card">
                <Card.Body>
                  <Card.Title>{review.customerName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    <strong>Food Rating:</strong> {review.foodRating}/5
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">
                    <strong>Service Rating:</strong> {review.serviceRating}/5
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">
                    <strong>Atmosphere Rating:</strong> {review.atmosphereRating}/5
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Recommended Dishes:</strong> {review.recommendedDishes.join(', ')}
                  </Card.Text>
                  <Card.Text>
                    <strong>Comments:</strong> {review.comments}
                  </Card.Text>
                  <Button variant="secondary" onClick={() => handleOpenEditModal(review)} className="mr-2">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteReview(review.id)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Button variant="primary" onClick={handleOpenModal} className="mt-3">
        Make a Review
      </Button>

      {/* Modal for review form */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Leave a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertMessage && <Alert variant="info">{alertMessage}</Alert>}
          <Form onSubmit={handleSubmitReview}>
            <Form.Group controlId="foodRating">
              <Form.Label>Food Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={foodRating}
                onChange={(e) => setFoodRating(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="serviceRating" className="mt-3">
              <Form.Label>Service Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={serviceRating}
                onChange={(e) => setServiceRating(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="atmosphereRating" className="mt-3">
              <Form.Label>Atmosphere Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={atmosphereRating}
                onChange={(e) => setAtmosphereRating(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="recommendedDishes" className="mt-3">
              <Form.Label>Recommended Dishes (comma separated)</Form.Label>
              <Form.Control
                type="text"
                value={recommendedDishes}
                onChange={(e) => setRecommendedDishes(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="comments" className="mt-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Submit Review
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for editing review */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertMessage && <Alert variant="info">{alertMessage}</Alert>}
          <Form onSubmit={handleEditReview}>
            <Form.Group controlId="foodRating">
              <Form.Label>Food Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={foodRating}
                onChange={(e) => setFoodRating(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="serviceRating" className="mt-3">
              <Form.Label>Service Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={serviceRating}
                onChange={(e) => setServiceRating(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="atmosphereRating" className="mt-3">
              <Form.Label>Atmosphere Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={atmosphereRating}
                onChange={(e) => setAtmosphereRating(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="recommendedDishes" className="mt-3">
              <Form.Label>Recommended Dishes (comma separated)</Form.Label>
              <Form.Control
                type="text"
                value={recommendedDishes}
                onChange={(e) => setRecommendedDishes(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="comments" className="mt-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Update Review
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

CustomerReviews.propTypes = {
  onAddReview: PropTypes.func.isRequired,
  onEditReview: PropTypes.func.isRequired,
  onDeleteReview: PropTypes.func.isRequired,
  customerId: PropTypes.string.isRequired,
  existingReviews: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    customerId: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    foodRating: PropTypes.number.isRequired,
    serviceRating: PropTypes.number.isRequired,
    atmosphereRating: PropTypes.number.isRequired,
    recommendedDishes: PropTypes.arrayOf(PropTypes.string).isRequired,
    comments: PropTypes.string.isRequired,
  })).isRequired,
};

export default CustomerReviews;
