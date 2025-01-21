"use client";
import { useState, useEffect } from "react";
import { showToast } from "@/components/alert/page";

const Testimonial = () => {
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    message: "",
  });
  const [testimonialOptions, setTestimonialOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  // Fetch testimonials on component mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/testimonials`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }

        const data = await response.json();
        setTestimonialOptions(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load testimonials.");
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };

  const handleAdd = async () => {
    if (
      newTestimonial.name.trim() !== "" &&
      newTestimonial.message.trim() !== ""
    ) {
      const newTestimonialItem = {
        name: newTestimonial.name,
        message: newTestimonial.message,
      };

      const token = localStorage.getItem("auth_token");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/testimonials`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newTestimonialItem),
          }
        );

        const addedTestimonial = await response.json();
        setTestimonialOptions([...testimonialOptions, addedTestimonial]);
        setNewTestimonial({ name: "", message: "" });

        handleShowSuccessToast("Testimonial added successfully!");
        setIsModalOpen(false); // Close modal after submission
      } catch (err) {
        setError("Failed to add testimonial.");
      }
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("auth_token");

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/testimonials/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTestimonialOptions = testimonialOptions.filter(
        (testimonial) => testimonial.id !== id
      );
      setTestimonialOptions(updatedTestimonialOptions);
      handleShowSuccessToast(`Testimonial with ID ${id} deleted successfully.`);
    } catch (err) {
      setError("Failed to delete testimonial.");
    }
  };

  return (
    <div className="h-screen overflow-y-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Testimonial</h2>

        {/* Add Testimonial Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Add Testimonial
        </button>
      </div>

      {/* Testimonial List */}
      <ul className="border rounded-md shadow-md max-h-[70%] overflow-y-auto">
        {testimonialOptions.length > 0 ? (
          testimonialOptions.map((testimonial) => (
            <li
              key={testimonial.id}
              className="p-4 border-b hover:bg-gray-100 flex justify-between items-center"
            >
              <div>
                <strong>{testimonial.name}</strong>
                <p>{testimonial.message}</p>
              </div>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li className="p-4">No Testimonials Found</li>
        )}
      </ul>

      {/* Modal for Adding Testimonials */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Testimonial</h3>

            <input
              type="text"
              placeholder="Name"
              value={newTestimonial.name}
              onChange={(e) =>
                setNewTestimonial({ ...newTestimonial, name: e.target.value })
              }
              className="border rounded p-2 w-full mb-3"
            />
            <textarea
              placeholder="Message"
              value={newTestimonial.message}
              onChange={(e) =>
                setNewTestimonial({
                  ...newTestimonial,
                  message: e.target.value,
                })
              }
              className="border rounded p-2 w-full h-24 mb-3"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleAdd}
                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
              >
                Add
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonial;
