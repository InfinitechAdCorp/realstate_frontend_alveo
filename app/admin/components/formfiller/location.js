"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  handleShowSuccessToast,
  handleShowErrorToast,
} from "@/app/admin/toastalert";

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [data, setData] = useState({
    newAreaName: "",
    newTitle: "",
    newDescription: "",
    newImage: null,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();
      setLocations(result);
    } catch (error) {
      handleShowErrorToast("Error fetching locations.");
    }
  };

  const handleDeleteLocation = async (id) => {
    const token = localStorage.getItem("auth_token");

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/delete-location/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLocations((prevLocations) =>
        prevLocations.filter((location) => location.id !== id)
      );
      handleShowSuccessToast("Location deleted successfully!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      handleShowErrorToast("Error occurred while deleting location.");
    }
  };

  const handleAddLocation = async () => {
    if (!data.newAreaName || !data.newTitle || !data.newDescription) {
      handleShowErrorToast("All fields except image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("area_name", data.newAreaName);
    formData.append("title", data.newTitle);
    formData.append("description", data.newDescription);
    if (data.newImage) {
      formData.append("image", data.newImage);
    }

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-area`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        handleShowSuccessToast("Location added successfully!");
        fetchLocations();
        setIsLocationModalOpen(false);
        setData({
          newAreaName: "",
          newTitle: "",
          newDescription: "",
          newImage: null,
        });
      } else {
        handleShowErrorToast(result.error || "Failed to add location.");
      }
    } catch (err) {
      handleShowErrorToast("An error occurred during submission.");
    }
  };

  const handleEditClick = (location) => {
    setSelectedLocation(location);
    setIsEditModalOpen(true);
  };

  const handleUpdateLocation = async () => {
    if (!selectedLocation) return;

    const formData = new FormData();
    formData.append("area_name", selectedLocation.area_name);
    formData.append("title", selectedLocation.title);
    formData.append("description", selectedLocation.description);
    if (selectedLocation.image) {
      formData.append("image", selectedLocation.image);
    }

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/updateArea/${selectedLocation.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (response.ok) {
        handleShowSuccessToast("Location updated successfully!");
        fetchLocations();
        setIsEditModalOpen(false);
      } else {
        handleShowErrorToast("Failed to update location.");
      }
    } catch (err) {
      handleShowErrorToast("An error occurred while updating.");
    }
  };
  const columns = [
    {
      name: "Area Name",
      selector: (row) => row.area_name,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div>
          {row.title.length > 100 ? (
            <>
              {expandedRows[row.id]
                ? row.title
                : row.title.substring(0, 100) + "..."}
              <button
                onClick={() => toggleExpansion(row.id)}
                className="text-blue-500 ml-2"
              >
                {expandedRows[row.id] ? "See Less" : "See More"}
              </button>
            </>
          ) : (
            row.title
          )}
        </div>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.description,
      wrap: true,
      cell: (row) => (
        <div>
          {row.description.length > 100 ? (
            <>
              {expandedRows[row.id + "-desc"]
                ? row.description
                : row.description.substring(0, 100) + "..."}
              <button
                onClick={() => toggleExpansion(row.id + "-desc")}
                className="text-blue-500 ml-2"
              >
                {expandedRows[row.id + "-desc"] ? "See Less" : "See More"}
              </button>
            </>
          ) : (
            row.description
          )}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setEntryToDelete(row);
              setIsDeleteModalOpen(true);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="bg-white shadow-md p-4 rounded-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold">Locations</h2>
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500 rounded-md sm:w-auto w-full"
          >
            Add Location
          </button>
        </div>

        <div className="p-2">
          <DataTable
            columns={columns}
            data={locations}
            pagination
            highlightOnHover
            responsive
            striped
          />
        </div>
      </div>
      {isLocationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-md max-w-[400px]">
            <h2 className="text-sm sm:text-base mb-4">Add New Location</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="newAreaName"
                placeholder="Area Name"
                value={data.newAreaName || ""}
                onChange={(e) =>
                  setData({ ...data, newAreaName: e.target.value })
                }
                className="border rounded p-2 w-full text-sm"
              />
              <input
                type="text"
                name="newTitle"
                placeholder="Title"
                value={data.newTitle || ""}
                onChange={(e) => setData({ ...data, newTitle: e.target.value })}
                className="border rounded p-2 w-full text-sm"
              />
              <input
                type="text"
                name="newDescription"
                placeholder="Description"
                value={data.newDescription || ""}
                onChange={(e) =>
                  setData({ ...data, newDescription: e.target.value })
                }
                className="border rounded p-2 w-full text-sm"
              />
              <input
                type="file"
                onChange={(e) =>
                  setData({ ...data, newImage: e.target.files[0] })
                }
                className="border rounded p-2 w-full text-sm"
              />
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 text-sm">
                <button
                  onClick={handleAddLocation}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 w-full sm:w-auto"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && entryToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Delete Confirmation
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Are you sure you want to delete the following location?
            </p>
            <p className="text-sm text-gray-600 mb-2 text-center">
              Area Name: {entryToDelete.area_name}
            </p>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Title: {entryToDelete.title}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDeleteLocation(entryToDelete.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md w-full sm:w-auto"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Location Modal */}
      {isEditModalOpen && selectedLocation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg mb-4">Edit Location</h2>

            {/* Area Name */}
            <label className="text-sm font-medium">Area Name</label>
            <input
              type="text"
              value={selectedLocation.area_name}
              onChange={(e) =>
                setSelectedLocation({
                  ...selectedLocation,
                  area_name: e.target.value,
                })
              }
              className="border rounded p-2 w-full mb-2"
            />

            {/* Title */}
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={selectedLocation.title}
              onChange={(e) =>
                setSelectedLocation({
                  ...selectedLocation,
                  title: e.target.value,
                })
              }
              className="border rounded p-2 w-full mb-2"
            />

            {/* Description */}
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={selectedLocation.description}
              onChange={(e) =>
                setSelectedLocation({
                  ...selectedLocation,
                  description: e.target.value,
                })
              }
              className="border rounded p-2 w-full mb-2 h-24 resize-none"
            />

            {/* Image Upload */}
            <label className="text-sm font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSelectedLocation({
                  ...selectedLocation,
                  image: e.target.files[0], // Save the new image file
                })
              }
              className="border rounded p-2 w-full mb-2"
            />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={handleUpdateLocation}
                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full sm:w-auto"
              >
                Update
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;
