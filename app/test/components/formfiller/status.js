"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  handleShowSuccessToast,
  handleShowErrorToast,
} from "@/app/test/toastalert";

const Status = () => {
  const [statuses, setStatuses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

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

      if (response.ok) {
        handleShowSuccessToast("Status deleted successfully!");
        setStatuses((prevStatuses) =>
          prevStatuses.filter((status) => status.id !== id)
        );
      } else {
        handleShowErrorToast("Failed to delete status.");
      }
    } catch (error) {
      handleShowErrorToast("Error occurred while deleting status.");
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
          onClick={() => handleDeleteStatus(row.id)}
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

  return (
    <div className="h-full overflow-y-auto mt-6 p-4 font-thin max-w-6xl mx-auto">
      <div className="bg-white shadow-md p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-lg font-semibold">Status Options</h2>
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
            data={statuses}
            pagination
            highlightOnHover
            responsive
            striped
          />
        </div>
      </div>

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
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStatus}
                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full sm:w-auto"
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
