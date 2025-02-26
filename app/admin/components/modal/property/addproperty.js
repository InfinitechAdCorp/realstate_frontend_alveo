"use client";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { showToast } from "@/components/alert/page";

const AddPropertyModal = ({ isOpen, closePopup, handleFileChange }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    closePopup(false); // This will set isOpen to false and close the modal
  };
  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };

  const handleShowErrorToast = (message) => {
    showToast(message, "error"); // Error toast
  };

  const handleShowWarningToast = (message) => {
    showToast(message, "warning"); // Warning toast
  };
  const [propertyData, setPropertyData] = useState({
    name: "",
    status: "",
    location: "",
    specific_location: "",
    price_range: "",
    lat: "",
    lng: "",
    units: "",
    land_area: "",
    development_type: "",
    architectural_theme: "",
    key: "",
    path: null,
    view: null,
  });

  const [developmentTypes, setDevelopmentTypes] = useState([]);
  const [architecturalTheme, setArchitecturalTheme] = useState([]);
  const [status, setStatus] = useState([]);
  const [area, setArea] = useState([]);
  const [error, setError] = useState("");

  // Fetch dropdown values on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const log = localStorage.getItem("isLoggedIn");

    if (!token || log !== "true") {
      console.error("User is not logged in or token is missing.");
      setError("User is not logged in or token is missing.");
      return;
    }

    const fetchDropdownData = async (url, setState) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}${url}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error(`Failed to fetch ${url}`);

        const data = await response.json();
        console.log(data);
        setState(data);
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
      }
    };

    fetchDropdownData("/api/admin/development-types", setDevelopmentTypes);
    fetchDropdownData("/api/admin/architectural-themes", setArchitecturalTheme);
    fetchDropdownData("/api/admin/status", setStatus);
    fetchDropdownData("/api/admin/area", setArea);
  }, []);

  const fillableFields = [
    { label: "Name", value: "name" },
    { label: "Latitude", value: "lat" },
    { label: "Longitude", value: "lng" },
    { label: "Specific Location", value: "specific_location" },
    { label: "Price Range", value: "price_range" },
    { label: "Units", value: "units" },
    { label: "Land Area", value: "land_area" },
  ];

  const pathAndViewFeatures = [
    { label: "Building Image", value: "path", type: "file" },
    { label: "Master Plan", value: "view", type: "file" },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Property Data before appending:", propertyData);

    const formData = new FormData();

    if (propertyData.location === "other") {
      propertyData.key = propertyData.custom_location.toLowerCase();
    } else {
      propertyData.key = propertyData.location.toLowerCase();
    }

    if (propertyData.development_type === "other") {
      propertyData.development_type = propertyData.custom_development_type;
    }
    if (propertyData.architectural_theme === "other") {
      propertyData.architectural_theme =
        propertyData.custom_architectural_theme;
    }
    if (propertyData.status === "other") {
      propertyData.status = propertyData.custom_status;
    }
    if (propertyData.location === "other") {
      propertyData.location = propertyData.custom_location;
    }

    // Append all property fields
    Object.keys(propertyData).forEach((key) => {
      // Exclude specific custom keys
      if (
        key === "custom_architectural_theme" ||
        key === "custom_development_type" ||
        key === "custom_location" ||
        key === "custom_status"
      ) {
        return; // Skip these keys
      }

      if (key === "path" || key === "view") {
        if (propertyData[key] instanceof File) {
          // Append file if it's an instance of File
          formData.append(key, propertyData[key]);
        }
      } else {
        // Append regular data
        formData.append(key, propertyData[key]);
      }
    });

    // Log the FormData content for debugging
    formData.forEach((value, key) => {
      console.log(`FormData - ${key}:`, value);
    });
    const authToken = localStorage.getItem("auth_token"); // Retrieve the token from localStorage

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/addproperty`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`, // Add the Authorization header with Bearer token
          },
          body: formData, // Send the formData
        }
      );

      // Check if the response is JSON
      const contentType = response.headers.get("Content-Type");
      console.log(true);
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Response Data:", data);

        if (response.ok) {
          handleShowSuccessToast("Property created successfully");
          closePopup("addProperty");
        } else {
          console.error("Error creating property:", data);
          handleShowErrorToast(`Error: ${data.message}`);
        }
        handleClose();
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl sm:max-w-lg md:max-w-4xl overflow-auto shadow-xl relative h-full max-h-[90vh] sm:max-h-[70vh]">
        {/* Close Button */}
        <button
          onClick={() => handleClose()}
          className="absolute top-4 right-4 bg-gray-500 text-white rounded-full p-2 focus:outline-none hover:bg-gray-600"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Add Property
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-auto max-h-[70vh] sm:max-h-[60vh]"
        >
          {/* Dynamic Input Fields */}
          {fillableFields.map((field) => (
            <div key={field.value} className="flex flex-col space-y-2">
              <label
                htmlFor={field.value}
                className="text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                type="text"
                id={field.value}
                name={field.value}
                value={propertyData[field.value] || ""}
                onChange={(e) =>
                  setPropertyData({
                    ...propertyData,
                    [field.value]: e.target.value,
                  })
                }
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              />
            </div>
          ))}

          {/* Dropdowns */}
          {renderDropdownWithCustomInput(
            "Development Type",
            "development_type",
            developmentTypes,
            propertyData,
            setPropertyData
          )}
          {renderDropdownWithCustomInput(
            "Architectural Theme",
            "architectural_theme",
            architecturalTheme,
            propertyData,
            setPropertyData
          )}
          {renderDropdownWithCustomInput(
            "Status",
            "status",
            status,
            propertyData,
            setPropertyData
          )}
          {renderDropdownWithCustomInput(
            "Location",
            "location",
            area,
            propertyData,
            setPropertyData
          )}

          {/* File Inputs */}
          {pathAndViewFeatures.map((field) => (
            <div
              key={field.value}
              className="flex flex-col space-y-2 col-span-full md:col-span-1"
            >
              <label
                htmlFor={field.value}
                className="text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                type="file"
                id={field.value}
                name={field.value}
                onChange={handleFileChange}
                accept={field.value === "path" ? "image/*" : "*"}
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              />
            </div>
          ))}
        </form>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-200"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            onClick={() => handleClose()}
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const renderDropdownWithCustomInput = (
  label,
  key,
  options = [],
  propertyData,
  setPropertyData
) => {
  return (
    <div className="flex flex-col space-y-2 max-h-48 overflow-auto">
      {" "}
      {/* Limit the container's height */}
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="overflow-hidden">
        {" "}
        {/* Hide overflow in the container */}
        <select
          id={key}
          name={key}
          value={propertyData[key]}
          onChange={(e) =>
            setPropertyData({ ...propertyData, [key]: e.target.value })
          }
          className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full max-h-32 overflow-y-auto" // Limit height of the dropdown
        >
          <option value="" disabled>
            Select
          </option>
          {options.map((type) => (
            <option
              value={key === "location" ? type.area_name : type.name}
              key={type.id}
            >
              {key === "location" ? type.area_name : type.name}
            </option>
          ))}
          <option value="other">
            Other (type your custom {label.toLowerCase()})
          </option>
        </select>
      </div>
    </div>
  );
};

export default AddPropertyModal;
