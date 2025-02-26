import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { motion } from "framer-motion";
import {
  FaFilePdf,
  FaFileExcel,
  FaPlus,
  FaEllipsisV,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import exportToPDF from "@/app/test/components/export/exportPDF";
import exportToExcel from "@/app/test/components/export/exportExcel";
import { showToast } from "@/components/alert/page";
import AddFeatureModal from "@/app/test/components/modal/feature/addFeature";
import UpdateFeature from "@/app/test/components/modal/feature/updateFeature";

const FeatureTable = ({ properties, loading }) => {
  const [groupedFeatures, setGroupedFeatures] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [isEditFeatureOpen, setIsEditFeatureOpen] = useState(false);

  useEffect(() => {
    if (!loading && properties.length > 0) {
      setGroupedFeatures(
        properties.map((property) => ({
          property_name: property.name,
          property_id: property.id,
          features: Array.isArray(property.features)
            ? property.features
            : property.features
            ? JSON.parse(property.features)
            : [],
        }))
      );
    }
  }, [properties, loading]);

  const handleFeatureSubmit = (newFeatures, propertyId) => {
    setGroupedFeatures((prev) =>
      prev.map((group) =>
        group.property_id === propertyId
          ? { ...group, features: [...(group.features || []), ...newFeatures] }
          : group
      )
    );
  };

  const handleUpdateClick = (property) => {
    setSelectedFeature(property);
    setIsEditFeatureOpen(true);
  };

  const handleFeatureUpdate = (updatedFeatures, propertyId) => {
    setGroupedFeatures((prev) =>
      prev.map((group) =>
        group.property_id === propertyId
          ? {
              ...group,
              features: Array.isArray(updatedFeatures) ? updatedFeatures : [],
            }
          : group
      )
    );
  };

  const handleDeleteClick = async (propertyId) => {
    if (
      !confirm(
        "Are you sure you want to delete all features for this property?"
      )
    )
      return;

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
          body: JSON.stringify({ id: [propertyId] }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete features");

      showToast("All features deleted successfully!", "success");
      setGroupedFeatures((prev) =>
        prev.map((group) =>
          group.property_id === propertyId ? { ...group, features: [] } : group
        )
      );
    } catch (error) {
      console.error("Error deleting features:", error);
      showToast("Error deleting features.", "error");
    }
  };

  const filteredFeatures = groupedFeatures.filter(({ property_name }) =>
    property_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      name: "Property Name",
      selector: (row) => row.property_name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Features",
      cell: ({ features }) => (
        <div className="overflow-hidden relative w-full">
          <motion.div
            className="overflow-x-auto whitespace-nowrap max-w-full h-24 flex items-center scrollbar-hide"
            whileTap={{ cursor: "grabbing" }}
          >
            {Array.isArray(features) && features.length > 0 ? (
              <motion.div
                className="flex gap-4"
                drag="x"
                dragConstraints={{ left: -200, right: 0 }}
              >
                {features.map((feature, index) =>
                  feature?.image ? (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${feature.image}`}
                        alt={feature.name || "Unnamed Feature"}
                        className="w-24 h-16 rounded-md object-cover border"
                      />
                      <span className="text-xs mt-1 text-center">
                        {feature.name || "Unnamed Feature"}
                      </span>
                    </div>
                  ) : null
                )}
              </motion.div>
            ) : (
              <span className="text-gray-500">No features available</span>
            )}
          </motion.div>
        </div>
      ),
      minWidth: "400px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="relative">
          <button
            onClick={() =>
              setActionMenuOpen(
                actionMenuOpen === row.property_id ? null : row.property_id
              )
            }
            className="text-gray-600 hover:text-gray-800"
          >
            <FaEllipsisV />
          </button>
          {actionMenuOpen === row.property_id && (
            <div className="absolute right-0 bg-white border shadow-md rounded-md w-32 z-50">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleUpdateClick(row)}
              >
                <FaEdit /> Update
              </button>
              <button
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleDeleteClick(row.property_id)}
              >
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div className="p-4">
      <div className="bg-white shadow-md p-4 rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold">Features by Property</h2>
            <input
              type="text"
              placeholder="Search by property name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm mt-2 md:mt-0"
            />
          </div>
          <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
            <button
              onClick={() => setIsAddFeatureOpen(true)}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Feature
            </button>
            <button
              onClick={() => exportToPDF("Features Report", filteredFeatures)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <button
              onClick={() => exportToExcel("Features Report", filteredFeatures)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFileExcel className="mr-2" /> Export Excel
            </button>
          </div>
        </div>
        <div className="overflow-auto">
          <DataTable
            columns={columns}
            data={filteredFeatures}
            pagination
            highlightOnHover
            striped
          />
          {isEditFeatureOpen && (
            <UpdateFeature
              isOpen={isEditFeatureOpen}
              onClose={() => setIsEditFeatureOpen(false)}
              property={selectedFeature}
              onUpdate={handleFeatureUpdate}
            />
          )}

          {isAddFeatureOpen && (
            <AddFeatureModal
              isOpen={isAddFeatureOpen}
              onClose={() => setIsAddFeatureOpen(false)}
              properties={properties}
              onSubmit={handleFeatureSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeatureTable;
