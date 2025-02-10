import React, { useState, useEffect } from "react";
import {
  handleShowSuccessToast,
  handleShowErrorToast,
} from "@/app/test/toastalert";

const Status = () => {
  const [data, setData] = useState({
    statusOptions: [],
    newStatus: "",
  });
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [error, setError] = useState(""); // Error state
  const [success, setSuccess] = useState(""); // Success state

  // Fetch status options
  useEffect(() => {
    fetchStatusOptions();
  }, []);

  const fetchStatusOptions = () => {
    const token = localStorage.getItem("auth_token");
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/status-options`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Status Options:", data);
        setData((prevData) => ({
          ...prevData,
          statusOptions: data,
        }));
      })
      .catch((error) => console.error("Error fetching status options:", error));
  };

  const handleAddStatus = async () => {
    setError("");
    setSuccess("");

    const { newStatus } = data;
    if (!newStatus) {
      setError("Status name is required");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("name", newStatus);

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-status`,
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
        handleShowSuccessToast("Status added successfully!");
        fetchStatusOptions(); // Refresh the list of status options
        setData((prevData) => ({
          ...prevData,
          newStatus: "",
        })); // Reset the form field
        setIsStatusModalOpen(false); // Close modal
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error("An error occurred:", err);
      setError("An error occurred during submission");
    }
  };

  const handleDeleteStatus = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/delete-status/${id}`,
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
        handleShowSuccessToast("Status deleted successfully!");
        setData((prevData) => ({
          ...prevData,
          statusOptions: prevData.statusOptions.filter(
            (status) => status.id !== id
          ),
        }));
      } else {
        handleShowErrorToast("Failed to delete status.");
      }
    } catch (error) {
      console.error("Error deleting status:", error);
      handleShowErrorToast("Error occurred while deleting status.");
    }
  };

  return (
    <div className="overflow-y-auto mt-20">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Status</h2>
          <button
            onClick={() => setIsStatusModalOpen(true)} // Open modal when clicked
            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Add Status
          </button>
        </div>

        <ul className="h-[700px] overflow-y-auto">
          {data.statusOptions?.length > 0 ? (
            data.statusOptions.map((status) => (
              <li
                key={status.id}
                className="flex justify-between p-2 border-b hover:bg-gray-100"
              >
                <span>{status.name}</span>
                <button
                  onClick={
                    () => handleDeleteStatus(status.id) // Call delete function
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li>No Status Options Found</li>
          )}
        </ul>
      </div>

      {/* Modal for Adding New Status */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Add New Status</h2>
            <input
              type="text"
              placeholder="New Status"
              value={data.newStatus || ""}
              onChange={(e) => setData({ ...data, newStatus: e.target.value })}
              className="border rounded p-2 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsStatusModalOpen(false)} // Close modal
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStatus} // Add status logic
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

export default Status;
