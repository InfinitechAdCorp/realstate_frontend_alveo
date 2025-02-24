import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  handleShowSuccessToast,
  handleShowErrorToast,
} from "@/app/test/toastalert";

const ArchitecturalTheme = () => {
  const [themes, setThemes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          onClick={() => handleDeleteTheme(row.id)}
          className="text-red-500 hover:text-red-700"
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Architectural Themes</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            Add Theme
          </button>
        </div>

        {/* Data Table with Proper Spacing */}
        <div className="p-2">
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
      </div>

      {/* Modal for Adding New Theme */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-sm sm:text-base mb-4">
              Add New Architectural Theme
            </h2>
            <input
              type="text"
              placeholder="New Theme Name"
              value={newTheme}
              onChange={(e) => setNewTheme(e.target.value)}
              className="border rounded p-2 w-full text-sm"
            />
            <div className="flex justify-end gap-2 mt-4 text-sm">
              {/* Cancel Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 text-sm"
              >
                Cancel
              </button>
              {/* Add Button */}
              <button
                onClick={handleAddTheme}
                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitecturalTheme;
