import { useState } from "react";
import { showToast } from "@/components/alert/page";

const AddFacility = ({
  isOpen,
  closePopup,
  properties = [],
  setFacilities,
}) => {
  if (!isOpen) return null;

  const [selectedPropertyId, setSelectedPropertyId] = useState(""); // Store selected property ID
  const [facilityCount, setFacilityCount] = useState(1);
  const [facilityNames, setFacilityNames] = useState([""]);
  const [loading, setLoading] = useState(false);

  const handlePropertyChange = (e) => {
    setSelectedPropertyId(e.target.value);
  };

  const handleFacilityCountChange = (e) => {
    const count = Math.max(1, parseInt(e.target.value, 10) || 1);
    setFacilityCount(count);
    setFacilityNames(Array(count).fill(""));
  };

  const handleFacilityNameChange = (index, value) => {
    setFacilityNames((prev) => {
      const newFacilities = [...prev];
      newFacilities[index] = value;
      return newFacilities;
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPropertyId) {
      showToast("Please select a property.", "error");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("auth_token");

    try {
      const requestData = facilityNames
        .filter((name) => name.trim() !== "")
        .map((name) => ({
          property_id: selectedPropertyId,
          facilities: name, // ✅ Ensure only the name is passed
        }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/addFacilities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast("Facilities added successfully!", "success");

        setFacilities((prev) => {
          // ✅ Find the correct property name
          const propertyName =
            properties.find(
              (prop) => String(prop.id) === String(selectedPropertyId)
            )?.name || "Unknown";

          return {
            ...prev,
            [selectedPropertyId]: {
              property_name: propertyName, // ✅ Fix property name
              facilities: [
                ...(prev[selectedPropertyId]?.facilities || []),
                ...data.map((facility) => facility.name), // ✅ Store only names
              ],
            },
          };
        });

        closePopup();
      } else {
        showToast(data.message || "Failed to add facilities.", "error");
      }
    } catch (error) {
      showToast("Error adding facilities.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add Facilities
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Property Selection Dropdown */}
          <div>
            <label className="text-lg font-medium text-gray-700">
              Select Property
            </label>
            <select
              value={selectedPropertyId}
              onChange={handlePropertyChange}
              className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Choose Property --</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>

          {/* Facility Count Input */}
          <div>
            <label className="text-lg font-medium text-gray-700">
              How many Facility Names?
            </label>
            <input
              type="number"
              value={facilityCount}
              onChange={handleFacilityCountChange}
              className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          {/* Facility Name Inputs */}
          {facilityNames.map((name, index) => (
            <div key={index}>
              <label className="text-lg font-medium text-gray-700">
                Facility Name {index + 1}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) =>
                  handleFacilityNameChange(index, e.target.value)
                }
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closePopup}
              className="bg-gray-400 text-black px-4 py-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Facilities"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacility;
