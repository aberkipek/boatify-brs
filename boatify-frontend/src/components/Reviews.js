import React, { useState, useEffect } from 'react';
import Review from './Review';
import ReviewForm from './ReviewForm';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        const fetchReviews = () => {
            fetch('http://localhost:3001/reviews', {
                method: 'GET',
                credentials: 'include',
            })
                .then((response) => response.json())
                .then((data) => {
                    setReviews(data);
                })
                .catch((error) => {
                    console.error('Error fetching reviews:', error);
                });
        };
    
        fetchReviews();
    
        const interval = setInterval(fetchReviews, 2000);
    
        return () => clearInterval(interval);
    }, []);  
    
    const handleDeleteClick = (reviewId) => {
        fetch(`http://localhost:3001/reviews/${reviewId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    alert('Review deleted successfully');
                } else {
                    alert('Error deleting review');
                }
            })
            .catch((error) => {
                console.error('Error deleting review:', error);
                alert('Error deleting review');
            });
    };

    const handleSubmitUpdate = (updatedReview) => {
        fetch(`http://localhost:3001/reviews/${updatedReview.review_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rating: updatedReview.rating,
                review_text: updatedReview.review_text,
            }),
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    alert('Review updated successfully');
                    setReviews((prev) =>
                        prev.map((review) =>
                            review.review_id === updatedReview.review_id ? { ...review, ...updatedReview } : review
                        )
                    );
                    setEditingReview(null);
                } else {
                    alert('Error updating review');
                }
            })
            .catch((error) => {
                console.error('Error updating review:', error);
                alert('Error updating review');
            });
    };

    return (
        <div className="reviews">
            <h2>Your Reviews</h2>
            <div className="review-list">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <Review
                            key={review.review_id}
                            review={review}
                            onEditClick={() => setEditingReview(review)}
                            onDeleteClick={handleDeleteClick}
                        />
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>

            {editingReview && (
                <ReviewForm
                    selectedBoat={{ boat_name: editingReview.boat_name }}
                    rating={editingReview.rating}
                    reviewText={editingReview.review_text}
                    setRating={(rating) =>
                        setEditingReview((prev) => ({ ...prev, rating }))
                    }
                    setReviewText={(text) =>
                        setEditingReview((prev) => ({ ...prev, review_text: text }))
                    }
                    closePopup={() => setEditingReview(null)}
                    handleSubmit={() => handleSubmitUpdate(editingReview)}
                    isEditMode={true}
                />
            )}
        </div>
    );
};

export default Reviews;
