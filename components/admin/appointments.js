import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { showToast } from "@/components/alert/page";

export const handleShowSuccessToast = (message) => {
  showToast(message, "success");
};

export const handleShowErrorToast = (message) => {
  showToast(message, "error");
};

export const handleShowWarningToast = (message) => {
  showToast(message, "warning");
};

const Table = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/appointments`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleAccept = async (id) => {
    console.log("Accept button clicked for ID:", id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/appointment/accept/${id}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to accept appointment");
      }
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: "Accepted" }
            : appointment
        )
      );
      handleShowSuccessToast(`Appointment accepted`);
    } catch (error) {
      console.error("Error accepting appointment:", error);
    }
  };

  const handleDecline = async (id) => {
    console.log("Decline button clicked for ID:", id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/appointment/decline/${id}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to decline appointment");
      }
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: "Declined" }
            : appointment
        )
      );
      handleShowSuccessToast(`Appointment declined`);
    } catch (error) {
      console.error("Error declining appointment:", error);
    }
  };

  const columns = [
    {
      name: "Full Name",
      selector: (row) => row.fullname,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.number,
      sortable: true,
    },
    {
      name: "Appointment For",
      selector: (row) => row.reason,
      sortable: true,
    },
    {
      name: "Property/Unit",
      selector: (row) => row.property,
      sortable: true,
    },
    {
      name: "Message",
      selector: (row) => row.message,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status.toUpperCase(),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            onClick={() => handleAccept(row.id)}
            className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            <FaCheckCircle />
          </button>
          <button
            onClick={() => handleDecline(row.id)}
            className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
          >
            <FaTimesCircle />
          </button>
        </div>
      ),
    },
  ];

  // Filter appointments only by "fullname"
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="w-full px-4">
      <div className="text-3xl text-center my-2 mb-3">
        <h1 className="text-customBlue">SCHEDULED APPOINTMENTS</h1>
      </div>

      {/* Search Input */}
      <div className="mb-3 flex justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-96 px-3 py-2 border rounded"
        />
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <DataTable
          title="Appointments"
          columns={columns}
          data={filteredAppointments}
          progressPending={loading}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15]}
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default Table;
