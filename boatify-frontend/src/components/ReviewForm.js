import React from 'react';

const ReviewForm = ({
    selectedBoat,
    rating,
    reviewText,
    setRating,
    setReviewText,
    closePopup,
    handleSubmitReview,
}) => (
    <div className="boat-popup-overlay">
        <div className="boat-popup">
            <button className="close-popup" onClick={closePopup}>X</button>
            <h3>Review {selectedBoat.boat_name}</h3>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>Rating (1-5):</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Review:</label>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <button onClick={handleSubmitReview}>Submit Review</button>
                </div>
            </form>
        </div>
    </div>
);

export default ReviewForm;
