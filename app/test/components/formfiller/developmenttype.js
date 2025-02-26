"use client";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { showToast } from "@/components/alert/page";

const DevelopmentType = () => {
  const [developmentTypes, setDevelopmentTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevelopmentTypes();
  }, []);

  const fetchDevelopmentTypes = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/development-types`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch development types");

      const data = await response.json();
      setDevelopmentTypes(data);
    } catch (err) {
      showToast("Failed to load development types.", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleAddDevelopmentType = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-development-type`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: values.newType }),
        }
      );

      if (!response.ok) throw new Error("Failed to add development type");

      await fetchDevelopmentTypes(); // ✅ Fetch updated data
      showToast("Development type added successfully!", "success");

      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      showToast("Failed to add development type.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDevelopmentType = async (id) => {
    const token = localStorage.getItem("auth_token");

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/delete-development-type/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDevelopmentTypes(developmentTypes.filter((type) => type.id !== id));
      showToast("Development type deleted successfully.", "success");
    } catch (err) {
      showToast("Failed to delete development type.", "error");
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleDeleteDevelopmentType(row.id)}
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

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="max-h-full overflow-y-auto bg-white shadow-md p-3 rounded-md">
        {/* Header & Add Button */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg">Development Types</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-500"
          >
            Add Development Type
          </button>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={developmentTypes}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15]}
          highlightOnHover
          responsive
          striped
        />
      </div>

      {/* Modal for Adding Development Type */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg mb-4">Add Development Type</h2>
            <Formik
              initialValues={{ newType: "" }}
              validationSchema={Yup.object({
                newType: Yup.string().required("Type name is required"),
              })}
              onSubmit={handleAddDevelopmentType}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-3">
                  <Field
                    type="text"
                    name="newType"
                    placeholder="New Type Name"
                    className="border rounded p-2 w-full"
                  />
                  <ErrorMessage
                    name="newType"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    >
                      {isSubmitting ? "Adding..." : "Add"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevelopmentType;
