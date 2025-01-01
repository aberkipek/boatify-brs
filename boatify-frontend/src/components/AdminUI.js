import React, { useState, useEffect } from 'react';
import BoatForm from './BoatForm';
import '../styles/AdminUI.css';

const AdminUI = () => {
    const [boats, setBoats] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [boatToEdit, setBoatToEdit] = useState(null);

    useEffect(() => {
        fetchBoats();
        const intervalId = setInterval(fetchBoats, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const fetchBoats = async () => {
        try {
            const response = await fetch('http://localhost:3001/allboats');
            if (response.ok) {
                const data = await response.json();
                setBoats(data);
            } else {
                throw new Error('Failed to fetch boats');
            }
        } catch (error) {
            console.error('Error fetching boats:', error);
        }
    };

    const handleDeleteBoat = async (boatId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this boat?');

        if (isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3001/boat/${boatId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete boat');
                }

                alert('Boat deleted successfully!');
                fetchBoats();
            } catch (error) {
                console.error('Error deleting boat:', error);
                alert('There was an error deleting the boat. Please try again.');
            }
        }
    };

    const openBoatForm = (boat = null) => {
        setBoatToEdit(boat);
        setIsFormVisible(true);
    };

    const closeBoatForm = () => {
        setBoatToEdit(null);
        setIsFormVisible(false);
    };

    return (
        <div className="admin-ui">
            <button className="add-boat-btn" onClick={() => openBoatForm()}>Add New Boat</button>

            {isFormVisible && (
                <div className="form-overlay">
                    <BoatForm onClose={closeBoatForm} boatToEdit={boatToEdit} />
                </div>
            )}

            <div className="boat-list-container">
                {boats.length === 0 ? (
                    <div className="no-boats-message">No boats added yet</div>
                ) : (
                    <div className="boat-list">
                        {boats.map((boat) => (
                            <div key={boat.boat_id} className="boat-card">
                                <div className="boat-image-container">
                                    <img className="boat-image" src={boat.boat_image_path} alt={boat.name} />
                                </div>
                                <div className="boat-info">
                                    <h3>{boat.name}</h3>
                                    <div className="boat-actions">
                                        <button className="edit-button" onClick={() => openBoatForm(boat)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDeleteBoat(boat.boat_id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUI;
