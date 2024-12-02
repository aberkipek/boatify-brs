import React, { useState, useEffect } from 'react';
import Boat from './Boat';

const RentedBoats = ({ onBoatClick }) => {
    const [rentedBoats, setRentedBoats] = useState([]);

    useEffect(() => {
        const fetchRentedBoats = () => {
            fetch('http://localhost:3001/rentals-with-boats', {
                method: 'GET',
                credentials: 'include',
            })
                .then(response => response.json())
                .then(data => {
                    setRentedBoats(data);
                })
                .catch(error => {
                    console.error('Error fetching rented boats:', error);
                });
        };

        fetchRentedBoats();

        const interval = setInterval(fetchRentedBoats, 2000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="rented-boats">
            <h2>Your Rented Boats</h2>
            <div className="boat-list">
                {rentedBoats.length > 0 ? (
                    rentedBoats.map(rental => (
                        <Boat key={rental.rental_id} boat={rental} onClick={onBoatClick} />
                    ))
                ) : (
                    <p>You have no rented boats.</p>
                )}
            </div>
        </div>
    );
};

export default RentedBoats;
