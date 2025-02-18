import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx"; // Correct import for XLSX
import { jsPDF } from "jspdf"; // Correct import for jsPDF

const ClientProperties = () => {
  const [submittedProperties, setSubmittedProperties] = useState([]);
  const [perPage, setPerPage] = useState(10); // Default to 5 per page
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
      .then((data) => {
        console.log(data);
        setSubmittedProperties(data);
      })
      .catch((error) => {
        console.error("Error fetching submitted properties:", error);
      });
  }, []);

  useEffect(() => {
    console.log(submittedProperties);
  }, [submittedProperties]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to page 1 when changing rows per page
  };

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
        { label: "Middle Name:", value: property.middle_name || "N/A" },
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
    // Placeholder function: You can implement modal logic here
    alert(`Show Images: ${JSON.stringify(files)}`);
  };

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
    { name: "Description", selector: (row) => row.description, sortable: true },
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
    <div className="mt-20">
      <div className="justify-center text-center text-3xl my-2 mb-3">
        <h1 className="text-customBlue">CLIENT PROPERTIES</h1>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={exportPDF}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
        >
          <FaFilePdf className="inline-block mr-2" />
          Export PDF
        </button>
        <button
          onClick={exportExcel}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaFileExcel className="inline-block mr-2" />
          Export Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          title="Client Properties"
          columns={columns}
          data={submittedProperties}
          pagination
          paginationServer
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[5, 10, 15]}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerPageChange}
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default ClientProperties;
