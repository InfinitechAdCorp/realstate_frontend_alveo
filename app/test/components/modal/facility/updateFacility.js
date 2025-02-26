import { useState, useEffect } from "react";
import { FaTimes, FaCheck, FaTrash } from "react-icons/fa";
import { showToast } from "@/components/alert/page";

const UpdateFacility = ({ isOpen, closePopup, facility, setFacilities }) => {
  if (!isOpen || !facility) return null;

  const [updatedFacilities, setUpdatedFacilities] = useState([]);

  useEffect(() => {
    if (facility.facilities) {
      setUpdatedFacilities(
        facility.facilities.map((name, index) => ({
          id: facility.ids ? facility.ids[index] : index, // Ensure real ID is included
          property_id: facility.property_id,
          name: name.trim(), // Trim spaces to avoid blank values
        }))
      );
    }
  }, [facility]);

  const handleFacilityNameChange = (index, value) => {
    setUpdatedFacilities((prev) =>
      prev.map((facility, i) =>
        i === index ? { ...facility, name: value.trim() } : facility
      )
    );
  };

  const handleDeleteFacility = (index) => {
    setUpdatedFacilities((prev) => prev.filter((_, i) => i !== index));
  };
  const handleBulkUpdate = async () => {
    const token = localStorage.getItem("auth_token");
    const filteredFacilities = updatedFacilities.filter((f) => f.name !== "");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/update-facilities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(filteredFacilities),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast("Facilities updated successfully!", "success");
        setFacilities((prev) => {
          const updated = { ...prev };
          updated[facility.property_id] = {
            ...updated[facility.property_id],
            facilities: updatedFacilities.map((f) => f.name), // ✅ Update facility names instantly
          };
          return updated; // ✅ React detects the state change
        });

        setSelectedFacility(null); // ✅ Reset modal state
        closePopup();
        showToast("Facilities updated successfully!", "success");
      } else {
        showToast(data.message || "Failed to update facilities.", "error");
      }
    } catch (error) {
      showToast("Error updating facilities.", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-auto shadow-xl">
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 bg-gray-500 text-white rounded-full p-2 focus:outline-none hover:bg-gray-600"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Update Facility
        </h2>

        {/* Facilities List or No Facility Message */}
        <div className="space-y-6 max-h-[400px] overflow-y-auto">
          {updatedFacilities.length === 0 ? (
            <div className="text-center text-gray-500 font-medium">
              No facility found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {updatedFacilities.map((facility, index) => (
                <div
                  key={facility.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 ease-in-out flex items-center justify-between"
                >
                  <input
                    type="text"
                    value={facility.name}
                    onChange={(e) =>
                      handleFacilityNameChange(index, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Facility Name"
                  />
                  <button
                    onClick={() => handleDeleteFacility(index)}
                    className="ml-3 text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Update and Cancel Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleBulkUpdate}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-200"
          >
            Update Selected
          </button>
          <button
            onClick={closePopup}
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateFacility;
