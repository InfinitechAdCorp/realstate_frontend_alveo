"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaFilePdf, FaFileExcel, FaEllipsisV } from "react-icons/fa";
import exportToPDF from "@/app/admin/components/export/exportPDF"; // ✅ Reusable PDF export
import exportToExcel from "@/app/admin/components/export/exportExcel"; // ✅ Reusable Excel export
import { showToast } from "@/components/alert/page";
import EditModal from "@/app/admin/components/modal/clientproperty/editModal";

const ClientProperties = () => {
  const [submittedProperties, setSubmittedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/submitted-properties`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch properties");

      const data = await response.json();
      const formattedData = data.map((property) => ({
        ...property,
        files:
          typeof property.files === "string"
            ? JSON.parse(property.files).map((file) => file.replace(/\\/g, "/"))
            : [],
      }));

      setSubmittedProperties(formattedData);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/submitted-properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        showToast("Property deleted successfully!", "success");
        setSubmittedProperties((prev) =>
          prev.filter((p) => p.id !== propertyId)
        );
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete property.");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      showToast("An error occurred while deleting the property.", "error");
    }
  };

  const toggleDropdown = (propertyId) => {
    setOpenDropdown(openDropdown === propertyId ? null : propertyId);
  };

  const handleExportPDF = () => {
    const exportData = submittedProperties.map((property) => ({
      "First Name": property.first_name,
      "Last Name": property.last_name,
      Email: property.email,
      Phone: property.phone,
      "Property Name": property.property_name,
      Location: property.location,
      Status: property.status,
      Price: property.price
        ? `₱${Number(
            property.price.split("-")[0].trim()
          ).toLocaleString()} - ₱${Number(
            property.price.split("-")[1].trim()
          ).toLocaleString()}`
        : "N/A",
    }));

    exportToPDF("Client Properties", exportData);
  };

  const handleExportExcel = () => {
    const exportData = submittedProperties.map((property) => ({
      first_name: property.first_name,
      last_name: property.last_name,
      email: property.email,
      phone: property.phone,
      property_name: property.property_name,
      location: property.location,
      status: property.status,
      price: property.price,
    }));

    exportToExcel("Client Properties", exportData);
  };

  const filteredProperties = submittedProperties.filter((property) =>
    property.property_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { name: "First Name", selector: (row) => row.first_name, sortable: true },
    { name: "Last Name", selector: (row) => row.last_name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true, wrap: true },
    { name: "Phone", selector: (row) => row.phone, sortable: true, wrap: true },
    {
      name: "Property Name",
      selector: (row) => row.property_name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
      wrap: true,
    },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Price",
      selector: (row) =>
        row.price
          ? `₱${Number(
              row.price.split("-")[0].trim()
            ).toLocaleString()} - ₱${Number(
              row.price.split("-")[1].trim()
            ).toLocaleString()}`
          : "N/A",
      sortable: true,
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="relative">
          <button
            onClick={() => toggleDropdown(row.id)}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <FaEllipsisV />
          </button>
          {openDropdown === row.id && (
            <div className="fixed right-10 bg-white shadow-md rounded-md w-24 mr-16 z-50">
              <button
                onClick={() => handleEdit(row)}
                className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="block w-full px-4 py-2 text-red-600 hover:bg-gray-100"
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
        {/* Title & Export Buttons in One Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold">Client Properties</h2>
          <div className="flex gap-3 mt-2 md:mt-0">
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

        {/* Search Filter (Moved Below Title) */}
        <div className="mt-2">
          <input
            type="text"
            placeholder="Search by property name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 px-3 py-2 border rounded-md text-sm"
          />
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredProperties}
          pagination
          highlightOnHover
          responsive
          striped
        />

        <EditModal
          modalOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          property={editingProperty}
          fetchData={fetchProperties}
        />
      </div>
    </div>
  );
};

export default ClientProperties;
