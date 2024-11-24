import React, { useState, useEffect } from 'react';
import BoatDetails from './BoatDetails';

const RentalForm = ({ selectedBoat, handleSubmitRental, closePopup }) => {
    const [rentalStartDate, setRentalStartDate] = useState('');
    const [rentalEndDate, setRentalEndDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [showForm, setShowForm] = useState(false);

    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0]; // yyyy-mm-dd format

    useEffect(() => {
        if (rentalStartDate && rentalEndDate) {
            const startDate = new Date(rentalStartDate);
            const endDate = new Date(rentalEndDate);
            const rentalDuration = Math.ceil((endDate - startDate) / (1000 * 3600 * 24));
            const pricePerDay = selectedBoat.boat_price;
            const totalPrice = pricePerDay * rentalDuration > 0 ? pricePerDay * rentalDuration : 0;
            setTotalPrice(totalPrice);
        }
    }, [rentalStartDate, rentalEndDate, selectedBoat]);

    const handleRentButtonClick = () => {
        setShowForm(true);
    };

    const handleRentalSubmit = () => {
        if (!rentalStartDate || !rentalEndDate) {
            alert("Both start date and end date must be specified.");
            return;
        }

        const startDate = new Date(rentalStartDate);
        const endDate = new Date(rentalEndDate);

        if (startDate >= endDate) {
            alert("Rental start date must be before the end date.");
            return;
        }

        const rentalPayload = {
            boat_id: selectedBoat.boat_id,
            rental_start_date: rentalStartDate,
            rental_end_date: rentalEndDate,
            total_price: totalPrice,
        };

        handleSubmitRental(rentalPayload);
    };

    return (
        <div className="boat-popup-overlay">
            <div className="boat-popup">
                <button className="close-popup" onClick={closePopup}>X</button>
                <h3>{selectedBoat.boat_name}</h3>

                {!showForm ? (
                    <BoatDetails selectedBoat={selectedBoat} onRentClick={handleRentButtonClick} />
                ) : (
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label>Rental Start Date:</label>
                            <input
                                type="date"
                                value={rentalStartDate}
                                onChange={(e) => setRentalStartDate(e.target.value)}
                                required
                                min={today}
                            />
                        </div>
                        <div className="form-group">
                            <label>Rental End Date:</label>
                            <input
                                type="date"
                                value={rentalEndDate}
                                onChange={(e) => setRentalEndDate(e.target.value)}
                                required
                                min={tomorrowDate}
                            />
                        </div>
                        <div className="form-group">
                            <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="form-group">
                            <button type="button" onClick={handleRentalSubmit}>Submit Rental</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RentalForm;
