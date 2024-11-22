import React, { useState, useEffect } from 'react';
import Boat from './Boat';

const Boats = ({ onBoatClick }) => {
    const [boats, setBoats] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/boats', {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setBoats(data);
            })
            .catch(error => {
                console.error('Error fetching boats:', error);
            });
    }, [boats]);

    return (
        <div className="boats">
            <h2>Available Boats</h2>
            <div className="boat-list">
                {boats.length > 0 ? (
                    boats.map(boat => (
                        <Boat key={boat.boat_id} boat={boat} onClick={onBoatClick} />
                    ))
                ) : (
                    <p>No available boats found.</p>
                )}
            </div>
        </div>
    );
};

export default Boats;
