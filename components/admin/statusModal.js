import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { showToast } from '@/components/alert/page';

const StatusModal = ({ isOpen, closeModal }) => {
  const [statusMessage, setStatusMessage] = useState(''); // State to hold status messages (success or error)

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Development Type is required')
      .min(3, 'Development Type must be at least 3 characters')
  });
  const handleShowSuccessToast = (message) => {
    showToast(message, 'success');
  };

  const handleShowErrorToast = (message) => {
    showToast(message, 'error'); // Error toast
  };

  const handleShowWarningToast = (message) => {
    showToast(message, 'warning'); // Warning toast
  };
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setErrors({}); // Clear previous errors
    setStatusMessage(''); // Clear any previous status messages

    const formData = new FormData();
    formData.append('name', values.name);

    try {
      const response = await fetch('http://localhost:8000/api/admin/add-status', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Set success message
        handleShowSuccessToast(data.message || 'Development Type added successfully');
        setSubmitting(false);
      } else {
        // Set error message
        setErrors({ name: data.message || 'Failed to add Development Type' });
        setSubmitting(false);
      }
    } catch (err) {
      setErrors({ name: 'An error occurred while submitting the data' });
      setSubmitting(false);
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

        {/* Display status message (success or error) */}
        {statusMessage && (
          <div className="mb-4">
            <p
              className={`text-sm ${statusMessage.startsWith('Failed') ? 'text-red-500' : 'text-green-500'}`}
            >
              {statusMessage}
            </p>
          </div>
        )}

        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter Status"
                  className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default StatusModal;
