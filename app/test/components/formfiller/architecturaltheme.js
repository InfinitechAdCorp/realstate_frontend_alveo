import React, { useState, useEffect } from "react";
import {
  handleShowSuccessToast,
  handleShowErrorToast,
} from "@/app/test/toastalert";

const ArchitecturalTheme = () => {
  const [data, setData] = useState({
    architecturalThemes: [],
    newTheme: "",
  });
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [error, setError] = useState(""); // Error state
  const [success, setSuccess] = useState(""); // Success state

  // Fetch architectural themes
  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = () => {
    const token = localStorage.getItem("auth_token");
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/architectural-themes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Architectural Themes:", data);
        setData((prevData) => ({
          ...prevData,
          architecturalThemes: data,
        }));
      })
      .catch((error) => console.error("Error fetching themes:", error));
  };

  const handleAddTheme = async () => {
    setError("");
    setSuccess("");

    const { newTheme } = data;
    if (!newTheme) {
      setError("Theme name is required");
      return;
    }

    // Create FormData object if you want to extend functionality to files or more data
    const formData = new FormData();
    formData.append("name", newTheme);

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-architectural-theme`,
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
        handleShowSuccessToast("Theme added successfully!");
        fetchThemes(); // Refresh the list of themes
        setData((prevData) => ({
          ...prevData,
          newTheme: "",
        })); // Reset the form field
        setThemeModalOpen(false); // Close modal
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error("An error occurred:", err);
      setError("An error occurred during submission");
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
      const data = await response.json();

      handleShowSuccessToast("Theme deleted successfully!");
      setData((prevData) => ({
        ...prevData,
        architecturalThemes: prevData.architecturalThemes.filter(
          (theme) => theme.id !== id
        ),
      }));
    } catch (error) {
      console.error("Error deleting theme:", error);
      handleShowErrorToast("Error occurred while deleting theme.");
    }
  };

  return (
    <div className="h-full overflow-y-auto mt-20 px-4 sm:px-8 font-thin">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Architectural Themes</h2>
          <button
            onClick={() => setThemeModalOpen(true)} // Open modal when clicked
            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Add Theme
          </button>
        </div>

        <ul className="h-[700px] overflow-y-auto">
          {data.architecturalThemes?.length > 0 ? (
            data.architecturalThemes.map((theme) => (
              <li
                key={theme.id}
                className="flex justify-between p-2 border-b hover:bg-gray-100"
              >
                <span>{theme.name}</span>
                <button
                  onClick={
                    () => handleDeleteTheme(theme.id) // Call delete function
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li>No Architectural Themes Found</li>
          )}
        </ul>
      </div>

      {/* Modal for Adding New Theme */}
      {themeModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">
              Add New Architectural Theme
            </h2>
            <input
              type="text"
              placeholder="New Theme Name"
              value={data.newTheme || ""}
              onChange={(e) => setData({ ...data, newTheme: e.target.value })}
              className="border rounded p-2 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setThemeModalOpen(false)} // Close modal
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTheme} // Add theme logic
                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
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
