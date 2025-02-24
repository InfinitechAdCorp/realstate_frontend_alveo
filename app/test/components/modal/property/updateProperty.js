"use client";
import { useState } from "react";
import { showToast } from "@/components/alert/page"; // Ensure correct import

const UpdatePropertyModal = ({ property, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState(property);

  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };

  const handleShowErrorToast = (message) => {
    showToast(message, "error");
  };

  const handleShowWarningToast = (message) => {
    showToast(message, "warning");
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();

    // Remove the peso sign from the price_range before sending to the backend
    const updatedValues = { ...formData };
    if (updatedValues.price_range) {
      updatedValues.price_range = updatedValues.price_range.replace(
        /[₱,]/g,
        ""
      ); // Remove peso sign and commas
    }

    // API payload structure
    const payload = [
      {
        propertyId: updatedValues.id,
        item: updatedValues,
      },
    ];

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/update-properties`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.message === "Properties updated successfully.") {
        handleShowSuccessToast("Property updated successfully");
        onUpdateSuccess();
        onClose();
      } else {
        handleShowErrorToast("Failed to update property");
      }
    } catch (error) {
      console.error("Error:", error);
      handleShowErrorToast("Error occurred while updating property");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Update Property: {formData.name}
        </h2>
        <form
          onSubmit={handleUpdateProperty}
          className="grid grid-cols-2 gap-4"
        >
          {Object.keys(formData)
            .filter(
              (key) =>
                ![
                  "id",
                  "created_at",
                  "updated_at",
                  "features",
                  "key",
                  "path",
                  "view",
                ].includes(key)
            ) // Exclude specific fields
            .map((key) => (
              <div key={key}>
                <label className="block text-sm font-bold">
                  {key.replace(/_/g, " ").toUpperCase()}
                </label>
                <input
                  type="text"
                  value={formData[key] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
            ))}
          <div className="flex justify-end space-x-2 col-span-2 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
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

export default UpdatePropertyModal;
