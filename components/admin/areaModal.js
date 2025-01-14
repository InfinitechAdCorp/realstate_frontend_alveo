import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { showToast } from "@/components/alert/page";

const AreaModal = ({ isOpen, closeModal }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Yup validation schema
  const validationSchema = Yup.object({
    area_name: Yup.string().required("Area Name is required"),
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    image: Yup.mixed().required("Image is required"),
  });
  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };

  const handleShowErrorToast = (message) => {
    showToast(message, "error"); // Error toast
  };

  const handleShowWarningToast = (message) => {
    showToast(message, "warning"); // Warning toast
  };
  // Submit data to the backend using fetch
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    const formData = new FormData();
    formData.append("area_name", values.area_name);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("image", values.image);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-area`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        handleShowSuccessToast(data.message || "Area added successfully");
      } else {
        handleShowErrorToast(data.message || "Failed to add Area");
      }
      setSubmitting(false);
    } catch (err) {
      handleShowErrorToast("An error occurred while submitting the data");
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
        <h2 className="text-xl font-semibold text-center mb-4">Add Data</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
        {/* Error message */}
        {success && <p className="text-green-500 mb-4">{success}</p>}{" "}
        {/* Success message */}
        <Formik
          initialValues={{
            area_name: "",
            title: "",
            description: "",
            image: null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              {/* Area Name Input */}
              <Field
                type="text"
                name="area_name"
                placeholder="Enter Area Name"
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="area_name"
                component="div"
                className="text-red-500 mb-4"
              />

              {/* Title Input */}
              <Field
                type="text"
                name="title"
                placeholder="Enter Title"
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 mb-4"
              />

              {/* Description Input */}
              <Field
                as="textarea"
                name="description"
                placeholder="Enter Description"
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 mb-4"
              />

              {/* Image Upload */}
              <input
                type="file"
                name="image"
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(event) =>
                  setFieldValue("image", event.target.files[0])
                }
              />
              <ErrorMessage
                name="image"
                component="div"
                className="text-red-500 mb-4"
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
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AreaModal;
