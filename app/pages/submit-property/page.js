"use client";
import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Header from "../header";
import Footer from "../footer";
import SEO from "../../seo/page";
import { FaImage } from "react-icons/fa";
import { showToast } from "@/components/alert/page";
import Icon from "@/app/pages/socialmedia-icons/page";
const SetAppointment = () => {
  const [message, setMessage] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [messageType, setMessageType] = useState("");
  const initialValues = {
    last_name: "",
    first_name: "",
    email: "",
    number: "",
    property_name: "",
    unit_type: "",
    price: "",
    location: "",
    images: [],
  };

  const validationSchema = Yup.object({
    last_name: Yup.string().required("Last name is required"),
    first_name: Yup.string().required("First name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    number: Yup.number()
      .typeError("Phone number must be a number")
      .required("Phone number is required")
      .min(1000000000, "Phone number must be 11 digits")
      .max(9999999999, "Phone number must not exceed 11 digits"),
    property_name: Yup.string().required("Property name is required"),
    unit_type: Yup.string().required("Unit type is required"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be at least 0"),
    location: Yup.string().required("Location is required"),
    images: Yup.mixed().test(
      "fileSize",
      "Each file must be smaller than 2MB",
      (value) =>
        value
          ? Array.from(value).every((file) => file.size <= 2048 * 1024)
          : true
    ),
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
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();

    // Append form values to FormData
    Object.entries(values).forEach(([key, value]) => {
      if (key === "images") {
        // If it's the images array, append each file
        Array.from(value).forEach((file) => {
          formData.append("images[]", file);
        });
      } else {
        formData.append(key, value);
      }
    });

    // Log the FormData content
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/submit-property`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        handleShowSuccessToast(
          responseData.message || "Property submitted successfully!"
        );
        setMessageType("success");
        resetForm(); // Reset the form after successful submission
      } else {
        const errorData = await response.json();
        handleShowErrorToast(errorData.message || "Property failed to submit!");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      handleShowErrorToast(
        "An unexpected error occurred while submitting the property."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false); // Enable the form's submit button again
    }
  };

  const handleImageChange = (event, setFieldValue) => {
    const files = event.currentTarget.files;
    setFieldValue("images", files);

    // Preview selected images
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagesPreview(previews);
  };

  return (
    <div className="bg-white">
      {/* SEO setup */}
      <SEO
        title="REAL ESTATE"
        description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter."
        keywords="alveo, real estate, location, property, building location, property location"
        canonical="${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/locations"
      />



      <div className="text-center mb-2 mt-10">
        <h1 className="text-3xl font-bold text-blue-600">Submit Property</h1>
      </div>

      {/* Main content layout */}
      <div className="flex-col lg:flex-row mt-4 m-4 justify-center items-center">
        {message && (
          <div
            className={`p-4 mt-4 text-white rounded-lg text-center ${
              messageType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Last Name */}
                <div>
                  <label className="block text-gray-700">Last Name</label>
                  <Field
                    type="text"
                    name="last_name"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* First Name */}
                <div>
                  <label className="block text-gray-700">First Name</label>
                  <Field
                    type="text"
                    name="first_name"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-gray-700">Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* Phone Number */}
                <div>
                  <label className="block text-gray-700">Phone Number</label>
                  <Field
                    type="text"
                    name="number"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="number"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              {/* Property Name */}
              <div>
                <label className="block text-gray-700">Property Name</label>
                <Field
                  type="text"
                  name="property_name"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                />
                <ErrorMessage
                  name="property_name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Unit Type */}
              <div>
                <label className="block text-gray-700">Unit Type</label>
                <Field
                  as="select"
                  name="unit_type"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                >
                  <option value="">Select type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Condo">Condo</option>
                  <option value="House">House</option>
                </Field>
                <ErrorMessage
                  name="unit_type"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-700">Price</label>
                <Field
                  type="number"
                  name="price"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-700">Location</label>
                <Field
                  type="text"
                  name="location"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700">Upload Images</label>
                <div className="relative h-48 rounded-lg border-dashed border-2 border-blue-700 bg-gray-100 flex justify-center items-center">
                  <div className="absolute text-center">
                    <FaImage className="text-blue-700" size={40} />
                    <span className="block text-gray-400 font-normal">
                      Attach your images here
                    </span>
                  </div>
                  <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    className="h-full w-full opacity-0"
                    onChange={(event) =>
                      handleImageChange(event, setFieldValue)
                    }
                  />
                </div>

                {/* Preview images */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {imagesPreview.length > 0 &&
                    imagesPreview.map((preview, index) => (
                      <div
                        key={index}
                        className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden"
                      >
                        <img
                          src={preview}
                          alt={`preview-${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>

                <ErrorMessage
                  name="images"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300"
                >
                  Submit Property
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

    </div>
  );
};

export default SetAppointment;
