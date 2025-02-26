"use client";
import { useState } from "react";
import { FaFilePdf, FaFileExcel, FaPlus, FaEllipsisV } from "react-icons/fa";
import { showToast } from "@/components/alert/page";
import exportToPDF from "@/app/admin/components/export/exportPDF";
import exportToExcel from "@/app/admin/components/export/exportExcel";
import AddPropertyModal from "@/app/admin/components/modal/property/addproperty";
import UpdatePropertyModal from "@/app/admin/components/modal/property/updateProperty";
import DataTable from "react-data-table-component";

const PropertyTable = ({ properties, loading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleExportPDF = () => {
    if (properties.length === 0) {
      showToast("No data available for export.", "error");
      return;
    }

    const exportData = properties.map((property) => ({
      Name: property.name,
      Location: property.location,
      "Specific Location": property.specific_location,
      "Price Range": property.price_range,
      Units: property.units,
      "Land Area": property.land_area,
      "Development Type": property.development_type,
      "Architectural Theme": property.architectural_theme,
      Status: property.status,
    }));

    exportToPDF("Properties Report", exportData);
  };

  const handleExportExcel = () => {
    if (properties.length === 0) {
      showToast("No data available for export.", "error");
      return;
    }

    const exportData = properties.map((property) => ({
      name: property.name,
      location: property.location,
      specific_location: property.specific_location,
      price_range: property.price_range,
      units: property.units,
      land_area: property.land_area,
      development_type: property.development_type,
      architectural_theme: property.architectural_theme,
      status: property.status,
    }));

    exportToExcel("Properties Report", exportData);
  };

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActionClick = (propertyId) => {
    setIsActionMenuOpen(isActionMenuOpen === propertyId ? null : propertyId);
  };

  const handleDeleteClick = (property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateClick = (property) => {
    setSelectedProperty(property);
    setIsUpdateModalOpen(true);
  };

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Location", selector: (row) => row.location, sortable: true },
    {
      name: "Specific Location",
      selector: (row) => row.specific_location,
      sortable: true,
      wrap: true,
    },
    {
      name: "Price Range",
      selector: (row) => {
        if (!row.price_range) return "N/A"; // Handle empty values

        const [min, max] = row.price_range.split(" - ").map(Number); // Split and convert to numbers

        return `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`; // Format with peso sign and commas
      },
      sortable: true,
      wrap: true,
    },
    { name: "Units", selector: (row) => row.units, sortable: true, wrap: true },
    { name: "Land Area", selector: (row) => row.land_area, sortable: true },
    {
      name: "Development Type",
      selector: (row) => row.development_type,
      sortable: true,
      wrap: true,
    },
    {
      name: "Architectural Theme",
      selector: (row) => row.architectural_theme,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="relative">
          <button
            onClick={() => handleActionClick(row.id)}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaEllipsisV />
          </button>
          {isActionMenuOpen === row.id && (
            <div className="absolute right-0 bg-white border shadow-md rounded-md w-32 z-50">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  handleUpdateClick(row);
                  setIsActionMenuOpen(null);
                }}
              >
                Update
              </button>
              <button
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                onClick={() => {
                  handleDeleteClick(row);
                  setIsActionMenuOpen(null);
                }}
              >
                Delete
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

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="bg-white shadow-md p-4 rounded-md">
        <div className="flex flex-col md:flex-col lg:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-auto text-center md:text-left">
            <h2 className="text-lg font-semibold">Properties</h2>
            <input
              type="text"
              placeholder="Search by property name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border rounded-md text-sm mt-2 md:mt-0"
            />
          </div>

          <div className="flex flex-col md:flex-row lg:flex-row gap-3 mt-2 md:mt-4 lg:mt-0 w-full md:w-auto justify-center">
            <button
              onClick={() => setIsAddPropertyOpen(true)}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center justify-center w-full md:w-auto"
            >
              <FaPlus className="mr-2" /> Add Property
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center justify-center w-full md:w-auto"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center justify-center w-full md:w-auto"
            >
              <FaFileExcel className="mr-2" /> Export Excel
            </button>
          </div>
        </div>

        {/* Data Table or Loading */}
        {loading ? (
          <p className="text-center text-gray-500">Loading properties...</p>
        ) : (
          <DataTable
            columns={columns}
            data={filteredProperties}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15]}
            highlightOnHover
            responsive
            striped
          />
        )}
      </div>

      {/* Add Property Modal */}
      {isAddPropertyOpen && (
        <AddPropertyModal
          isOpen={isAddPropertyOpen}
          closePopup={setIsAddPropertyOpen}
          handleFileChange={() => {}}
        />
      )}

      {/* Update Property Modal */}
      {isUpdateModalOpen && selectedProperty && (
        <UpdatePropertyModal
          property={selectedProperty}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdateSuccess={() => {
            showToast("Property updated successfully", "success");
            setIsUpdateModalOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this property?</p>
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={() => {}}
                className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 w-full sm:w-auto"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200 w-full sm:w-auto"
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

export default PropertyTable;
