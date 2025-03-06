"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  handleShowSuccessToast,
  handleShowErrorToast,
} from "@/app/admin/toastalert";

const ArchitecturalTheme = () => {
  const [themes, setThemes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [entryToDelete, setEntryToDelete] = useState(null); // Store the theme to delete
  const [newTheme, setNewTheme] = useState("");

  // Fetch architectural themes
  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/architectural-themes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setThemes(data);
    } catch (error) {
      handleShowErrorToast("Error fetching themes.");
    }
  };

  const handleAddTheme = async () => {
    if (!newTheme) {
      handleShowErrorToast("Theme name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newTheme);

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-architectural-theme`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (response.ok) {
        handleShowSuccessToast("Theme added successfully!");
        fetchThemes(); // Refresh list
        setNewTheme(""); // Reset input field
        setIsModalOpen(false); // Close modal
      } else {
        handleShowErrorToast("Something went wrong.");
      }
    } catch (err) {
      handleShowErrorToast("An error occurred during submission.");
    }
  };

  const handleDeleteTheme = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/delete-architectural-theme/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        handleShowSuccessToast("Theme deleted successfully!");
        setThemes((prevThemes) =>
          prevThemes.filter((theme) => theme.id !== id)
        );
        setIsDeleteModalOpen(false); // Close the delete confirmation modal
      } else {
        handleShowErrorToast("Failed to delete theme.");
      }
    } catch (error) {
      handleShowErrorToast("Error occurred while deleting theme.");
    }
  };

  // Define columns for React Data Table
  const columns = [
    {
      name: "Theme Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => {
            setEntryToDelete(row); // Set the property to delete
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

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="bg-white shadow-md p-4 rounded-md">
        {/* Title & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold">Architectural Themes</h2>
          {/* On small screens, the button will stack below the title */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-600 w-full sm:w-auto mt-4 sm:mt-0"
          >
            Add Theme
          </button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={themes}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15]}
          highlightOnHover
          responsive
          striped
        />
      </div>

      {/* Modal for Adding New Theme */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-md max-w-[90%]">
            <h2 className="text-sm sm:text-base mb-4 text-center">
              Add New Architectural Theme
            </h2>
            <input
              type="text"
              placeholder="New Theme Name"
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              className="border rounded p-2 w-full text-sm"
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 text-sm">
              {/* Add Button */}
              <button
                onClick={handleAddTheme}
                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full sm:w-auto"
              >
                Add
              </button>
              {/* Cancel Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full sm:w-auto"
              >
                Cancel
              </button>
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
              Are you sure you want to delete the following theme?
            </p>
            <p className="text-sm text-gray-600 mb-2 text-center">
              Theme Name: {entryToDelete.name}
            </p>

            <div className="flex justify-center gap-4">
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteTheme(entryToDelete.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md w-full sm:w-auto"
              >
                Delete
              </button>
              {/* Cancel Button */}
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

export default ArchitecturalTheme;
