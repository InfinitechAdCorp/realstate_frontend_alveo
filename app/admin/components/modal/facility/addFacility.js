import { useState } from "react";
import { showToast } from "@/components/alert/page";

const AddFacility = ({
  isOpen,
  closePopup,
  facilitiesData,
  properties, // Use properties passed from the parent
  onSubmit,
}) => {
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [facilityList, setFacilityList] = useState([""]); // Start with one input field

  // Handle property selection
  const handlePropertyChange = (e) => {
    const propertyId = e.target.value;
    setSelectedPropertyId(propertyId);
    // Find the selected property by its ID
    const selectedPropertyName = properties.find(
      (property) => property.id === parseInt(propertyId) // Use parseInt to ensure matching ID type
    )?.name;

    setSelectedProperty(selectedPropertyName || "");
  };

  const handleFacilityChange = (index, value) => {
    const updatedFacilities = [...facilityList];
    updatedFacilities[index] = value;
    setFacilityList(updatedFacilities);
  };

  const addFacilityField = () => {
    setFacilityList([...facilityList, ""]);
  };

  const removeFacilityField = (index) => {
    setFacilityList(facilityList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure a property is selected
    if (!selectedPropertyId) {
      showToast("Please select a property.", "error");
      return;
    }

    // Ensure at least one facility is added
    const newFacilities = facilityList.filter((name) => name.trim() !== "");
    if (newFacilities.length === 0) {
      showToast("Please add at least one facility.", "error");
      return;
    }

    // Prepare the data to be sent to the backend
    const payload = newFacilities.map((facility) => ({
      property_id: selectedPropertyId,
      facilities: facility,
    }));

    console.log("Sending payload:", payload); // Debug the payload being sent

    const token = localStorage.getItem("auth_token");
    try {
      // Send data to the backend API using a POST request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/addFacilities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload), // Send the data as JSON
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add facilities");
      }

      // Parse the response JSON
      const data = await response.json();
      console.log("Backend response:", data); // Debug the response from the backend

      // Handle success
      showToast("Facility added successfully!", "success");

      // Update the state in the parent component if necessary
      onSubmit({ propertyId: selectedPropertyId, facilities: newFacilities });

      closePopup(); // Close the popup
    } catch (error) {
      console.error("Error adding facility:", error);
      showToast("Error adding facility. Please try again.", "error");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Add Facility</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Property Selection Dropdown */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Select Property
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={selectedPropertyId || ""}
                onChange={handlePropertyChange}
              >
                <option value="">-- Select Property --</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Facility Inputs */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Facilities
              </label>
              {facilityList.map((facility, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                    value={facility}
                    onChange={(e) =>
                      handleFacilityChange(index, e.target.value)
                    }
                    placeholder="Enter facility name"
                  />
                  <button
                    type="button"
                    className="text-red-500 text-sm"
                    onClick={() => removeFacilityField(index)}
                  >
                    ✖
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-blue-500 text-sm underline"
                onClick={addFacilityField}
              >
                + Add More
              </button>
            </div>

            {/* Submit & Close Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Facility
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
    )
  );
};

export default AddFacility;
