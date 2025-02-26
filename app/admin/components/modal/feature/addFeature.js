import { useState } from "react";
import { showToast } from "@/components/alert/page";

const AddFeatureModal = ({ isOpen, onClose, featuresData, onSubmit }) => {
  const [selectedFeatureId, setSelectedFeatureId] = useState("");
  const [features, setFeatures] = useState([
    { featureName: "", featureImage: null },
  ]);

  const handleFeatureSelect = (e) => {
    setSelectedFeatureId(e.target.value);
  };

  const handleFeatureChange = (index, field, value) => {
    setFeatures((prevFeatures) => {
      const updatedFeatures = [...prevFeatures];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
      return updatedFeatures;
    });
  };

  const addFeatureField = () => {
    setFeatures([...features, { featureName: "", featureImage: null }]);
  };

  const removeFeatureField = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFeatureId || features.length === 0) {
      showToast("Please select a feature and add at least one entry.", "error");
      return;
    }

    const selectedFeature = featuresData.find(
      (f) => f.id === Number(selectedFeatureId)
    );
    console.log(selectedFeature.id);

    const formData = new FormData();

    features.forEach((feature, index) => {
      if (feature.featureName) {
        formData.append(
          `features[${selectedFeature.id}][${index}][featureName]`,
          feature.featureName
        );
      }
      if (feature.featureImage) {
        formData.append(
          `features[${selectedFeature.id}][${index}][featureImage]`,
          feature.featureImage
        );
      }
    });

    console.log("📤 Sending Form Data:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/addFeature`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to add feature");

      showToast("Feature added successfully!", "success");
      onSubmit();
      onClose();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Add Feature
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feature Selection Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Feature
              </label>
              <select
                value={selectedFeatureId}
                onChange={handleFeatureSelect}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Select Feature --</option>
                {featuresData.map((feature) => (
                  <option key={feature.id} value={feature.id}>
                    {feature.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Feature Inputs (Dynamic) */}
            {features.map((feature, index) => (
              <div key={index} className="p-3 border rounded-md bg-gray-50">
                {/* Feature Name */}
                <label className="block text-sm font-medium text-gray-700">
                  Feature Name {index + 1}
                </label>
                <input
                  type="text"
                  value={feature.featureName}
                  onChange={(e) =>
                    handleFeatureChange(index, "featureName", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />

                {/* Feature Image */}
                <label className="block text-sm font-medium text-gray-700 mt-2">
                  Feature Image {index + 1}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFeatureChange(
                      index,
                      "featureImage",
                      e.target.files[0]
                    )
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                {feature.featureImage && (
                  <img
                    src={URL.createObjectURL(feature.featureImage)}
                    alt={`Feature Image ${index + 1}`}
                    className="mt-2 w-24 h-24 object-cover rounded-md"
                  />
                )}

                {/* Remove Field Button */}
                {features.length > 1 && (
                  <button
                    type="button"
                    className="mt-2 text-red-500 text-sm underline"
                    onClick={() => removeFeatureField(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* Add More Button */}
            <button
              type="button"
              className="text-blue-500 text-sm underline"
              onClick={addFeatureField}
            >
              + Add More
            </button>

            {/* Submit & Close Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md w-full sm:w-auto hover:bg-blue-600"
              >
                Add Feature
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 text-white px-4 py-2 rounded-md w-full sm:w-auto"
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
