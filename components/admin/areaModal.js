import React, { useState } from 'react';

const AreaModal = ({ isOpen, closeModal }) => {
  const [inputValues, setInputValues] = useState({
    area_name: '',
    title: '',
    description: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle change in input fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (event) => {
    const { files } = event.target;
    setInputValues((prevState) => ({
      ...prevState,
      image: files[0],
    }));
  };

  // Submit data to the backend using fetch
  const handleSubmit = async () => {
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    // Validate input fields
    if (!inputValues.area_name || !inputValues.title || !inputValues.description || !inputValues.image) {
      setError('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('area_name', inputValues.area_name);
    formData.append('title', inputValues.title);
    formData.append('description', inputValues.description);
    formData.append('image', inputValues.image);

    try {
      const response = await fetch('http://localhost:8000/api/admin/add-area', {
        method: 'POST',
        body: formData, // No need to set headers for formData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Development Type added successfully');
        setInputValues({
          area_name: '',
          title: '',
          description: '',
          image: null,
        }); // Reset form
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
        <h2 className="text-xl font-semibold text-center mb-4">Architectural Theme</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Error message */}
        {success && <p className="text-green-500 mb-4">{success}</p>} {/* Success message */}

        {/* Area Name Input */}
        <input
          type="text"
          name="area_name"
          value={inputValues.area_name}
          onChange={handleInputChange}
          placeholder="Enter Area Name"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Title Input */}
        <input
          type="text"
          name="title"
          value={inputValues.title}
          onChange={handleInputChange}
          placeholder="Enter Title"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Description Input */}
        <textarea
          name="description"
          value={inputValues.description}
          onChange={handleInputChange}
          placeholder="Enter Description"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Image Upload */}
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
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

export default AreaModal;
