"use client";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";
import { showToast } from "@/components/alert/page";
import exportToPDF from "@/app/test/components/export/exportPDF"; // Import the reusable export function
import exportToExcel from "@/app/test/components/export/exportExcel"; // Import reusable Excel function

export const handleShowSuccessToast = (message) => {
  showToast(message, "success");
};

export const handleShowErrorToast = (message) => {
  showToast(message, "error");
};

const Table = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmAction, setConfirmAction] = useState(null); // For tracking which action to confirm
  const [selectedAppointment, setSelectedAppointment] = useState(null); // For storing the selected appointment for confirmation

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/appointments`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      handleShowErrorToast("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/appointment/accept/${id}`,
        { method: "POST" }
      );

      setAppointments((prev) => {
        const updatedAppointments = prev.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: "ACCEPTED" }
            : appointment
        );
        return [...updatedAppointments]; // Ensure a new reference is created
      });

      handleShowSuccessToast("Appointment accepted!");
    } catch (error) {
      handleShowErrorToast("Error accepting appointment.");
    }
  };

  const handleDecline = async (id) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/appointment/decline/${id}`,
        { method: "POST" }
      );

      setAppointments((prev) => {
        const updatedAppointments = prev.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: "DECLINED" }
            : appointment
        );
        return [...updatedAppointments];
      });

      handleShowSuccessToast("Appointment declined!");
    } catch (error) {
      handleShowErrorToast("Error declining appointment.");
    }
  };

  // Export to PDF
  const handleExportPDF = () => {
    const exportData = appointments.map((appointment) => ({
      "Full Name": appointment.fullname,
      Email: appointment.email,
      Phone: appointment.number,
      "Appointment For": appointment.reason,
      "Property/Unit": appointment.property,
      Status: appointment.status,
      Message: appointment.message || "No message provided", // Ensure a default value
    }));

    exportToPDF("Scheduled Appointments", exportData);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const exportData = appointments.map((appointment) => ({
      fullname: appointment.fullname,
      email: appointment.email,
      phone: appointment.number,
      appointment_for: appointment.reason,
      property_unit: appointment.property,
      status: appointment.status,
      message: appointment.message || "No message provided",
    }));

    exportToExcel("Scheduled Appointments", exportData);
  };

  const columns = [
    { name: "Full Name", selector: (row) => row.fullname, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.number, sortable: true },
    { name: "Appointment For", selector: (row) => row.reason, sortable: true },
    { name: "Property/Unit", selector: (row) => row.property, sortable: true },
    {
      name: "Message",
      selector: (row) => row.message,
      wrap: true,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status.toUpperCase(),
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-md text-white ${
            row.status === "ACCEPTED"
              ? "bg-green-500"
              : row.status === "DECLINED"
              ? "bg-red-500"
              : row.status === "PENDING"
              ? "bg-yellow-500"
              : "bg-gray-400"
          }`}
        >
          {row.status.toUpperCase()}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedAppointment(row);
              setConfirmAction("accept");
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaCheckCircle />
          </button>
          <button
            onClick={() => {
              setSelectedAppointment(row);
              setConfirmAction("decline");
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <FaTimesCircle />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const confirmActionHandler = () => {
    if (confirmAction === "accept") {
      handleAccept(selectedAppointment.id);
    } else if (confirmAction === "decline") {
      handleDecline(selectedAppointment.id);
    }

    setConfirmAction(null); // Reset action after confirmation
    setSelectedAppointment(null); // Clear selected appointment
  };

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="max-h-full overflow-y-auto bg-white shadow-md p-3 rounded-md">
        {/* Header and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-3">
          <div className="w-full md:w-auto">
            <h2 className="text-lg mb-2">Scheduled Appointments</h2>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border rounded-md text-sm"
            />
          </div>

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
          data={filteredAppointments}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15]}
          highlightOnHover
          responsive
          striped
          progressPending={loading}
          noDataComponent="No Appointments Found"
        />
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg mb-4">
              Are you sure you want to{" "}
              {confirmAction === "accept" ? "accept" : "decline"} this
              appointment?
            </h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setConfirmAction(null)} // Close modal
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmActionHandler}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {confirmAction === "accept" ? "Accept" : "Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
