import React from 'react';

const ReviewForm = ({
    selectedBoat,
    rating,
    reviewText,
    setRating,
    setReviewText,
    closePopup,
    handleSubmit,
    isEditMode,
    handleCancelRental,
}) => (
    <div className="boat-popup-overlay">
        <div className="boat-popup">
            <button className="close-popup" onClick={closePopup}>X</button>
            <h3>{isEditMode ? `Edit Review for ${selectedBoat?.boat_name}` : `Review ${selectedBoat.boat_name}`}</h3>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>Rating (1-5):</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                    >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
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
                    <button onClick={handleSubmit}>
                        {isEditMode ? 'Update Review' : 'Submit Review'}
                    </button>
                </div>
            </form>

            {!isEditMode && (
                <div className="form-group">
                    <button
                        type="button"
                        className="cancel-rental-button"
                        onClick={handleCancelRental}
                    >
                        Cancel Rental
                    </button>
                </div>
            )}
        </div>
    </div>
);

export default ReviewForm;
