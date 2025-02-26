import { useState, useEffect } from "react";
import { showToast } from "@/components/alert/page";

const EditFeatureModal = ({
  isOpen,
  onClose,
  selectedFeature,
  propertyId,
  onUpdate = () => {},
}) => {
  const [rowData, setRowData] = useState({});

  useEffect(() => {
    if (selectedFeature) {
      setRowData({
        ...selectedFeature,
        features: Array.isArray(selectedFeature.features)
          ? selectedFeature.features
          : JSON.parse(selectedFeature.features || "[]"), // ✅ Ensure it's an array
      });
    }
  }, [selectedFeature]);

  const handleImageChange = (e, index) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;

    const updatedFeatures = [...rowData.features];
    updatedFeatures[index].image = files[0]; // Store the file itself
    setRowData({ ...rowData, features: updatedFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");

    try {
      const formData = new FormData();
      formData.append("propertyId", rowData.id);
      formData.append("propertyName", rowData.name);

      rowData.features.forEach((feature, index) => {
        formData.append(`features[${index}][name]`, feature.name);

        if (feature.image instanceof File) {
          formData.append(`features[${index}][image]`, feature.image);
        } else if (typeof feature.image === "string") {
          formData.append(`features[${index}][image]`, feature.image);
        }
      });

      console.log("📤 Sending FormData:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/updateFeature`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ API Response:", data);

      if (data.status === "success") {
        setTimeout(() => {
          setRowData((prevData) => ({
            ...prevData,
            features: Array.isArray(data.data)
              ? data.data
              : JSON.parse(data.data || "[]"), // ✅ Parse if needed
          }));
        }, 0);

        showToast("Features updated successfully!", "success");

        // ✅ Ensure `onUpdate` is always a function
        if (typeof onUpdate === "function") {
          onUpdate(
            Array.isArray(data.data) ? data.data : JSON.parse(data.data || "[]")
          );
        }

        onClose();
      } else {
        showToast(
          `❌ Error: ${data.message || "Something went wrong"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("🔥 Error updating features:", error);
      showToast("An error occurred while updating the features.", "error");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Update Features for: {rowData.name}
          </h2>
          <form className="w-full" onSubmit={handleSubmit}>
            {rowData.features?.map((feature, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 border-b pb-4"
              >
                {/* First Row - Feature Name Input */}
                <div className="space-y-4 p-4 bg-gray-50 border rounded-lg">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Feature Name
                    </label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={feature.name}
                      onChange={(e) => {
                        const updatedFeatures = [...rowData.features];
                        updatedFeatures[index].name = e.target.value;
                        setRowData({ ...rowData, features: updatedFeatures });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Feature Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="image"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                  </div>
                </div>

                {/* Second Row - Image Preview */}
                <div className="flex justify-center items-center sm:p-4 sm:bg-gray-50 sm:border sm:rounded-lg">
                  {feature.image ? (
                    feature.image instanceof File ? (
                      <img
                        src={URL.createObjectURL(feature.image)}
                        alt={feature.name || "Feature Image"}
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    ) : (
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${feature.image}`}
                        alt={feature.name || "Feature Image"}
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    )
                  ) : (
                    <div className="text-gray-500">No Image Available</div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Changes
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
    )
  );
};

export default EditFeatureModal;
