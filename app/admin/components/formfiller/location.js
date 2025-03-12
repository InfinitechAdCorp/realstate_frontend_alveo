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
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [expandedRows, setExpandedRows] = useState({}); // Expanded state for see more/less
  const [data, setData] = useState({
    newAreaName: "",
    newTitle: "",
    newDescription: "",
    newImage: null,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [entryToDelete, setEntryToDelete] = useState(null); // State for the entry to be deleted

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      setIsDeleteModalOpen(false); // Close delete modal
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
          headers: {
            Authorization: `Bearer ${token}`, // Attach token for authentication
          },
          body: formData, // Send formData (multipart/form-data)
        }
      );

      const result = await response.json();

      if (response.ok) {
        handleShowSuccessToast("Location added successfully!");
        fetchLocations(); // ✅ Fetch the updated locations list
        setIsLocationModalOpen(false);
        setData({
          newAreaName: "",
          newTitle: "",
          newDescription: "",
          newImage: null,
        }); // Clear form fields
      } else {
        handleShowErrorToast(result.error || "Failed to add location.");
      }
    } catch (err) {
      handleShowErrorToast("An error occurred during submission.");
    }
  };

  const toggleExpansion = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
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
        <button
          onClick={() => {
            setEntryToDelete(row); // Set the entry to delete
            setIsDeleteModalOpen(true); // Open delete confirmation modal
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
        >
          Delete
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredLocations = (locations || []).filter(
    (location) =>
      location.area_name &&
      location.area_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="bg-white shadow-md p-4 rounded-md">
        {/* Title & Search Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="text-lg font-semibold">Locations</h2>
            <input
              type="text"
              placeholder="Search by area name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 border rounded-md text-sm mt-2 sm:mt-0"
            />
          </div>

          {/* Add Location Button */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500 rounded-md sm:w-auto w-full"
          >
            Add Location
          </button>
        </div>

        {/* Data Table with Proper Spacing */}
        <div className="p-2">
          <DataTable
            columns={columns}
            data={filteredLocations}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15]}
            highlightOnHover
            responsive
            striped
          />
        </div>
      </div>

      {/* Modal for Adding Location */}
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
    </div>
  );
};

export default Location;
