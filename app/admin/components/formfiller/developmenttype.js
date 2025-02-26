"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { showToast } from "@/components/alert/page";

const DevelopmentType = () => {
  const [developmentTypes, setDevelopmentTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [entryToDelete, setEntryToDelete] = useState(null); // State to store the entry to delete
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
      setIsDeleteModalOpen(false); // Close the delete modal
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
          onClick={() => {
            setEntryToDelete(row); // Set the entry to delete
            setIsDeleteModalOpen(true); // Open delete confirmation modal
          }}
          className="text-red-500 hover:text-red-700 text-sm"
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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold">Development Types</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500 w-full sm:w-auto"
          >
            Add Development Type
          </button>
        </div>

        {/* Data Table */}
        <div className="p-2">
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
      </div>

      {/* Modal for Adding Development Type */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-md max-w-[400px]">
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

                  <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full sm:w-auto"
                    >
                      {isSubmitting ? "Adding..." : "Add"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && entryToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Delete Confirmation
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Are you sure you want to delete the following development type?
            </p>
            <p className="text-sm text-gray-600 mb-2 text-center">
              Name: {entryToDelete.name}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDeleteDevelopmentType(entryToDelete.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md w-full sm:w-auto"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md w-full sm:w-auto"
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

export default DevelopmentType;
