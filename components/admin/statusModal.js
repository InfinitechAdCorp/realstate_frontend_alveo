import React, { useState } from 'react';

const statusModal = ({ isOpen, closeModal }) => {
  const [inputValue, setInputValue] = useState(''); // State to handle input field
  const [error, setError] = useState(''); // State to handle errors
  const [success, setSuccess] = useState(''); // State to show success messages

  // Handle change in input field
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Submit data to the backend using fetch
  const handleSubmit = async () => {
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    const formData = new FormData();
    formData.append('name', inputValue);

    try {
      const response = await fetch('http://localhost:8000/api/admin/add-status', {
        method: 'POST',
        body: formData, // No need to set headers for formData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Development Type added successfully');
        setInputValue(''); // Clear the input field
      } else {
        setError(data.message || 'Failed to add Development Type');
      }
    } catch (err) {
      setError('An error occurred while submitting the data');
    }
  };

  // Prevent modal from closing when clicking inside
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // Close modal when overlay is clicked
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-lg w-11/12 sm:w-96 shadow-lg"
        onClick={handleModalContentClick}
      >
        <h2 className="text-xl font-semibold text-center mb-4">Status</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Error message */}
        {success && <p className="text-green-500 mb-4">{success}</p>} {/* Success message */}

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter Development Type"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-between">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default statusModal;
