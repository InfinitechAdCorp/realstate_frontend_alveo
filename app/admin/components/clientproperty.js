"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaFilePdf, FaFileExcel, FaEllipsisV } from "react-icons/fa";
import exportToPDF from "@/app/admin/components/export/exportPDF";
import exportToExcel from "@/app/admin/components/export/exportExcel";
import { showToast } from "@/components/alert/page";
import EditModal from "@/app/admin/components/modal/clientproperty/editModal"; // Import EditModal at the top

const ClientProperties = () => {
  const [submittedProperties, setSubmittedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null); // Tracks dropdown visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const fetchProperties = () => {
    const token = localStorage.getItem("auth_token");
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/submitted-properties`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((property) => {
          let fixedFiles = [];
          if (property.files && typeof property.files === "string") {
            try {
              fixedFiles = JSON.parse(property.files).map((file) =>
                file.replace(/\\/g, "/")
              );
            } catch (error) {
              console.error("Error parsing files:", property.files, error);
            }
          }
          return { ...property, files: fixedFiles };
        });

        setSubmittedProperties(formattedData);
      })
      .catch((error) =>
        console.error("Error fetching submitted properties:", error)
      );
  };

  // Call fetchProperties immediately after component mounts
  useEffect(() => {
    fetchProperties();
  }, []);

  const openImageModal = (files) => {
    setSelectedImages(files);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImages([]);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

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

      const result = await response.json();
      if (response.ok) {
        showToast("Property deleted successfully!", "success");
        // Remove deleted property from the state
        setSubmittedProperties((prevProperties) =>
          prevProperties.filter((property) => property.id !== propertyId)
        );
      } else {
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
      selector: (row) => {
        const priceRange = row.price;
        if (priceRange) {
          const [minPrice, maxPrice] = priceRange
            .split("-")
            .map((price) => `₱${Number(price.trim()).toLocaleString()}`);
          return `${minPrice} - ${maxPrice}`;
        }
        return "N/A";
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Files",
      cell: (row) => {
        let files = Array.isArray(row.files) ? row.files : [];
        return (
          <div>
            {files.length > 0 && (
              <button
                onClick={() => {
                  const imageUrls = files.map((file) => {
                    const cleanPath = file.replace(/\\/g, "/");
                    return `${process.env.NEXT_PUBLIC_SERVER_PORT}/${cleanPath}`;
                  });
                  openImageModal(imageUrls);
                }}
                className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
              >
                Show Images
              </button>
            )}
          </div>
        );
      },
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="relative">
          {/* Ellipsis button */}
          <button
            onClick={() => toggleDropdown(row.id)}
            className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <FaEllipsisV />
          </button>

          {/* Dropdown menu */}
          {openDropdown === row.id && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md z-10">
              <button
                onClick={() => handleEdit(row)}
                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
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
        {/* Title & Search Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Client Properties</h2>
          <input
            type="text"
            placeholder="Search by property name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 px-3 py-2 border rounded-md text-sm mt-2 md:mt-0"
          />
          <div className="flex gap-3">
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFileExcel className="mr-2" /> Export Excel
            </button>
          </div>
        </div>
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
        <EditModal
          modalOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          property={editingProperty}
          fetchData={fetchProperties} // ✅ Pass fetchProperties to update table after edit
        />
      </div>
    </div>
  );
};

export default ClientProperties;
