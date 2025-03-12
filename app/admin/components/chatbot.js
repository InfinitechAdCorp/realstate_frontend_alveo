"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { handleShowSuccessToast, handleShowErrorToast } from "./../toastalert";

const Chatbot = () => {
  const [chatbotEntries, setChatbotEntries] = useState([]);
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);
  const [chatbotFormData, setChatbotFormData] = useState({
    question: "",
    answer: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // New state for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  useEffect(() => {
    fetchChatbotData();
  }, []);

  const fetchChatbotData = async () => {
    try {
      const Token = localStorage.getItem("auth_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/getChatbot`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const chatbotData = await response.json();
      setChatbotEntries(chatbotData);
    } catch (error) {
      handleShowErrorToast("Failed to fetch chatbot data.");
    }
  };

  const handleDelete = async () => {
    if (!entryToDelete) return;

    const Token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/deleteChatbot/${entryToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        handleShowSuccessToast("Chatbot entry deleted successfully!");
        setChatbotEntries((prevEntries) =>
          prevEntries.filter((item) => item.id !== entryToDelete.id)
        );
      } else {
        handleShowErrorToast("Failed to delete chatbot entry.");
      }
    } catch (error) {
      handleShowErrorToast("Error occurred while deleting chatbot entry.");
    } finally {
      setIsDeleteModalOpen(false); // Close the modal after deletion attempt
      setEntryToDelete(null); // Reset the entry to be deleted
    }
  };

  const handleAddChatbotEntry = async () => {
    if (!chatbotFormData.question || !chatbotFormData.answer) {
      handleShowErrorToast("Both question and answer are required!");
      return;
    }

    const Token = localStorage.getItem("auth_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/addChatbot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(chatbotFormData),
        }
      );

      const data = await response.json();

      if (data.success) {
        handleShowSuccessToast("Chatbot entry added successfully!");
        setChatbotEntries([...chatbotEntries, data.data]);
        setChatbotFormData({ question: "", answer: "" });
        setIsChatbotModalOpen(false);
      } else {
        handleShowErrorToast("Failed to add chatbot entry.");
      }
    } catch (error) {
      handleShowErrorToast("Error occurred while adding chatbot entry.");
    }
  };

  const filteredChatbotEntries = chatbotEntries.filter((entry) =>
    entry.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      name: "Question",
      selector: (row) => row.question,
      sortable: true,
      wrap: true,
    },
    {
      name: "Answer",
      selector: (row) => row.answer,
      sortable: true,
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => {
            setEntryToDelete(row); // Set the entry to be deleted
            setIsDeleteModalOpen(true); // Open the delete confirmation modal
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
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
    <div className="h-full overflow-y-auto mt-6 p-4 font-thin max-w-full mx-auto">
      <div className="max-h-full overflow-y-auto bg-white shadow-md p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="text-lg font-semibold">Chatbot Entries</h2>
            <input
              type="text"
              placeholder="Search by question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <button
            onClick={() => {
              setChatbotFormData({ question: "", answer: "" });
              setIsChatbotModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-500 w-full sm:w-auto"
          >
            Add Q&A Chatbot
          </button>
        </div>
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={filteredChatbotEntries}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 15]}
            highlightOnHover
            responsive
            striped
          />
        </div>
      </div>

      {/* Add Chatbot Modal */}
      {isChatbotModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg mb-3 text-center">Add Chatbot Entry</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="question"
                value={chatbotFormData.question}
                onChange={(e) =>
                  setChatbotFormData({
                    ...chatbotFormData,
                    question: e.target.value,
                  })
                }
                placeholder="Enter question"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="answer"
                value={chatbotFormData.answer}
                onChange={(e) =>
                  setChatbotFormData({
                    ...chatbotFormData,
                    answer: e.target.value,
                  })
                }
                placeholder="Enter answer"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={handleAddChatbotEntry}
                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full sm:w-auto"
              >
                Add
              </button>
              <button
                onClick={() => setIsChatbotModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded text-sm hover:bg-gray-500 w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && entryToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Delete Confirmation
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Are you sure you want to delete the following Q&A?
            </p>
            <p className="text-md font-medium text-gray-700 mb-6 text-center">
              <span className="block mb-2">Q: {entryToDelete.question}</span>
              <span className="block">A: {entryToDelete.answer}</span>
            </p>

            <div className="flex justify-center gap-6">
              <button
                onClick={handleDelete}
                className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200"
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

export default Chatbot;
