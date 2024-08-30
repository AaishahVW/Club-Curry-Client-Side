import React, { useState, useEffect } from 'react'; // Import useState and useEffect from React
import axios from 'axios'; // Import axios for making HTTP requests
import { Card } from 'react-bootstrap'; // Import Card component from react-bootstrap
import PropTypes from 'prop-types'; // Import PropTypes for type-checking
import '../Customer/CustomerCss/ReviewSection.css';

// Review component to display individual reviews
const Review = ({ review }) => (
  <Card className="review-card mb-3">
    <Card.Body>
      <Card.Title>{review.customer.name}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">
        Food Rating: {review.rating.foodQuality} | Service Rating: {review.rating.serviceQuality} | Atmosphere Rating: {review.rating.atmosphereQuality} {/*I changed the review rating access*/}
      </Card.Subtitle>
      <Card.Text>
        <strong>Comments:</strong> {review.note}
      </Card.Text>
    </Card.Body>
  </Card>
);

// PropTypes for the Review component to validate props
Review.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.string.isRequired,  // Unique ID of the review
    note: PropTypes.string.isRequired, // Review comments
    customer: PropTypes.shape({
      name: PropTypes.string.isRequired // Name of the customer who wrote the review
    }).isRequired,
    rating: PropTypes.shape({
      foodQuality: PropTypes.number.isRequired,       // Food quality rating
      serviceQuality: PropTypes.number.isRequired,    // Service quality rating
      atmosphereQuality: PropTypes.number.isRequired  // Atmosphere quality rating
    }).isRequired
  }).isRequired,
};{/*changed definition to be in line with the database */}

// ReviewSection component to fetch and display reviews
const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch reviews from the API when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8080/ClubCurry/review/getAll'); // Get the actual API endpoint
        console.log(response);
        setReviews(response.data); // Update the state with the fetched reviews
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error loading reviews: {error}</p>;

  return (
    <div className="review-section">
      <h2 className="section-heading mb-5 mt-3">CUSTOMER REVIEWS</h2>
      <div className="existing-reviews">
        {reviews.length > 0 ? (
          reviews.map(review => <Review key={review.id} review={review} /> )
        ) : (
          <p>No reviews yet. Be the first to leave a review!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;