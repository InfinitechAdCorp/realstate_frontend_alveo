"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  handleShowSuccessToast,
  handleShowErrorToast,
} from "@/app/admin/toastalert";

const Status = () => {
  const [statuses, setStatuses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Add delete modal state
  const [entryToDelete, setEntryToDelete] = useState(null); // Entry to delete
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setStatuses(data);
    } catch (error) {
      handleShowErrorToast("Error fetching status options.");
    }
  };

  const handleDeleteStatus = async (id) => {
    const token = localStorage.getItem("auth_token");
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/delete-status/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatuses((prevStatuses) =>
        prevStatuses.filter((status) => status.id !== id)
      );
      handleShowSuccessToast("Status deleted successfully!");
      setIsDeleteModalOpen(false); // Close the modal after deletion
    } catch (error) {
      handleShowErrorToast("Error occurred while deleting status.");
    }
  };

  const handleAddStatus = async () => {
    if (!newStatus) {
      handleShowErrorToast("Status name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newStatus);

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-status`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (response.ok) {
        handleShowSuccessToast("Status added successfully!");
        fetchStatuses();
        setNewStatus("");
        setIsModalOpen(false);
      } else {
        handleShowErrorToast("Something went wrong.");
      }
    } catch (err) {
      handleShowErrorToast("An error occurred during submission.");
    }
  };

  const columns = [
    {
      name: "Status Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => {
            setEntryToDelete(row); // Set the entry to delete
            setIsDeleteModalOpen(true); // Open delete confirmation modal
          }}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredStatuses = statuses.filter(
    (status) =>
      status.name &&
      status.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto mt-6 p-4 font-thin max-w-full mx-auto">
      <div className="bg-white shadow-md p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-lg font-semibold">Status </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-600 w-full sm:w-auto"
          >
            Add Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={filteredStatuses}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15]}
            highlightOnHover
            responsive
            striped
          />
        </div>
      </div>

      {/* Add Status Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg text-center mb-4">Add New Status</h2>
            <input
              type="text"
              placeholder="New Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border rounded p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={handleAddStatus}
                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full sm:w-auto"
              >
                Add
              </button>
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
              Are you sure you want to delete the following status?
            </p>
            <p className="text-sm text-gray-600 mb-2 text-center">
              Status: {entryToDelete.name}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDeleteStatus(entryToDelete.id)}
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

export default Status;
