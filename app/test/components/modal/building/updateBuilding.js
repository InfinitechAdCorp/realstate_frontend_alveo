import { useState } from "react";
import { showToast } from "@/components/alert/page";
const UpdateBuilding = ({ isOpen, closePopup, building, setBuildingData }) => {
  if (!isOpen || !building) return null; // Do not render if closed or no data

  const [updatedBuilding, setUpdatedBuilding] = useState({ ...building });
  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };

  const handleShowErrorToast = (message) => {
    showToast(message, "error");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBuilding((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateBuilding = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/update-buildings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([{ item: updatedBuilding }]), // Laravel expects array
        }
      );

      const data = await response.json();

      if (response.ok) {
        handleShowSuccessToast("Building updated successfully!");

        // Update local state with new data from the API response
        setBuildingData((prev) =>
          prev.map((b) =>
            b.id === updatedBuilding.id ? { ...b, ...updatedBuilding } : b
          )
        );

        closePopup();
      } else {
        throw new Error(data.message || "Failed to update building");
      }
    } catch (error) {
      console.error("Error updating building:", error);
      handleShowErrorToast("There was an error updating the building.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Update Building: {updatedBuilding.name}
        </h2>

        <form
          className="grid grid-cols-2 gap-4 w-full"
          onSubmit={handleUpdateBuilding}
        >
          {/* Building Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Building Name
            </label>
            <input
              type="text"
              name="name"
              className="border rounded w-full py-2 px-3"
              value={updatedBuilding.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Development Type */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Development Type
            </label>
            <input
              type="text"
              name="development_type"
              className="border rounded w-full py-2 px-3"
              value={updatedBuilding.development_type}
              onChange={handleInputChange}
            />
          </div>

          {/* Residential Levels */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Residential Levels
            </label>
            <input
              type="number"
              name="residential_levels"
              className="border rounded w-full py-2 px-3"
              value={updatedBuilding.residential_levels}
              onChange={handleInputChange}
            />
          </div>

          {/* Basement Parking */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Basement Parking Levels
            </label>
            <input
              type="number"
              name="basement_parking_levels"
              className="border rounded w-full py-2 px-3"
              value={updatedBuilding.basement_parking_levels}
              onChange={handleInputChange}
            />
          </div>

          {/* Podium Parking */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Podium Parking Levels
            </label>
            <input
              type="number"
              name="podium_parking_levels"
              className="border rounded w-full py-2 px-3"
              value={updatedBuilding.podium_parking_levels}
              onChange={handleInputChange}
            />
          </div>

          {/* Commercial Units */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Commercial Units
            </label>
            <input
              type="number"
              name="commercial_units"
              className="border rounded w-full py-2 px-3"
              value={updatedBuilding.commercial_units}
              onChange={handleInputChange}
            />
          </div>

          {/* Lower Ground Parking */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Lower Ground Parking Levels
            </label>
            <input
              type="number"
              name="lower_ground_floor_parking_levels"
              className="border rounded w-full py-2 px-3"
              value={updatedBuilding.lower_ground_floor_parking_levels}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4 col-span-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={closePopup}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBuilding;
