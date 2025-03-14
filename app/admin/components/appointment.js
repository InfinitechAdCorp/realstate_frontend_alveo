"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  FaTrash,
  FaFilePdf,
  FaFileExcel,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { showToast } from "@/components/alert/page";
import exportToPDF from "@/app/admin/components/export/exportPDF";
import exportToExcel from "@/app/admin/components/export/exportExcel";

export const handleShowSuccessToast = (message) =>
  showToast(message, "success");
export const handleShowErrorToast = (message) => showToast(message, "error");

const Table = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setAppointmentToDelete(id);
    setIsConfirmOpen(true); // ✅ Show confirmation modal
  };

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

  const updateAppointmentStatus = async (id, status) => {
    try {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_PORT
        }/api/admin/appointment/${status.toLowerCase()}/${id}`,
        { method: "POST" }
      );

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? { ...appointment, status } : appointment
        )
      );

      handleShowSuccessToast(`Appointment ${status.toLowerCase()}ed!`);
      setModalOpen(false);
    } catch (error) {
      handleShowErrorToast("Error updating appointment status.");
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
  const handleDelete = async () => {
    if (!appointmentToDelete) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/appointment/delete/${appointmentToDelete}`,
        { method: "DELETE" }
      );

      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentToDelete)
      );
      handleShowSuccessToast("Appointment deleted successfully!");
    } catch (error) {
      handleShowErrorToast("Error deleting appointment.");
    } finally {
      setIsConfirmOpen(false); // ✅ Close modal
      setAppointmentToDelete(null);
    }
  };

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const columns = [
    { name: "Full Name", selector: (row) => row.fullname, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.number, sortable: true },
    { name: "Appointment For", selector: (row) => row.reason, sortable: true },
    { name: "Property/Unit", selector: (row) => row.property, sortable: true },
    { name: "Message", selector: (row) => row.message || "N/A", wrap: true },
    {
      name: "Status",
      selector: (row) => row.status.toUpperCase(),
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-md text-white cursor-pointer ${
            row.status === "ACCEPTED"
              ? "bg-green-500"
              : row.status === "DECLINED"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
          onClick={() => openModal(row)}
        >
          {row.status.toUpperCase()}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleDeleteClick(row.id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <FaTrash />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="h-full overflow-y-auto mt-6 p-4 font-thin">
      <div className="bg-white shadow-md p-4 rounded-md">
        {/* Title & Export Buttons (Same Line) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Scheduled Appointments</h2>

          <div className="flex gap-3 mt-2 md:mt-0">
            <button
              onClick={() =>
                exportToPDF("Scheduled Appointments", appointments)
              }
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <button
              onClick={() =>
                exportToExcel("Scheduled Appointments", appointments)
              }
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFileExcel className="mr-2" /> Export Excel
            </button>
          </div>
        </div>

        {/* Search Filter (New Line) */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredAppointments}
          pagination
          highlightOnHover
          responsive
          striped
        />

        {modalOpen && selectedAppointment && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-lg mb-4 text-center">
                Change Status for {selectedAppointment.fullname}?
              </h2>
              <p className="text-center text-sm text-gray-600 mb-4">
                Current Status:{" "}
                <span
                  className={`font-bold ${
                    selectedAppointment.status === "ACCEPTED"
                      ? "text-green-500"
                      : selectedAppointment.status === "DECLINED"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {selectedAppointment.status}
                </span>
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                {selectedAppointment.status === "PENDING" && (
                  <>
                    <button
                      onClick={() =>
                        updateAppointmentStatus(
                          selectedAppointment.id,
                          "ACCEPTED"
                        )
                      }
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center"
                    >
                      <FaCheck className="mr-2" /> Accept
                    </button>
                    <button
                      onClick={() =>
                        updateAppointmentStatus(
                          selectedAppointment.id,
                          "DECLINED"
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center"
                    >
                      <FaTimes className="mr-2" /> Decline
                    </button>
                  </>
                )}
                {selectedAppointment.status === "ACCEPTED" && (
                  <button
                    onClick={() =>
                      updateAppointmentStatus(
                        selectedAppointment.id,
                        "DECLINED"
                      )
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center"
                  >
                    <FaTimes className="mr-2" /> Decline
                  </button>
                )}
                {selectedAppointment.status === "DECLINED" && (
                  <button
                    onClick={() =>
                      updateAppointmentStatus(
                        selectedAppointment.id,
                        "ACCEPTED"
                      )
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center"
                  >
                    <FaCheck className="mr-2" /> Accept
                  </button>
                )}
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="mt-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {isConfirmOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="text-gray-600">
                Are you sure you want to delete this appointment?
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
