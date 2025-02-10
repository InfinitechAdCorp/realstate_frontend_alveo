"use client";
import React, { useState } from "react";
import Sidebar from "./sidebar";
import Dashboard from "./components/dashboard"; // Ensure correct import path
import Chatbot from "./components/chatbot"; // Ensure correct import path
import Location from "./components/formfiller/location"; // Ensure correct import path
import Architectural from "./components/formfiller/architecturaltheme"; // Ensure correct import path
import Status from "./components/formfiller/status"; // Ensure correct import path

const AdminLayout = () => {
  const [activeNav, setActiveNav] = useState("DASHBOARD");

  return (
    <div className="flex ">
      <Sidebar setActiveNav={setActiveNav} />
      <div id="toast-container" className="fixed top-4 right-4 z-50"></div>

      {/* Main Content */}
      <div className="flex-1  bg-gray-100 text-black">
        {activeNav === "DASHBOARD" && (
          <>
            <Dashboard />
          </>
        )}
        {activeNav === "PROPERTIES" && (
          <h1 className="text-sm ">Properties Content</h1>
        )}
        {activeNav === "CLIENT PROPERTY" && (
          <h1 className="text-sm ">Client Property Content</h1>
        )}
        {activeNav === "APPOINTMENTS" && (
          <h1 className="text-sm ">Appointments Content</h1>
        )}
        {activeNav === "TESTIMONIAL" && (
          <h1 className="text-sm ">Testimonials Content</h1>
        )}
        {activeNav === "CHATBOT" && (
          <h1 className="text-sm ">
            <Chatbot />
          </h1>
        )}
        {activeNav === "DEVELOPMENT TYPE" && (
          <h1 className="text-sm ">Development Type Form</h1>
        )}
        {activeNav === "STATUS" && (
          <h1 className="text-sm ">
            <Status />
          </h1>
        )}
        {activeNav === "ARCHITECTURAL THEME" && (
          <h1 className="text-sm ">
            <Architectural />
          </h1>
        )}
        {activeNav === "LOCATION" && (
          <h1 className="text-sm ">
            <Location />
          </h1>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
