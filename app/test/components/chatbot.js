"use client";
import React, { useState, useEffect } from "react";
import { handleShowSuccessToast, handleShowErrorToast } from "./../toastalert";

const Chatbot = () => {
  const [chatbotEntries, setChatbotEntries] = useState([]);
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);
  const [chatbotFormData, setChatbotFormData] = useState({
    question: "",
    answer: "",
  });

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
      console.error("Error fetching chatbot data:", error);
      handleShowErrorToast("Failed to fetch chatbot data.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChatbotFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    const Token = localStorage.getItem("auth_token");
    const { question, answer } = chatbotFormData;
    if (!question || !answer) return;

    const formData = new FormData();
    formData.append("question", question);
    formData.append("answer", answer);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/addChatbot`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        handleShowSuccessToast("Chatbot entry added successfully!");
        const addedItem = { ...chatbotFormData, id: data.data.id };
        setChatbotEntries((prevEntries) => [...prevEntries, addedItem]);
        setChatbotFormData({ question: "", answer: "" });
        setIsChatbotModalOpen(false);
      } else {
        console.error("Error response from API:", data.message);
        handleShowErrorToast("Failed to add chatbot entry.");
      }
    } catch (error) {
      console.error("Error adding data:", error);
      handleShowErrorToast("Error occurred while saving chatbot entry.");
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
      console.error("Error deleting entry:", error);
      handleShowErrorToast("Error occurred while deleting chatbot entry.");
    }
  };

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="max-h-full overflow-y-auto bg-white shadow-md p-3 rounded-md">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg ">Chatbot Entries</h2>
          <button
            onClick={() => {
              setChatbotFormData({ question: "", answer: "" });
              setIsChatbotModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-500"
          >
            Add Q&A Chatbot
          </button>
        </div>
        <ul className="overflow-y-auto">
          {chatbotEntries.length > 0 ? (
            chatbotEntries.map((item) => (
              <li
                key={item.id}
                className="flex justify-between p-2 border-b text-sm hover:bg-gray-100"
              >
                <div>
                  <h5 className="">{item.question}</h5>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">No Entries Found</li>
          )}
        </ul>
      </div>

      {/* Modal for Adding Chatbot Entry */}
      {isChatbotModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[350px]">
            <h2 className="text-lg  mb-3">Add Chatbot Entry</h2>
            <div className="space-y-3">
              {/* Question Input */}
              <input
                type="text"
                name="question"
                value={chatbotFormData.question}
                onChange={handleInputChange}
                placeholder="Enter question"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {/* Answer Input */}
              <input
                type="text"
                name="answer"
                value={chatbotFormData.answer}
                onChange={handleInputChange}
                placeholder="Enter answer"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsChatbotModalOpen(false)}
                className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
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

export default Chatbot;
