"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

const ClientProperties = () => {
  const [submittedProperties, setSubmittedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

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
      .then((data) => setSubmittedProperties(data))
      .catch((error) =>
        console.error("Error fetching submitted properties:", error)
      );
  }, []);

  const exportExcel = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Property Name",
      "Location",
      "Price",
      "Status",
      "Description",
      "Files",
    ];

    const data = submittedProperties.map((property) => [
      property.first_name,
      property.last_name,
      property.email,
      property.phone,
      property.property_name,
      property.location,
      property.price,
      property.status,
      property.description,
      property.files ? JSON.parse(property.files).join(", ") : "N/A",
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Client Properties");
    XLSX.writeFile(wb, "client-properties.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Client Properties Report", 10, 10);
    doc.line(10, 12, 200, 12);

    let yOffset = 20;
    submittedProperties.forEach((property, index) => {
      doc.setFont("helvetica", "bold");
      doc.text(`Property #${index + 1}`, 10, yOffset);
      doc.setFont("helvetica", "normal");
      yOffset += 8;

      const fields = [
        { label: "First Name:", value: property.first_name },
        { label: "Last Name:", value: property.last_name },
        { label: "Email:", value: property.email },
        { label: "Phone:", value: property.phone },
        { label: "Property Name:", value: property.property_name },
        { label: "Location:", value: property.location },
        { label: "Price:", value: property.price },
        { label: "Status:", value: property.status },
        { label: "Description:", value: property.description },
      ];

      fields.forEach((field) => {
        doc.setFont("helvetica", "bold");
        doc.text(field.label, 10, yOffset);
        doc.setFont("helvetica", "normal");
        doc.text(field.value.toString(), 60, yOffset);
        yOffset += 8;
      });

      doc.line(10, yOffset, 200, yOffset);
      yOffset += 4;
    });

    doc.save("client-properties.pdf");
  };

  const openModal2 = (files) => {
    alert(`Show Images: ${JSON.stringify(files)}`);
  };

  const filteredProperties = submittedProperties.filter((property) =>
    property.property_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { name: "First Name", selector: (row) => row.first_name, sortable: true },
    { name: "Last Name", selector: (row) => row.last_name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.phone, sortable: true },
    {
      name: "Property Name",
      selector: (row) => row.property_name,
      sortable: true,
    },
    { name: "Location", selector: (row) => row.location, sortable: true },
    { name: "Price", selector: (row) => row.price, sortable: true },
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
      cell: (row) => (
        <div>
          {row.files && JSON.parse(row.files).length > 0 && (
            <button
              onClick={() => openModal2(JSON.parse(row.files))}
              className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
            >
              Show Images
            </button>
          )}
        </div>
      ),
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
              onClick={exportPDF}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <button
              onClick={exportExcel}
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
          highlightOnHover
          responsive
          striped
        />
      </div>
    </div>
  );
};

export default ClientProperties;
