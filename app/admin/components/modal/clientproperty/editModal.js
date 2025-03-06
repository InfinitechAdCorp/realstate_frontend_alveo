import { useState, useEffect } from "react";
import { showToast } from "@/components/alert/page";

const EditModal = ({ modalOpen, closeModal, property, fetchData }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    property_name: "",
    location: "",
    price: "",
    status: "",
    description: "",
  });

  useEffect(() => {
    if (property) {
      setFormData({
        first_name: property.first_name || "",
        last_name: property.last_name || "",
        email: property.email || "",
        phone: property.phone || "",
        property_name: property.property_name || "",
        location: property.location || "",
        price: property.price || "",
        status: property.status || "",
        description: property.description || "",
      });
    }
  }, [property]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/submitted-properties/${property.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        showToast("Property updated successfully!", "success");
        fetchData(); // ✅ Refresh the DataTable after editing
        closeModal();
      } else {
        showToast(result.message || "Failed to update property.", "error");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      showToast("An error occurred while updating the property.", "error");
    }
  };

  return (
    modalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Edit Property</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="border p-2 rounded w-full"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded w-full"
              required
            />

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-2 rounded w-full"
              required
            />

            <input
              type="text"
              name="property_name"
              value={formData.property_name}
              onChange={handleChange}
              placeholder="Property Name"
              className="border p-2 rounded w-full"
              required
            />

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="border p-2 rounded w-full"
              required
            />

            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-2 rounded w-full"
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="New">New</option>
              <option value="Ready for Occupancy">Ready for Occupancy</option>
              <option value="Under Construction">Under Construction</option>
            </select>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              rows="3"
              className="border p-2 rounded w-full"
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditModal;
