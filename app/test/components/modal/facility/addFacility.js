import React, { useState } from "react";

const AddFacility = ({ show, onClose, onSubmit, payment }) => {
  const [formData, setFormData] = useState({
    facilities: {
      facilityCount: 1,
      // Initialize the facility name fields based on the count
      ...Array.from({ length: 1 }, (_, index) => ({
        [`facilityName${index}`]: "",
      })).reduce((acc, obj) => ({ ...acc, ...obj }), {}),
    },
  });

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  const handleAddFacilities = (e) => {
    e.preventDefault();
    // Handle form submission, you can call onSubmit with the formData
    onSubmit(formData);
    onClose(); // Close the modal after submit
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add Building Facility for {payment.name}
        </h2>

        <form onSubmit={handleAddFacilities} className="space-y-3">
          <div className="space-y-1">
            <label className="text-lg font-medium text-gray-700">
              How many Facility Names?
            </label>
            <input
              type="number"
              name="facilityCount"
              value={formData.facilities.facilityCount}
              onChange={(e) => {
                handleInputChange(e, "facilities");
                const count = parseInt(e.target.value);
                const newFacilityNames = Array.from(
                  { length: count },
                  (_, index) => ({ [`facilityName${index}`]: "" })
                ).reduce((acc, obj) => ({ ...acc, ...obj }), {});

                setFormData((prevData) => ({
                  ...prevData,
                  facilities: {
                    ...prevData.facilities,
                    ...newFacilityNames,
                  },
                }));
              }}
              className="border px-3 py-2 rounded-lg w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-10"
              min="1"
              required
            />
          </div>

          {/* Facility Name Inputs */}
          {Array.from({
            length: formData.facilities.facilityCount || 0,
          }).map((_, index) => (
            <div key={index} className="space-y-1">
              <label className="text-lg font-medium text-gray-700">
                Facility Name {index + 1}
              </label>
              <input
                type="text"
                name={`facilityName${index}`}
                value={formData.facilities[`facilityName${index}`] || ""}
                onChange={(e) => handleInputChange(e, "facilities")}
                className="border px-3 py-2 rounded-lg w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-10"
                required
              />
            </div>
          ))}

          {/* Submit and Cancel Buttons */}
          <div className="space-y-1">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Facility
            </button>
            <button
              type="button"
              onClick={onClose} // Close the modal without submitting
              className="bg-gray-400 text-black px-4 py-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacility;
