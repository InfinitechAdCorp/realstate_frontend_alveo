"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { showToast } from "@/components/alert/page";

const Testimonial = () => {
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    message: "",
  });
  const [testimonialOptions, setTestimonialOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

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
        setIsModalOpen(false);
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

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      style: {
        width: "200px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    {
      name: "Message",
      selector: (row) => row.message,
      sortable: true,
      style: {
        width: "350px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      ),
      style: {
        width: "120px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const filteredTestimonials = testimonialOptions
    .filter((testimonial) =>
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * perPage, currentPage * perPage);
  return (
    <div className="h-screen p-4 w-full mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-3 md:space-y-0">
        <h2 className="text-xl font-semibold text-center md:text-left">
          Testimonial
        </h2>

        <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 w-full md:w-auto"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full md:w-auto"
          >
            Add Testimonial
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredTestimonials}
          pagination
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[5, 10, 15]}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          progressPending={loading}
          className="w-full"
          noDataComponent="No Testimonials Found"
          style={{ tableLayout: "fixed" }}
        />
      </div>
    </div>
  );
};

export default Testimonial;
