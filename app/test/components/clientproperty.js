"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import exportToPDF from "@/app/test/components/export/exportPDF"; // Import your reusable exportPDF function
import exportToExcel from "@/app/test/components/export/exportExcel"; // Import your reusable exportExcel function

const ClientProperties = () => {
  const [submittedProperties, setSubmittedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [showImageModal, setShowImageModal] = useState(false); // State to handle modal visibility
  const [selectedImages, setSelectedImages] = useState([]); // State to hold the images for the modal

  useEffect(() => {
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
        console.log("Raw Fetched Data:", data); // Log raw fetched data

        const formattedData = data.map((property) => {
          console.log("Before Fix:", property.files); // Log before fix

          let fixedFiles = [];

          if (property.files && typeof property.files === "string") {
            try {
              // Since `property.files` is already a valid JSON array, parse it directly
              fixedFiles = JSON.parse(property.files).map(
                (file) => file.replace(/\\/g, "/") // Replace `\` with `/` properly
              );
            } catch (error) {
              console.error("Error parsing files:", property.files, error);
            }
          }

          console.log("After Fix:", fixedFiles); // Log after fix

          return {
            ...property,
            files: fixedFiles, // Store as array with correct paths
          };
        });

        console.log("Formatted Data:", formattedData);
        setSubmittedProperties(formattedData);
      })

      .catch((error) =>
        console.error("Error fetching submitted properties:", error)
      );
  }, []);

  const openImageModal = (files) => {
    setSelectedImages(files); // Set selected images
    setShowImageModal(true); // Show the modal
  };

  const closeImageModal = () => {
    setShowImageModal(false); // Hide the modal
    setSelectedImages([]); // Clear images when modal is closed
  };

  const filteredProperties = submittedProperties.filter((property) =>
    property.property_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 📌 Handle Export to PDF using your reusable function
  const handleExportPDF = () => {
    if (filteredProperties.length === 0) {
      console.error("No data available for export.");
      return;
    }

    const exportData = filteredProperties.map((property) => ({
      "First Name": property.first_name,
      "Last Name": property.last_name,
      Email: property.email,
      Phone: property.phone,
      "Property Name": property.property_name,
      Location: property.location,
      Price: property.price,
      Status: property.status,
      Description: property.description || "No description provided",
    }));

    exportToPDF("Client Properties", exportData); // ✅ Uses your reusable exportPDF function
  };

  // 📌 Handle Export to Excel using your reusable function
  const handleExportExcel = () => {
    if (filteredProperties.length === 0) {
      console.error("No data available for export.");
      return;
    }

    const exportData = filteredProperties.map((property) => ({
      first_name: property.first_name,
      last_name: property.last_name,
      email: property.email,
      phone: property.phone,
      property_name: property.property_name,
      location: property.location,
      price: property.price,
      status: property.status,
      description: property.description || "No description provided",
    }));

    exportToExcel("Client Properties", exportData); // ✅ Uses your reusable exportExcel function
  };
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
    {
      name: "Price",
      selector: (row) => {
        const priceRange = row.price;
        if (priceRange) {
          const [minPrice, maxPrice] = priceRange.split("-").map((price) => {
            return `₱${Number(price.trim()).toLocaleString()}`;
          });
          return `${minPrice} - ${maxPrice}`;
        }
        return "N/A"; // Return N/A if there's no price range
      },
      sortable: true,
      wrap: true, // Ensures that the content doesn't get truncated in the DataTable
    },

    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Description",
      selector: (row) =>
        row.description.length > 100
          ? row.description.substring(0, 100) + "..."
          : row.description,
      wrap: true,
    },
    {
      name: "Files",
      cell: (row) => {
        let files = [];
        if (Array.isArray(row.files)) {
          files = row.files; // If already an array, use as is
        } else if (typeof row.files === "string") {
          try {
            files = JSON.parse(row.files); // Attempt to parse string JSON
          } catch (error) {
            console.error("Error parsing files:", row.files, error);
          }
        }

        return (
          <div>
            {files.length > 0 && (
              <button
                onClick={() => {
                  const imageUrls = files.map((file) => {
                    const cleanPath = file.replace(/\\/g, "/");
                    const url = `${process.env.NEXT_PUBLIC_SERVER_PORT}/${cleanPath}`;
                    console.log(url); // Log each generated URL to verify
                    return url;
                  });
                  openImageModal(imageUrls); // Pass the image URLs to the modal
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
  ];

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="bg-white shadow-md p-4 rounded-md">
        {/* Title & Search Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold">Client Properties</h2>
            <input
              type="text"
              placeholder="Search by property name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border rounded-md text-sm mt-2 md:mt-0"
            />
          </div>

          {/* Export Buttons */}
          <div className="flex gap-3">
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

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Property Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedImages.map((image, index) => (
                <img
                  key={index}
                  src={`${image}`}
                  alt={`Property Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded"
                />
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={closeImageModal}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProperties;
