"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  handleShowSuccessToast,
  handleShowErrorToast,
} from "@/app/test/toastalert";

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
    } catch (error) {
      handleShowErrorToast("Error occurred while deleting location.");
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
          onClick={() => handleDeleteLocation(row.id)}
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

  const filteredLocations = locations.filter((location) =>
    location.area_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="bg-white shadow-md p-4 rounded-md">
        {/* Title & Search Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold">Locations</h2>
            <input
              type="text"
              placeholder="Search by area name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border rounded-md text-sm mt-2 md:mt-0"
            />
          </div>

          {/* Add Location Button */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500 rounded-md"
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
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
              <div className="flex justify-end gap-2 mt-4 text-sm">
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 text-sm"
                >
                  Cancel
                </button>
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
