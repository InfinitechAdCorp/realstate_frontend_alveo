"use client";
import React, { useState } from "react";
import {
  handleShowSuccessToast,
  handleShowErrorToast,
  handleShowWarningToast,
} from "./toastalert";

const Sidebar = ({ setActiveNav }) => {
  const [showFormFiller, setShowFormFiller] = useState(false);

  return (
    <div className="w-63 h-screen bg-gray-800 text-white p-4 font-thin">
      <h2 className="text-2xl  mb-6">Admin Panel</h2>

      {/* Main Navigation */}
      <ul>
        <li
          className="mb-4 flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin"
          onClick={() => setActiveNav("DASHBOARD")}
        >
          <img
            src="/assets/dashboard.png"
            alt="Dashboard"
            className="w-5 h-5 mr-2"
          />
          DASHBOARD
        </li>
        <li
          className="mb-4 flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin"
          onClick={() => setActiveNav("PROPERTIES")}
        >
          <img
            src="/assets/house.png"
            alt="Properties"
            className="w-5 h-5 mr-2"
          />
          PROPERTIES
        </li>
        <li
          className="mb-4 flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin"
          onClick={() => setActiveNav("CLIENT PROPERTY")}
        >
          <img
            src="/assets/customers.png"
            alt="Client Property"
            className="w-5 h-5 mr-2"
          />
          CLIENT PROPERTY
        </li>
        <li
          className="mb-4 flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin"
          onClick={() => setActiveNav("APPOINTMENTS")}
        >
          <img
            src="/assets/appointment.png"
            alt="Appointments"
            className="w-5 h-5 mr-2"
          />
          APPOINTMENTS
        </li>
        <li
          className="mb-4 flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin"
          onClick={() => setActiveNav("TESTIMONIAL")}
        >
          <img
            src="/assets/review.png"
            alt="Testimonials"
            className="w-5 h-5 mr-2"
          />
          TESTIMONIALS
        </li>

        {/* Form Filler */}
        <li
          className="mb-4 flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin"
          onClick={() => setShowFormFiller(!showFormFiller)}
        >
          <img
            src="/assets/form.png"
            alt="Form Filler"
            className="w-5 h-5 mr-2"
          />
          FORM FILLER
        </li>

        {/* Form Filler Submenu */}
        {showFormFiller && (
          <ul className="pl-6">
            <li
              className="mb-2 flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin"
              onClick={() => setActiveNav("DEVELOPMENT TYPE")}
            >
              <img
                src="/assets/turn-right.png"
                alt="Development Type"
                className="w-4 h-4 mr-2"
              />
              DEVELOPMENT TYPE
            </li>
            <li
              className="mb-2 flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin"
              onClick={() => setActiveNav("STATUS")}
            >
              <img
                src="/assets/turn-right.png"
                alt="Status"
                className="w-4 h-4 mr-2"
              />
              STATUS
            </li>
            <li
              className="mb-2 flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin"
              onClick={() => setActiveNav("ARCHITECTURAL THEME")}
            >
              <img
                src="/assets/turn-right.png"
                alt="Architectural Theme"
                className="w-4 h-4 mr-2"
              />
              ARCHITECTURAL THEME
            </li>
            <li
              className="mb-2 flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin"
              onClick={() => setActiveNav("LOCATION")}
            >
              <img
                src="/assets/turn-right.png"
                alt="Location"
                className="w-4 h-4 mr-2"
              />
              LOCATION
            </li>
          </ul>
        )}

        {/* Chatbot */}
        <li
          className="mb-4 flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin"
          onClick={() => setActiveNav("CHATBOT")}
        >
          <img
            src="/assets/robotic.png"
            alt="Chatbot"
            className="w-5 h-5 mr-2"
          />
          CHATBOT
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
