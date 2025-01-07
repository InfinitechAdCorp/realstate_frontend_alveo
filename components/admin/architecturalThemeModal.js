import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ArchitecturalThemeModal = ({ isOpen, closeModal }) => {
  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Development Type is required')
      .min(3, 'Development Type must be at least 3 characters')
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors, setStatus }) => {
    setErrors({}); // Clear previous errors
    setStatus(''); // Clear previous status messages

    const formData = new FormData();
    formData.append('name', values.name);

    try {
      const response = await fetch('http://localhost:8000/api/admin/add-architectural-theme', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ success: data.message || 'Development Type added successfully' });
        setSubmitting(false);
      } else {
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
        <h2 className="text-xl font-semibold text-center mb-4">Architectural Theme</h2>

        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form>
              {/* Display status message (success or error) */}
              {status?.success && (
                <p className="text-green-500 mb-4">{status.success}</p>
              )}
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 mb-4"
              />

              <Field
                type="text"
                name="name"
                placeholder="Enter Development Type"
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

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

export default ArchitecturalThemeModal;
