import React from 'react';

const Review = ({ review, onEditClick, onDeleteClick }) => {
    return (
        <div className="review">
            <h3>{review.boat_name}</h3>
            <p>
                <strong>Rating:</strong> {review.rating} / 5
            </p>
            <p>
                <strong>Date:</strong> {new Date(review.review_date).toLocaleDateString()}
            </p>
            <p>
                <strong>Review:</strong> {review.review_text}
            </p>
            <div>
                <button onClick={() => onEditClick(review)}>Edit</button>
                <button
                    onClick={() =>
                        window.confirm('Are you sure you want to delete this review?') && onDeleteClick(review.review_id)
                    }
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default Review;
