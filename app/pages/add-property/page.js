"use client";
import React, { useState } from "react";
import Header from "./../header";
import Icon from "@/app/pages/socialmedia-icons/page";
import Footer from "./../footer";
import { showToast } from "@/components/alert/page";
function App() {
  const [showPreviews, setShowPreviews] = useState(true);

  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };
  const handleShowErrorToast = (message) => {
    showToast(message, "error");
  };

  const handleShowWarningToast = (message) => {
    showToast(message, "warning"); // Warning toast
  };
  // State to manage the property form input
  const [property, setProperty] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    status: "available",
  });
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]); // State for storing image previews

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    generatePreviews(selectedFiles); // Generate previews after files are selected
  };

  const generatePreviews = (selectedFiles) => {
    const previewUrls = [];
    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrls.push(e.target.result); // Collect previews
        if (previewUrls.length === selectedFiles.length) {
          setFilePreviews(previewUrls); // Update state once all previews are ready
        }
      };
      reader.readAsDataURL(file); // Start reading the file
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty({
      ...property,
      [name]: value,
    });
  };
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a combined data object
    const formData = {
      personalInformation: {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone,
      },
      propertyInformation: {
        name: property.name,
        location: property.location,
        price: property.price,
        status: property.status,
        description: property.description,
        files: filePreviews, // Include file previews or file URLs
      },
    };

    // Log the combined data
    console.log("Combined Form Data:", formData);

    // Prepare the data for sending
    const payload = new FormData();

    // Add the personal and property information to the FormData
    payload.append(
      "personalInformation[firstName]",
      formData.personalInformation.firstName
    );
    payload.append(
      "personalInformation[lastName]",
      formData.personalInformation.lastName
    );
    payload.append(
      "personalInformation[email]",
      formData.personalInformation.email
    );
    payload.append(
      "personalInformation[phone]",
      formData.personalInformation.phone
    );

    payload.append(
      "propertyInformation[name]",
      formData.propertyInformation.name
    );
    payload.append(
      "propertyInformation[location]",
      formData.propertyInformation.location
    );
    payload.append(
      "propertyInformation[price]",
      formData.propertyInformation.price
    );
    payload.append(
      "propertyInformation[status]",
      formData.propertyInformation.status
    );
    payload.append(
      "propertyInformation[description]",
      formData.propertyInformation.description
    );

    // If the files are base64, convert them into Blobs or use actual files from file input
    formData.propertyInformation.files.forEach((fileData, index) => {
      // If fileData is a base64 string, convert it to Blob
      if (fileData.startsWith("data:image/")) {
        const byteString = atob(fileData.split(",")[1]); // Decode base64 string
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          view[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([view], { type: "image/png" }); // Assuming PNG, adjust MIME type accordingly

        payload.append(
          "propertyInformation[files][]",
          blob,
          `file_${index}.png`
        );
      } else {
        // If fileData is a file object, append it directly
        payload.append("propertyInformation[files][]", fileData);
      }
    });

    // Log FormData content for debugging
    for (let [key, value] of payload.entries()) {
      console.log(key + ": " + value);
    }

    // Send the data to the API using fetch
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/submit-property`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            // Optionally, add authorization headers here if needed
          },
          body: payload, // Send FormData as the body
        }
      );

      // Parse the response
      const data = await response.json();

      // Handle the response
      if (response.ok) {
        handleShowSuccessToast("Property Added Successfully!");
        console.log("Response Data:", data);
      } else {
        handleShowErrorToast("There was an error adding the property.");
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      handleShowErrorToast("An error occurred while submitting the property.");
    }
  };

  return (
    <>
      <Header /> <Icon />
      <div className="App flex flex-col lg:flex-row w-full p-6 bg-gray-50 min-h-screen mt-9 gap-5">
        {/* Data Privacy Reminder Section */}
        <div className="w-full sm:w-2/4 md:w-1/3 lg:w-1/3 p-8 bg-white border border-customBlue  lg:mb-0 my-6 mx-auto">
          <h2 className="font-thin text-2xl text-customBlue mb-6 text-center">
            Data Privacy Reminder
          </h2>
          <p className="text-lg text-gray-600 mb-4 indent-10 text-justify leading-10">
            By submitting your property information, you agree that the data
            provided will be used solely for the purposes of managing property
            listings and related communications.
          </p>
          <p className="text-lg text-gray-600 mb-4 indent-10 text-justify leading-10">
            Your personal details such as name, contact number, and email will
            be kept confidential and will not be shared with any third parties
            without your consent.
          </p>
          <p className="text-lg text-gray-600 mb-4 indent-10 text-justify leading-10">
            Please ensure that the information you provide is accurate and does
            not contain any sensitive personal details unless absolutely
            necessary.
          </p>
          <p className="text-lg text-gray-600 mb-4 indent-10 text-justify leading-10">
            You may review our Privacy Policy for more information on how we
            handle your data.
          </p>
        </div>

        {/* Property Submission Form */}
        <div className="w-full my-6 bg-gray-50 ">
          {/* Personal Information (First Row) */}
          <div className="w-full p-6 bg-white border border-customBlue mb-6">
            <h1 className="text-2xl font-semibold text-left mb-6 text-customBlue">
              Personal Information
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-customBlue">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-customBlue">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={personalInfo.firstName}
                    onChange={handlePersonalInfoChange}
                    placeholder="Juan"
                    className="w-full p-3 border border-customBlue  mt-2 focus:ring-2 focus:ring-customBlue"
                    required
                  />
                </div>
                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-customBlue">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Dela Cruz"
                    value={personalInfo.lastName}
                    onChange={handlePersonalInfoChange}
                    className="w-full p-3 border border-customBlue  mt-2 focus:ring-2 focus:ring-customBlue"
                    required
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-customBlue">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="juandelacruz2025@gmail.com"
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    className="w-full p-3 border border-customBlue  mt-2 focus:ring-2 focus:ring-customBlue"
                    required
                  />
                </div>
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-customBlue">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+639493246122"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    className="w-full p-3 border border-customBlue  mt-2 focus:ring-2 focus:ring-customBlue"
                    required
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Property Information (Second Row) */}
          <div className="w-full p-6 bg-white border border-customBlue">
            <h1 className="text-2xl font-semibold text-left mb-6 text-customBlue">
              Property Information
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Property Name */}
                <div>
                  <label className="block text-sm font-medium text-customBlue">
                    Property Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Allegra Garden Place"
                    value={property.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-customBlue  mt-2 focus:ring-2 focus:ring-customBlue"
                    required
                  />
                </div>
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-customBlue">
                    Unit Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Unit 3A, Tower 5, Azure Urban Residences, Paranaque City, near SM Bicutan"
                    value={property.location}
                    onChange={handleChange}
                    className="w-full p-3 border border-customBlue  mt-2 focus:ring-2 focus:ring-customBlue"
                    required
                  />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-customBlue">
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    placeholder="₱ 1,500k - 2,000k"
                    value={property.price}
                    onChange={handleChange}
                    className="w-full p-3 border border-customBlue  mt-2 focus:ring-2 focus:ring-customBlue"
                    required
                  />
                </div>
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-customBlue">
                    Status
                  </label>
                  <select
                    name="status"
                    value={property.status}
                    onChange={handleChange}
                    className="w-full p-3 border border-customBlue  mt-2 focus:ring-2 focus:ring-customBlue"
                  >
                    <option value="available">New</option>
                    <option value="sold">Ready for Occupancy</option>
                    <option value="sold">Under Construction</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-customBlue">
                  Description
                </label>
                <textarea
                  name="description"
                  value={property.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-customBlue  mt-2 focus:ring-2 focus:ring-customBlue"
                  rows="4"
                />
              </div>

              {/* Multiple File/Image Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-customBlue">
                  Upload Images/Files
                </label>
                <input
                  type="file"
                  name="files"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-3 border border-customBlue  mt-2 focus:ring-2 focus:ring-customBlue"
                  accept="image/*"
                />
              </div>

              {/* Render Image Previews */}
              <div className="mt-6">
                {filePreviews.length > 0 && (
                  <div>
                    {/* Toggle Button - Positioned to the Right */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowPreviews(!showPreviews)}
                        className="mb-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-md focus:outline-none hover:bg-blue-600"
                      >
                        {showPreviews ? "Hide Previews" : "Show Previews"}
                      </button>
                    </div>

                    {/* Image Previews */}
                    {showPreviews && (
                      <div>
                        <h2 className="text-sm font-medium text-customBlue">
                          Image Previews
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                          {filePreviews.map((imageUrl, index) => (
                            <div
                              key={index}
                              className="w-full h-32 bg-gray-100"
                            >
                              <img
                                src={imageUrl}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-customBlue text-white font-thin p-3 hover:bg-customBlue transition duration-300"
                >
                  Submit Property
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-14">
        <Footer />
      </div>
    </>
  );
}

export default App;
