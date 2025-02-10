import React, { useState, useEffect } from "react";
import {
  handleShowSuccessToast,
  handleShowErrorToast,
} from "@/app/test/toastalert";

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [error, setError] = useState(""); // Error state
  const [success, setSuccess] = useState(""); // Success state

  const [data, setData] = useState({
    newAreaName: "",
    newTitle: "",
    newDescription: "",
    newImage: null,
  });

  // Fetch locations from the server
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    const token = localStorage.getItem("auth_token");
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Locations:", data);
        setLocations(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setData((prevData) => ({
      ...prevData,
      newImage: e.target.files[0],
    }));
  };

  const handleAddLocation = async () => {
    setError("");
    setSuccess("");

    const { newAreaName, newTitle, newDescription, newImage } = data;
    if (!newAreaName || !newTitle || !newDescription) {
      setError("All fields are required");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("area_name", newAreaName);
    formData.append("title", newTitle);
    formData.append("description", newDescription);
    if (newImage) formData.append("image", newImage);

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-area`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Send the FormData
        }
      );

      const result = await response.json();
      if (response.ok) {
        handleShowSuccessToast("Location added successfully!");
        fetchLocations(); // Refresh the list of locations
        setData({
          newAreaName: "",
          newTitle: "",
          newDescription: "",
          newImage: null,
        }); // Reset form data
        setIsLocationModalOpen(false); // Close modal
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error("An error occurred:", err);
      setError("An error occurred during submission");
    }
  };

  const handleDeleteLocation = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/deleteLocation/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        handleShowSuccessToast("Location deleted successfully!");
        setLocations((prevLocations) =>
          prevLocations.filter((location) => location.id !== id)
        );
      } else {
        handleShowErrorToast("Failed to delete location.");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      handleShowErrorToast("Error occurred while deleting location.");
    }
  };

  return (
    <div className="h-full overflow-y-auto mt-20 px-4 sm:px-8 font-thin">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg mb-4 ">Locations</h2>
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500"
        >
          Add Location
        </button>
      </div>
      <ul className="h-[700px] overflow-y-auto">
        {locations.length > 0 ? (
          locations.map((location) => (
            <li
              key={location.id}
              className="flex flex-col sm:flex-row justify-between p-2 border-b hover:bg-gray-50"
            >
              <span className="text-sm ">
                {location.area_name} - {location.title}
              </span>
              <button
                onClick={() => handleDeleteLocation(location.id)}
                className="text-red-500 hover:text-red-700 mt-2 sm:mt-0 text-sm"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li className="text-sm ">No Locations Found</li>
        )}
      </ul>

      {/* Modal for Adding Location */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-sm sm:text-base mb-4">Add New Location</h2>
            <div className="flex flex-col gap-4">
              {/* Area Name */}
              <input
                type="text"
                name="newAreaName"
                placeholder="Area Name"
                value={data.newAreaName || ""}
                onChange={handleInputChange}
                className="border rounded p-2 w-full text-sm "
              />
              {/* Title */}
              <input
                type="text"
                name="newTitle"
                placeholder="Title"
                value={data.newTitle || ""}
                onChange={handleInputChange}
                className="border rounded p-2 w-full text-sm"
              />
              {/* Description */}
              <input
                type="text"
                name="newDescription"
                placeholder="Description"
                value={data.newDescription || ""}
                onChange={handleInputChange}
                className="border rounded p-2 w-full text-sm"
              />
              {/* File Upload */}
              <input
                type="file"
                onChange={handleImageChange}
                className="border rounded p-2 w-full text-sm"
              />
              <div className="flex justify-end gap-2 mt-4 text-sm">
                {/* Cancel Button */}
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 text-sm"
                >
                  Cancel
                </button>
                {/* Add Button */}
                <button
                  onClick={handleAddLocation}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;
