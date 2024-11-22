import React, { useState } from 'react';
import Boats from './Boats';
import RentedBoats from './RentedBoats';
import RentalForm from './RentalForm';
import ReviewForm from './ReviewForm';
import '../styles/UserUI.css';

const UserUI = ({ userData }) => {
    const [selectedBoat, setSelectedBoat] = useState(null);
    const [formState, setFormState] = useState({
        showRentalForm: false,
        showReviewForm: false,
    });
    const [reviewData, setReviewData] = useState({
        rating: 1,
        reviewText: '',
    });

    const handleAvailableBoatClick = (boat) => {
        setSelectedBoat(boat);
        setFormState({ showRentalForm: true, showReviewForm: false });
    };

    const handleRentedBoatClick = (boat) => {
        setSelectedBoat(boat);
        setFormState({ showRentalForm: false, showReviewForm: true });
    };

    const closePopup = () => {
        setSelectedBoat(null);
        setFormState({ showRentalForm: false, showReviewForm: false });
        setReviewData({ rating: 1, reviewText: '' });
    };

    const handleSubmitRental = async (rentalData) => {
        const rentalPayload = {
            ...rentalData,
            user_id: userData.userId
        }
        try {
            const response = await fetch('http://localhost:3001/rentals', {
                method: 'POST',
                body: JSON.stringify(rentalPayload),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            console.log(rentalPayload);

            if (response.ok) {
                alert('Rental Submitted!');
                closePopup();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Unable to submit rental.'}`);
            }
        } catch (error) {
            console.error('Error submitting rental:', error);
            alert('Error submitting rental.');
        }
    };

    const handleSubmitReview = async () => {
        if (reviewData.reviewText.trim() === "") {
            alert("Review text cannot be empty.");
            return;
        }

        const reviewPayload = {
            boat_id: selectedBoat.boat_id,
            user_id: userData.userId,
            review_date: new Date().toISOString().split('T')[0],
            rating: reviewData.rating,
            review_text: reviewData.reviewText,
        };

        try {
            const response = await fetch('http://localhost:3001/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewPayload),
                credentials: 'include',
            });

            if (response.ok) {
                alert('Review submitted successfully!');
                closePopup();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Unable to submit review.'}`);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('An error occurred while submitting the review.');
        }
    };

    return (
        <div className="user-ui">
            <div className="sections">
                <div className="boats-section">
                    <RentedBoats onBoatClick={handleRentedBoatClick} />
                </div>
                <div className="boats-section">
                    <Boats onBoatClick={handleAvailableBoatClick} />
                </div>

                {selectedBoat && formState.showRentalForm && (
                    <RentalForm
                        selectedBoat={selectedBoat}
                        handleSubmitRental={handleSubmitRental}
                        closePopup={closePopup}
                    />
                )}
                {selectedBoat && formState.showReviewForm && (
                    <ReviewForm
                        selectedBoat={selectedBoat}
                        rating={reviewData.rating}
                        reviewText={reviewData.reviewText}
                        setRating={(rating) =>
                            setReviewData((prev) => ({ ...prev, rating }))}
                        setReviewText={(text) =>
                            setReviewData((prev) => ({ ...prev, reviewText: text }))}
                        closePopup={closePopup}
                        handleSubmitReview={handleSubmitReview}
                    />
                )}
            </div>
        </div>
    );
};

export default UserUI;
