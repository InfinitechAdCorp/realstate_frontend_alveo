"use client";
import { useEffect, useState } from "react";
import "simple-datatables/dist/style.css";

const DataTable = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/submitted-properties` // Replace with your API URL
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Assuming the API response is an array of properties
        setProperties(data); // Set properties directly as an array
      } catch (error) {
        setError(error.message); // Set error if any
      } finally {
        setLoading(false); // Mark loading as false after fetch
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (properties.length > 0) {
      const { DataTable } = require("simple-datatables");
      const tableElement = document.getElementById("search-table");
      if (tableElement) {
        new DataTable(tableElement);
      }
    }
  }, [properties]);

  if (loading) {
    return <p>Loading...</p>; // Show loading text until data is fetched
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error message if there's an error
  }

  const handleUpdateStatus = async (id, status) => {
    console.log("Updating status for ID:", id, "with status:", status);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/submitted-properties/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData); // Log the response error data
        throw new Error(
          `Failed to update status: ${errorData.message || "Unknown error"}`
        );
      }

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? { ...appointment, status } : appointment
        )
      );
    } catch (error) {
      console.error("Error updating status:", error.message); // Log the specific error message
      if (error.response) {
        console.error("Full error details:", error.response); // Log the full error details if available
      }
    }
  };

  return (
    <div className="w-full px-4">
      <div className="overflow-x-auto">
        <table
          id="search-table"
          className="table-auto border-collapse border border-gray-200 w-full text-sm text-left text-gray-700"
        >
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone Number</th>
              <th className="border border-gray-300 px-4 py-2">Property</th>
              <th className="border border-gray-300 px-4 py-2">Unit Type</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Location</th>
              <th className="border border-gray-300 px-4 py-2">Images</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {property.first_name} {property.last_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {property.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {property.number}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {property.property_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {property.unit_type}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {property.price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {property.location}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex flex-wrap gap-2">
                    {property.images &&
                    Array.isArray(property.images) &&
                    property.images.length > 0 ? (
                      property.images.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${image}`}
                          alt={`Property Image ${imgIndex + 1}`}
                          className="w-16 h-16 object-cover border rounded"
                          onError={(e) => {
                            e.target.src = "/fallback-image.jpg"; // Fallback image if the image fails to load
                          }}
                        />
                      ))
                    ) : (
                      <p>No images available</p> // Message when no images exist
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(property.id, "ACCEPTED")
                      }
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStatus(property.id, "DECLINED")
                      }
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Decline
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

export default DataTable;
