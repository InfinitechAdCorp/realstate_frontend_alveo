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

  const handleDelete = async (id) => {
    const Token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/deleteChatbot/${id}`,
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
          prevEntries.filter((item) => item.id !== id)
        );
      } else {
        handleShowErrorToast("Failed to delete chatbot entry.");
      }
    } catch (error) {
      handleShowErrorToast("Error occurred while deleting chatbot entry.");
    }
  };

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
          onClick={() => handleDelete(row.id)}
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
  const handleAddChatbotEntry = async () => {
    if (!chatbotFormData.question || !chatbotFormData.answer) {
      handleShowErrorToast("Both question and answer are required!");
      return;
    }

    const Token = localStorage.getItem("auth_token"); // Retrieve auth token

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
        setChatbotEntries([...chatbotEntries, data.data]); // Add new entry to the table
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
                onClick={() => setIsChatbotModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded text-sm hover:bg-gray-500 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChatbotEntry}
                className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600 w-full sm:w-auto"
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

export default Chatbot;
