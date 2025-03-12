"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  FaFilePdf,
  FaFileExcel,
  FaPlus,
  FaEllipsisV,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import exportToPDF from "@/app/admin/components/export/exportPDF";
import exportToExcel from "@/app/admin/components/export/exportExcel";
import { showToast } from "@/components/alert/page";
import AddFeatureModal from "@/app/admin/components/modal/feature/addFeature";
import UpdateFeature from "@/app/admin/components/modal/feature/updateFeature";

const FeatureTable = () => {
  const [features, setFeatures] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [isEditFeatureOpen, setIsEditFeatureOpen] = useState(false);

  // New state for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);

  const fetchFeatures = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/getAllfeature`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch features");

      const data = await response.json();
      setFeatures(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching features:", err);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleFeatureSubmit = async () => {
    setIsAddFeatureOpen(false);
    await fetchFeatures(); // ✅ Refresh after adding a feature
  };

  const handleUpdateClick = (feature) => {
    setSelectedFeature(feature);
    setIsEditFeatureOpen(true);
  };

  const handleFeatureUpdate = (updatedFeatures) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((group) =>
        group.name === selectedFeature.name
          ? { ...group, features: updatedFeatures }
          : group
      )
    );
  };

  const handleDeleteClick = (featureId, featureName) => {
    setFeatureToDelete({ id: featureId, name: featureName });
    setIsDeleteModalOpen(true);
  };

  const confirmDeletion = async () => {
    if (!featureToDelete) return;

    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/deletefeature`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: [featureToDelete.id] }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete feature");

      showToast("Feature deleted successfully!", "success");
      await fetchFeatures();
    } catch (error) {
      console.error("Error deleting feature:", error);
      showToast("Error deleting feature.", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setFeatureToDelete(null);
    }
  };

  const filteredFeatures = features.filter(
    ({ name }) => name && name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      name: "Feature Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Features",
      cell: ({ features }) => (
        <div className="flex flex-wrap gap-2">
          {Array.isArray(features) && features.length > 0 ? (
            features.map((feature, index) =>
              feature.image ? (
                <div key={index} className="text-center">
                  <img
                    src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${feature.image}`}
                    alt={feature.name || "Unnamed Feature"}
                    className="w-24 h-16 rounded-md object-cover border"
                  />
                  <p className="text-xs mt-1">
                    {feature.name || "Unnamed Feature"}
                  </p>
                </div>
              ) : null
            )
          ) : (
            <span className="text-gray-500">No features available</span>
          )}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="relative min-w-[100px]">
          <button
            onClick={() =>
              setActionMenuOpen(actionMenuOpen === row.id ? null : row.id)
            }
            className="text-gray-600 hover:text-gray-800"
          >
            <FaEllipsisV />
          </button>
          {actionMenuOpen === row.id && (
            <div className="fixed -ml-20  bg-white shadow-md rounded-md w-24 mr-16  z-50">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleUpdateClick(row)}
              >
                <FaEdit /> Update
              </button>
              <button
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleDeleteClick(row.id, row.name)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="bg-white shadow-md p-4 rounded-md">
        {/* Title & Search Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold">Features</h2>
            <input
              type="text"
              placeholder="Search by feature name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border rounded-md text-sm mt-2 md:mt-0"
            />
          </div>

          {/* Export Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setIsAddFeatureOpen(true)}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center w-full sm:w-auto"
            >
              <FaPlus className="mr-2" /> Add Feature
            </button>
            <button
              onClick={() => exportToPDF("Features Report", filteredFeatures)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center w-full sm:w-auto"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <button
              onClick={() => exportToExcel("Features Report", filteredFeatures)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center w-full sm:w-auto"
            >
              <FaFileExcel className="mr-2" /> Export Excel
            </button>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredFeatures}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>

      {/* Add Feature Modal */}
      {isAddFeatureOpen && (
        <AddFeatureModal
          isOpen={isAddFeatureOpen}
          onClose={() => setIsAddFeatureOpen(false)}
          onSubmit={handleFeatureSubmit}
          featuresData={features}
        />
      )}

      {/* Update Feature Modal */}
      {isEditFeatureOpen && selectedFeature && (
        <UpdateFeature
          isOpen={isEditFeatureOpen}
          onClose={() => setIsEditFeatureOpen(false)}
          selectedFeature={selectedFeature}
          onUpdate={handleFeatureUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && featureToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Delete Confirmation
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Are you sure you want to delete the following feature?
            </p>
            <p className="text-md font-medium text-gray-700 mb-6 text-center">
              <span className="block mb-2">
                Property: {featureToDelete.name}
              </span>
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeletion}
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

export default FeatureTable;
