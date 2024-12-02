import React from 'react';

const BoatDetails = ({ selectedBoat, onRentClick }) => (
    <div className="boat-details">
        <img src={selectedBoat.boat_image_path} alt={selectedBoat.boat_name} className="boat-image" />
        <p><strong>Price per Day:</strong> ${selectedBoat.boat_price}</p>
        <p><strong>Boat Type:</strong> {selectedBoat.boat_type}</p>
        <p><strong>Size:</strong> {selectedBoat.boat_size}</p>
        <p>
            <strong>Rating: </strong>
            {selectedBoat.average_rating ? selectedBoat.average_rating + " / 5" : "No ratings yet"}
        </p>
        <p><strong>Description:</strong> {selectedBoat.boat_description}</p>
        <button className="rent-button" onClick={onRentClick}>Rent This Boat</button>
    </div>
);

export default BoatDetails;
