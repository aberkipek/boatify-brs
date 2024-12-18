import React, { useState, useEffect } from 'react';

const BoatForm = ({ onClose, boatToEdit = null }) => {
  const [boat_name, setName] = useState('');
  const [boat_price, setPrice] = useState('');
  const [boat_size, setSize] = useState('');
  const [boat_image_path, setImagePath] = useState('');
  const [boat_type, setType] = useState('');
  const [boat_description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (boatToEdit) {
      setName(boatToEdit.boat_name);
      setPrice(boatToEdit.boat_price);
      setSize(boatToEdit.boat_size);
      setImagePath(boatToEdit.boat_image_path);
      setType(boatToEdit.boat_type);
      setDescription(boatToEdit.boat_description);
      setIsEditing(true);
    }
  }, [boatToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const boatData = {
      boat_name,
      boat_price,
      boat_size,
      boat_image_path,
      boat_type,
      boat_description,
    };

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `http://localhost:3001/boat/${boatToEdit.boat_id}`
        : 'http://localhost:3001/addboat';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(boatData),
      });

      if (!response.ok) {
        throw new Error('Error saving boat');
      }

      alert(isEditing ? 'Boat updated successfully!' : 'Boat added successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving boat:', error);
      alert('There was an error saving the boat. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="boat-form">
      <h2>{isEditing ? 'Edit Boat' : 'Add New Boat'}</h2>

      <label>
        Boat Name:
        <input
          type="text"
          value={boat_name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Boat Price:
        <input
          type="number"
          value={boat_price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>

      <label>
        Boat Size:
        <input
          type="text"
          value={boat_size}
          onChange={(e) => setSize(e.target.value)}
          required
        />
      </label>

      <label>
        Boat Photo:
        <input
          type="url"
          value={boat_image_path}
          onChange={(e) => setImagePath(e.target.value)}
          required
          placeholder="https://example.com/image.jpg"
        />
      </label>

      <label>
        Boat Type:
        <select value={boat_type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Select</option>
          <option value="sailboat">Sailboat</option>
          <option value="motor boat">Motor Boat</option>
          <option value="fishing boat">Fishing Boat</option>
        </select>
      </label>

      <label>
        Boat Description:
        <textarea
          value={boat_description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Enter a brief description of the boat"
        />
      </label>

      <div className="button-container">
        <button type="submit">{isEditing ? 'Update Boat' : 'Add Boat'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default BoatForm;
