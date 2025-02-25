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
import exportToPDF from "@/app/test/components/export/exportPDF";
import exportToExcel from "@/app/test/components/export/exportExcel";
import { showToast } from "@/components/alert/page";
// import AddFeature from "@/app/test/components/modal/feature/addFeature";
// import UpdateFeature from "@/app/test/components/modal/feature/updateFeature";

const FeatureTable = ({ properties, loading }) => {
  const [groupedFeatures, setGroupedFeatures] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false);
  const [isUpdateFeatureOpen, setIsUpdateFeatureOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null); // Manage Action Menu state

  useEffect(() => {
    if (!loading && properties.length > 0) {
      const formattedData = properties.map((property) => {
        try {
          const features = JSON.parse(property.features);
          return {
            property_name: property.name,
            property_id: property.id,
            features: features.map((feature, index) => ({
              id: `${property.id}-${index}`,
              name: feature.name,
              image: feature.image,
            })),
          };
        } catch (error) {
          console.error(`Error parsing features for ${property.name}:`, error);
          return {
            property_name: property.name,
            property_id: property.id,
            features: [],
          };
        }
      });

      setGroupedFeatures(formattedData);
    }
  }, [properties, loading]);

  const handleDeleteClick = async (propertyId, featureName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${featureName}"?`
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/delete-feature`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            property_id: propertyId,
            feature_name: featureName,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast(`Feature "${featureName}" deleted successfully!`, "success");

        setGroupedFeatures((prev) =>
          prev.map((group) =>
            group.property_id === propertyId
              ? {
                  ...group,
                  features: group.features.filter(
                    (f) => f.name !== featureName
                  ),
                }
              : group
          )
        );
      } else {
        showToast(data.message || "Failed to delete feature.", "error");
      }
    } catch (error) {
      showToast("Error deleting feature.", "error");
    }
  };

  const handleUpdateClick = (property, feature) => {
    setSelectedFeature({ property, feature });
    setIsUpdateFeatureOpen(true);
  };

  const filteredFeatures = groupedFeatures.filter((property) =>
    property.property_name.toLowerCase().includes(searchQuery.toLowerCase())
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
      cell: (row) => (
        <div className="flex flex-wrap gap-4">
          {row.features.length > 0 ? (
            row.features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${feature.image}`}
                  alt={feature.name}
                  className="w-24 h-16 rounded-md object-cover border"
                />
                <span className="text-xs mt-1 text-center">{feature.name}</span>
              </div>
            ))
          ) : (
            <span className="text-gray-500">No features available</span>
          )}
        </div>
      ),
      minWidth: "600px",
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
              {row.features.length > 0 ? (
                row.features.map((feature, index) => (
                  <div key={index} className="flex flex-col">
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => handleUpdateClick(row, feature)}
                    >
                      <FaEdit /> Update
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() =>
                        handleDeleteClick(row.property_id, feature.name)
                      }
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-gray-500 text-sm p-2">No actions</span>
              )}
            </div>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="bg-white shadow-md p-4 rounded-md">
        {/* Header & Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold">Features by Property</h2>
            <input
              type="text"
              placeholder="Search by property name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border rounded-md text-sm mt-2 md:mt-0"
            />
          </div>

          <div className="flex gap-3 mt-2 md:mt-0">
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

        <DataTable
          columns={columns}
          data={filteredFeatures}
          pagination
          highlightOnHover
          striped
        />
      </div>
    </div>
  );
};

export default FeatureTable;
