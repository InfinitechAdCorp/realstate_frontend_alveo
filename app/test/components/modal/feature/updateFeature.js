import { useState, useEffect } from "react";
import { showToast } from "@/components/alert/page";

const EditFeatureModal = ({ isOpen, onClose, property, onUpdate }) => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (property) {
      setFeatures(property.features);
    }
  }, [property]);

  const handleFeatureChange = async (e, index) => {
    const { name, value, files } = e.target;
    const updatedFeatures = [...features];

    if (files && files[0]) {
      const file = files[0];

      // Convert image to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        updatedFeatures[index] = {
          ...updatedFeatures[index],
          [name]: reader.result, // Store Base64 string
        };
        setFeatures([...updatedFeatures]);
      };
    } else {
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [name]: value,
      };
      setFeatures(updatedFeatures);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("auth_token");

    const requestData = {
      propertyId: property.property_id,
      features: features.map(({ name, image }) => ({
        name,
        image: image || "", // Keep existing image path if no new image
      })),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/update-features`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) throw new Error("Failed to update feature");

      const result = await response.json();
      onUpdate(result.data, property.property_id);
      showToast("Feature updated successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error updating feature:", error);
      showToast("Error updating feature.", "error");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full max-w-lg shadow-lg">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Edit Features</h2>
          </div>

          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium">Feature Name</label>
                  <input
                    type="text"
                    name="name"
                    value={feature.name || ""}
                    onChange={(e) => handleFeatureChange(e, index)}
                    className="border px-3 py-2 rounded-lg w-full mt-1"
                  />

                  <label className="block text-sm font-medium mt-3">Feature Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => handleFeatureChange(e, index)}
                    className="border px-3 py-2 rounded-lg w-full mt-1"
                  />

                  {feature.image && (
                    <img
                      src={
                        feature.image.startsWith("data:image")
                          ? feature.image // Base64 preview
                          : `${process.env.NEXT_PUBLIC_SERVER_PORT}${feature.image}`
                      }
                      alt="Feature"
                      className="mt-3 w-24 h-16 rounded-md border shadow-sm"
                    />
                  )}
                </div>
              ))}
            </form>
          </div>

          <div className="p-4 border-t flex justify-between bg-gray-50">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-1/2 mr-2"
            >
              Update
            </button>
            <button
              onClick={onClose}
              className="bg-gray-400 text-black px-4 py-2 rounded-lg w-1/2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditFeatureModal;
