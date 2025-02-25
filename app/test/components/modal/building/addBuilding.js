import { useState } from "react";
import { showToast } from "@/components/alert/page";
const AddBuilding = ({
  isOpen,
  closePopup,
  properties,
  setBuildingData,
  developmentTypes,
}) => {
  if (!isOpen) return null;

  const [newBuilding, setNewBuilding] = useState({
    propertyId: properties.length > 0 ? properties[0].id : "", // ✅ Match backend
    propertyName: properties.length > 0 ? properties[0].name : "", // ✅ Required for file path
    buildingName: "", // ✅ Match backend
    developmentType: "",
    residentialLevels: "",
    basementParkingLevels: "",
    podiumParkingLevels: "",
    commercialUnits: "",
    lowerGroundParkingLevels: "",
    buildingView: null, // ✅ File Upload Field
  });

  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };

  const handleShowErrorToast = (message) => {
    showToast(message, "error");
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBuilding((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewBuilding((prev) => ({
      ...prev,
      buildingView: e.target.files[0], // ✅ File handling
    }));
  };
  const handleAddBuilding = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");

    try {
      const formData = new FormData();
      Object.keys(newBuilding).forEach((key) => {
        if (newBuilding[key] !== null) {
          formData.append(key, newBuilding[key]);
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/addBuildings`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }, // ✅ No "Content-Type" for FormData
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        handleShowSuccessToast("Building added successfully!");

        // ✅ Ensure `property_name` is updated based on selected property
        const matchedProperty = properties.find(
          (prop) => prop.id === newBuilding.propertyId
        );

        const newBuildingWithPropertyName = {
          ...data.building, // Existing building data from backend
          property_name: matchedProperty ? matchedProperty.name : "Unknown", // ✅ Assign correct property name
        };

        // ✅ Inform Parent Component & Update Table Immediately
        setBuildingData((prev) => [...prev, newBuildingWithPropertyName]);

        closePopup();
      } else {
        console.error("Error adding building:", data);
        handleShowErrorToast(data.message || "Failed to add building");
      }
    } catch (error) {
      console.error("Error adding building:", error);
      handleShowErrorToast("There was an error adding the building.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add New Building
        </h2>

        <form
          className="grid grid-cols-2 gap-4 w-full"
          onSubmit={handleAddBuilding}
        >
          {/* Property Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Property Name
            </label>
            <select
              name="propertyId"
              value={newBuilding.propertyId}
              onChange={handleInputChange}
              className="border rounded w-full py-2 px-3"
            >
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>

          {/* Building Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Building Name
            </label>
            <input
              type="text"
              name="buildingName"
              className="border rounded w-full py-2 px-3"
              value={newBuilding.buildingName}
              onChange={handleInputChange}
            />
          </div>

          {/* Development Type Dropdown */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Development Type
            </label>
            <select
              name="developmentType"
              value={newBuilding.developmentType}
              onChange={handleInputChange}
              className="border rounded w-full py-2 px-3"
            >
              <option value="">Select Development Type</option>
              {developmentTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Residential Levels */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Residential Levels
            </label>
            <input
              type="number"
              name="residentialLevels"
              className="border rounded w-full py-2 px-3"
              value={newBuilding.residentialLevels}
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
              name="basementParkingLevels"
              className="border rounded w-full py-2 px-3"
              value={newBuilding.basementParkingLevels}
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
              name="podiumParkingLevels"
              className="border rounded w-full py-2 px-3"
              value={newBuilding.podiumParkingLevels}
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
              name="commercialUnits"
              className="border rounded w-full py-2 px-3"
              value={newBuilding.commercialUnits}
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
              name="lowerGroundParkingLevels"
              className="border rounded w-full py-2 px-3"
              value={newBuilding.lowerGroundParkingLevels}
              onChange={handleInputChange}
            />
          </div>

          {/* Building Image Upload */}
          <div className="mb-4 col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload Building Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="border rounded w-full py-2 px-3"
              onChange={handleFileChange}
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex justify-end space-x-2 mt-4 col-span-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Building
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

export default AddBuilding;
