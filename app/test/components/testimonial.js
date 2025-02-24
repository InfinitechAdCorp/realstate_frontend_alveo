"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/alert/page";

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded state

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const token = localStorage.getItem("auth_token");
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
      if (!response.ok) throw new Error("Failed to fetch testimonials");

      const data = await response.json();
      setTestimonials(data);
    } catch (err) {
      showToast("Failed to load testimonials.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    const token = localStorage.getItem("auth_token");

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/testimonials/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTestimonials(testimonials.filter((t) => t.id !== id));
      showToast("Testimonial deleted successfully.", "success");
    } catch (err) {
      showToast("Failed to delete testimonial.", "error");
    }
  };

  // Function to toggle message expansion
  const toggleMessageExpansion = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Message",
      selector: (row) => row.message,
      sortable: true,
      wrap: true,
      cell: (row) => (
        <div>
          {row.message.length > 100 ? (
            <>
              {expandedRows[row.id]
                ? row.message
                : row.message.substring(0, 100) + "..."}
              <button
                onClick={() => toggleMessageExpansion(row.id)}
                className="text-blue-500 ml-2"
              >
                {expandedRows[row.id] ? "See Less" : "See More"}
              </button>
            </>
          ) : (
            row.message
          )}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleDeleteTestimonial(row.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // Filter testimonials based on search query
  const filteredTestimonials = testimonials.filter((testimonial) =>
    testimonial.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="max-h-full overflow-y-auto bg-white shadow-md p-3 rounded-md">
        {/* Header & Search Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-3">
          <div className="w-full md:w-auto">
            <h2 className="text-lg mb-2">Testimonials</h2>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border rounded-md text-sm"
            />
          </div>

          {/* Add Testimonial Button */}
          <button
            onClick={() => {
              setNewTestimonial({ name: "", message: "" });
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500"
          >
            Add Testimonial
          </button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={filteredTestimonials}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15]}
          highlightOnHover
          responsive
          striped
        />
      </div>

      {/* Modal for Adding Testimonial */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[350px]">
            <h2 className="text-lg mb-3">Add Testimonial</h2>
            <div className="space-y-3">
              {/* Name Input */}
              <input
                type="text"
                name="name"
                value={newTestimonial.name}
                onChange={(e) =>
                  setNewTestimonial({ ...newTestimonial, name: e.target.value })
                }
                placeholder="Enter name"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {/* Message Input */}
              <textarea
                name="message"
                value={newTestimonial.message}
                onChange={(e) =>
                  setNewTestimonial({
                    ...newTestimonial,
                    message: e.target.value,
                  })
                }
                placeholder="Enter message"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (
                    !newTestimonial.name.trim() ||
                    !newTestimonial.message.trim()
                  )
                    return;
                  setTestimonials([
                    ...testimonials,
                    { ...newTestimonial, id: Date.now() },
                  ]);
                  setNewTestimonial({ name: "", message: "" });
                  setIsModalOpen(false);
                  showToast("Testimonial added successfully!", "success");
                }}
                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonial;
