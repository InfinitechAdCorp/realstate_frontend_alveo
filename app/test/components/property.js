"use client";
import { useState, useEffect } from "react";
import { FaFilePdf, FaFileExcel, FaPlus, FaEllipsisV } from "react-icons/fa";
import { showToast } from "@/components/alert/page";
import exportToPDF from "@/app/test/components/export/exportPDF";
import exportToExcel from "@/app/test/components/export/exportExcel";
import AddPropertyModal from "@/app/test/components/modal/property/addproperty"; // Ensure correct import path
import UpdatePropertyModal from "@/app/test/components/modal/property/updateProperty"; // Adjust path if needed

import DataTable from "react-data-table-component";

const PropertyTable = () => {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false); // State for Add Property modal
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null); // State for selected property
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleExportPDF = () => {
    if (properties.length === 0) {
      console.error("No data available for export.");
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
      console.error("No data available for export.");
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

  const fetchProperties = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/properties`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch properties");

      const data = await response.json();
      setProperties(
        data.map((property) => ({
          ...property,
          price_range: formatPriceRange(property.price_range),
        }))
      );
    } catch (err) {
      showToast("Failed to load properties.", "error");
    }
  };

  const formatPriceRange = (priceRange) => {
    if (!priceRange) return "N/A";
    const [minPrice, maxPrice] = priceRange.split(" - ");
    return `₱${Number(minPrice).toLocaleString()} - ₱${Number(
      maxPrice
    ).toLocaleString()}`;
  };

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

  const handleConfirmDelete = async () => {
    if (!selectedProperty) return;

    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/deleteproperty`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: [selectedProperty.id] }), // Send ID as an array
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProperties((prevProperties) =>
          prevProperties.filter(
            (property) => property.id !== selectedProperty.id
          )
        );
        showToast(data.message || "Property deleted successfully!", "success");
        setIsDeleteModalOpen(false);
      } else {
        showToast(data.message || "Failed to delete property.", "error");
      }
    } catch (error) {
      showToast("Error occurred while deleting property.", "error");
    }
  };

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Location", selector: (row) => row.location, sortable: true },
    {
      name: "Specific Location",
      selector: (row) => row.specific_location,
      sortable: true,
    },
    { name: "Price Range", selector: (row) => row.price_range, sortable: true },
    { name: "Units", selector: (row) => row.units, sortable: true },
    { name: "Land Area", selector: (row) => row.land_area, sortable: true },
    {
      name: "Development Type",
      selector: (row) => row.development_type,
      sortable: true,
    },
    {
      name: "Architectural Theme",
      selector: (row) => row.architectural_theme,
      sortable: true,
    },
    { name: "Status", selector: (row) => row.status, sortable: true },
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
                  handleUpdateClick(row); // Open update modal
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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold">Properties</h2>
            <input
              type="text"
              placeholder="Search by property name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border rounded-md text-sm mt-2 md:mt-0"
            />
          </div>

          {/* Action Buttons: Add Property + Export */}
          <div className="flex gap-3 mt-2 md:mt-0">
            <button
              onClick={() => setIsAddPropertyOpen(true)} // Opens the Add Property modal
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Property
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFileExcel className="mr-2" /> Export Excel
            </button>
          </div>
        </div>

        {/* Search Bar */}

        {/* Data Table */}
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
      </div>

      {/* Add Property Modal */}
      {isAddPropertyOpen && (
        <AddPropertyModal
          isOpen={isAddPropertyOpen}
          closePopup={setIsAddPropertyOpen} // Pass setIsAddPropertyOpen function
          handleFileChange={() => {}}
        />
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && selectedProperty && (
        <UpdatePropertyModal
          property={selectedProperty}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdateSuccess={fetchProperties} // Refresh list after update
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this property?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyTable;
