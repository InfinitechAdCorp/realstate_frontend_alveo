import { useState } from "react";
import { showToast } from "@/components/alert/page";

const AddFeatureModal = ({ isOpen, onClose, properties, onSubmit }) => {

  const [formData, setFormData] = useState({
    propertyId: "",
    featureCount: 1,
    features: [],
  });
  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };

  const handleShowErrorToast = (message) => {
    showToast(message, "error"); // Error toast
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (e, index) => {
    const { name, value, files } = e.target;
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [name]: files ? files[0] : value,
    };
    setFormData((prev) => ({ ...prev, features: updatedFeatures }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.propertyId || formData.features.length === 0) {
      handleShowErrorToast("Please fill in all required fields.");
      return;
    }
  
    const data = new FormData();
    const selectedProperty = properties.find((p) => p.id === Number(formData.propertyId));
  
    if (!selectedProperty) {
      handleShowErrorToast("Invalid property selected.");
      return;
    }
  
    data.append("propertyId", selectedProperty.id);
    data.append("propertyName", selectedProperty.name);
  
    const newFeatures = formData.features.map((feature, index) => ({
      name: feature.featureName,
      image: feature.featureImage ? URL.createObjectURL(feature.featureImage) : null,
    }));
  
    formData.features.forEach((feature, index) => {
      if (feature.featureName) {
        data.append(`features[${selectedProperty.id}][${index}][featureName]`, feature.featureName);
      }
      if (feature.featureImage) {
        data.append(`features[${selectedProperty.id}][${index}][featureImage]`, feature.featureImage);
      }
    });
  
 
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/addFeature`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
  
      if (!response.ok) {
        throw new Error("Failed to add feature");
      }
      handleShowSuccessToast("Feature added successfully!");
      onSubmit(newFeatures, selectedProperty.id); // Call onSubmit
      onClose();
  };
  
  

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Building Feature</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-lg font-medium text-gray-700">Select Property</label>
              <select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Select Property --</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-lg font-medium text-gray-700">How many Features?</label>
              <input
                type="number"
                name="featureCount"
                value={formData.featureCount}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            {Array.from({ length: parseInt(formData.featureCount) }).map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-lg font-medium text-gray-700">Feature Name {index + 1}</label>
                  <input
                    type="text"
                    name="featureName"
                    value={formData.features[index]?.featureName || ""}
                    onChange={(e) => handleFeatureChange(e, index)}
                    className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-lg font-medium text-gray-700">Feature Image {index + 1}</label>
                  <input
                    type="file"
                    name="featureImage"
                    onChange={(e) => handleFeatureChange(e, index)}
                    className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.features[index]?.featureImage && (
                    <img
                      src={URL.createObjectURL(formData.features[index].featureImage)}
                      alt={`Feature Image ${index + 1}`}
                      className="mt-2 max-w-full h-auto"
                    />
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Add Feature
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 text-black px-4 py-2 rounded-lg hover:bg-gray-500"
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

export default AddFeatureModal;
