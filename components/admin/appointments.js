import { useEffect, useState } from "react";
import "simple-datatables/dist/style.css";
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

  // Function to handle accepting the appointment
  const handleAccept = async (id) => {
    console.log("Accept button clicked for ID:", id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/appointment/accept/${id}`,
        {
          method: "POST", // Assuming the API requires POST for accepting
        }
      );
      if (!response.ok) {
        throw new Error("Failed to accept appointment");
      }
      // Update the appointment status locally after successful acceptance
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

  // Function to handle declining the appointment
  const handleDecline = async (id) => {
    console.log("Decline button clicked for ID:", id);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/appointment/decline/${id}`,
        {
          method: "POST", // Assuming the API requires POST for declining
        }
      );
      if (!response.ok) {
        throw new Error("Failed to decline appointment");
      }
      // Update the appointment status locally after successful decline
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

  return (
    <div className="w-full px-4">
      <div className="overflow-x-auto">
        <div className="text-3xl justify-center text-center my-2 mb-3">
          <h1 className="text-customBlue">SCHEDULED APPOINTMENTS</h1>
        </div>
        <table
          id="search-table"
          className="table-auto border-collapse border border-gray-200 w-full text-sm text-left text-gray-700"
        >
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone Number</th>
              <th className="border border-gray-300 px-4 py-2">
                Appointment For
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Property/Unit
              </th>
              <th className="border border-gray-300 px-4 py-2">Message</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.fullname}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.number}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.reason}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.property}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.message}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {appointment.status.toUpperCase()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div>
                    <button
                      onClick={() => handleAccept(appointment.id)}
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={() => handleDecline(appointment.id)}
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
