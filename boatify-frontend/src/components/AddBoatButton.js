import React, { useState } from 'react';

const BoatRegisterForm = ({ onClose }) => {
  const [boat_name, setName] = useState('');
  const [boat_price, setPrice] = useState('');
  const [boat_size, setSize] = useState('');
  const [boat_image_path, setImagePath] = useState('');
  const [boat_type, setType] = useState('');
  const [boat_description, setDescription] = useState('');

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
      const response = await fetch('http://localhost:3001/addboat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(boatData),
      });

      if (!response.ok) {
        throw new Error('Error adding boat');
      }

      alert('Boat added successfully!');

      onClose();
      setName('');
      setPrice('');
      setSize('');
      setImagePath('');
      setType('');
      setDescription('');

    } catch (error) {
      console.error('Error adding boat:', error);
      alert('There was an error adding the boat. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="boat-register-form">
      <h2>Add New Boat</h2>

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
        <button type="submit">Add Boat</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

const AddBoatButton = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const openBoatRegisterForm = () => {
    setIsFormVisible(true);
  };

  const closeBoatRegisterForm = () => {
    setIsFormVisible(false);
  };

  return (
    <div className="add-boat-button-container">
      <button className="add-button" onClick={openBoatRegisterForm}>Add New Boat</button>
      {isFormVisible && (
        <div className="form-overlay">
          <BoatRegisterForm onClose={closeBoatRegisterForm} />
        </div>
      )}
    </div>
  );
};

export default AddBoatButton;
