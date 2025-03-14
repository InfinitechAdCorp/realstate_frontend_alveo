"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { showToast } from "@/components/alert/page";

const DevelopmentType = () => {
  const [developmentTypes, setDevelopmentTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // ✅ Edit modal state
  const [editEntry, setEditEntry] = useState(null); // ✅ Store the entry to edit
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
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

      await fetchDevelopmentTypes();
      showToast("Development type added successfully!", "success");

      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      showToast("Failed to add development type.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateDevelopmentType = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    if (!editEntry) return;

    const token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/updateDevelopment/${editEntry.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: values.updatedType }),
        }
      );

      if (!response.ok) throw new Error("Failed to update development type");

      await fetchDevelopmentTypes();
      showToast("Development type updated successfully!", "success");

      resetForm();
      setIsEditModalOpen(false);
      setEditEntry(null);
    } catch (err) {
      showToast("Failed to update development type.", "error");
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
      setIsDeleteModalOpen(false);
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
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditEntry(row);
              setIsEditModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setEntryToDelete(row);
              setIsDeleteModalOpen(true);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "15%",
    },
  ];

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="max-h-full overflow-y-auto bg-white shadow-md p-3 rounded-md">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold">Development Types</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500 w-full sm:w-auto"
          >
            Add Development Type
          </button>
        </div>

        <div className="p-2">
          <DataTable
            columns={columns}
            data={developmentTypes}
            pagination
            highlightOnHover
            responsive
            striped
          />
        </div>
      </div>
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

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
                    >
                      {isSubmitting ? "Adding..." : "Add"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
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
      {isEditModalOpen && editEntry && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-md max-w-[400px]">
            <h2 className="text-lg mb-4">Edit Development Type</h2>
            <Formik
              initialValues={{ updatedType: editEntry.name }}
              validationSchema={Yup.object({
                updatedType: Yup.string().required("Type name is required"),
              })}
              onSubmit={handleUpdateDevelopmentType}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-3">
                  <Field
                    type="text"
                    name="updatedType"
                    className="border rounded p-2 w-full"
                  />
                  <ErrorMessage
                    name="updatedType"
                    component="div"
                    className="text-red-500 text-sm"
                  />

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
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
    </div>
  );
};

export default DevelopmentType;
