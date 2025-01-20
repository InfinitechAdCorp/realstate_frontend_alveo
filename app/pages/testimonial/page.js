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

  // Fetch testimonials on component mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token"); // Get the token from localStorage
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/testimonials`,
          {
            method: "GET", // Method is optional here as GET is the default
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              "Content-Type": "application/json", // Optional: to ensure proper content type
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

  const handleShowErrorToast = (message) => {
    showToast(message, "error"); // Error toast
  };

  const handleShowWarningToast = (message) => {
    showToast(message, "warning"); // Warning toast
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

      const token = localStorage.getItem("auth_token"); // Retrieve the token from localStorage

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/testimonials`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
            body: JSON.stringify(newTestimonialItem),
          }
        );

        const addedTestimonial = await response.json();
        setTestimonialOptions([...testimonialOptions, addedTestimonial]);
        setNewTestimonial({ name: "", message: "" });

        handleShowSuccessToast("Testimonial added successfully!", "success"); // Success log
      } catch (err) {
        setError("Failed to add testimonial.");
      }
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("auth_token"); // Retrieve the token from localStorage

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/testimonials/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      const updatedTestimonialOptions = testimonialOptions.filter(
        (testimonial) => testimonial.id !== id
      );
      setTestimonialOptions(updatedTestimonialOptions);
      handleShowSuccessToast("Testimonial added successfully!", "success"); // Success log
      handleShowDeleteToast(
        `Testimonial with ID ${id} deleted successfully.`,
        "success"
      ); // Success log
    } catch (err) {
      setError("Failed to delete testimonial.");
    }
  };

  return (
    <div className="h-screen overflow-y-auto ">
      {/* Testimonial Section */}
      <div className="h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Testimonial</h2>
        <div className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Name"
            value={newTestimonial.name}
            onChange={(e) =>
              setNewTestimonial({ ...newTestimonial, name: e.target.value })
            }
            className="border rounded p-2 w-full"
          />
          <textarea
            placeholder="Message"
            value={newTestimonial.message}
            onChange={(e) =>
              setNewTestimonial({ ...newTestimonial, message: e.target.value })
            }
            className="border rounded p-2 w-full h-24"
          />
          <button
            onClick={handleAdd}
            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Add Testimonial
          </button>
        </div>
        <ul>
          {testimonialOptions.length > 0 ? (
            testimonialOptions.map((testimonial) => (
              <li
                key={testimonial.id}
                className="p-2 border-b hover:bg-gray-100"
              >
                <div className="flex justify-between">
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
                </div>
              </li>
            ))
          ) : (
            <li>No Testimonials Found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Testimonial;
