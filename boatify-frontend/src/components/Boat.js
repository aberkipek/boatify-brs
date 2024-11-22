import React from 'react';

const Boat = ({ boat, onClick }) => {
    return (
        <div className="boat" onClick={() => onClick(boat)}>
            <img src={boat.boat_image_path} alt={boat.boat_name} className="boat-image" />
            <h3>{boat.boat_name}</h3>
        </div>
    );
};

export default Boat;
