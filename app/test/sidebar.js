"use client";
import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaBuilding,
  FaUsers,
  FaCalendarAlt,
  FaCommentDots,
  FaWpforms,
  FaChevronDown,
  FaChevronUp,
  FaCodeBranch,
  FaMapMarkerAlt,
  FaPalette,
  FaLayerGroup,
  FaRobot,
  FaBars,
  FaUserCircle,
} from "react-icons/fa";

const Sidebar = ({ setActiveNav, isSidebarOpen, setIsSidebarOpen }) => {
  const [showFormFiller, setShowFormFiller] = useState(false);
  const [showProperties, setShowProperties] = useState(false);

  return (
    <div
      className={`fixed md:relative top-0 left-0 h-screen bg-gray-900 text-white p-5 font-thin shadow-lg transition-transform transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:w-64 z-50`}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Admin Panel</h2>
      <button
        className="md:hidden absolute top-4 right-4 text-white"
        onClick={() => setIsSidebarOpen(false)}
      >
        ✕
      </button>
      <ul className="space-y-3">
        <li
          className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
          onClick={() => setActiveNav("DASHBOARD")}
        >
          <FaTachometerAlt className="w-5 h-5 mr-3" /> DASHBOARD
        </li>

        {/* Properties Section */}
        <li
          className="flex items-center justify-between cursor-pointer hover:text-blue-400 text-sm font-thin transition"
          onClick={() => {
            setShowProperties(!showProperties);
            setActiveNav("PROPERTIES"); // Set activeNav to "PROPERTIES"
          }}
        >
          <div className="flex items-center">
            <FaBuilding className="w-5 h-5 mr-3" /> PROPERTIES
          </div>
          {showProperties ? (
            <FaChevronUp className="text-xs ml-2" />
          ) : (
            <FaChevronDown className="text-xs ml-2" />
          )}
        </li>

        {showProperties && (
          <ul className="pl-4 bg-gray-800 text-gray-300 rounded-lg p-2 space-y-2">
            <li
              className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
              onClick={() => setActiveNav("OTHER BUILDING")}
            >
              <FaBuilding className="w-4 h-4 mr-2" /> OTHER BUILDING
            </li>
            <li
              className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
              onClick={() => setActiveNav("FEATURES")}
            >
              <FaLayerGroup className="w-4 h-4 mr-2" /> FEATURES
            </li>
            <li
              className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
              onClick={() => setActiveNav("FACILITIES")}
            >
              <FaMapMarkerAlt className="w-4 h-4 mr-2" /> FACILITIES
            </li>
          </ul>
        )}

        <li
          className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
          onClick={() => setActiveNav("CLIENT PROPERTY")}
        >
          <FaUsers className="w-5 h-5 mr-3" /> CLIENT PROPERTY
        </li>
        <li
          className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
          onClick={() => setActiveNav("APPOINTMENTS")}
        >
          <FaCalendarAlt className="w-5 h-5 mr-3" /> APPOINTMENTS
        </li>
        <li
          className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
          onClick={() => setActiveNav("TESTIMONIAL")}
        >
          <FaCommentDots className="w-5 h-5 mr-3" /> TESTIMONIALS
        </li>

        {/* Form Filler Section */}
        <li
          className="flex items-center justify-between cursor-pointer hover:text-blue-400 text-sm font-thin transition"
          onClick={() => setShowFormFiller(!showFormFiller)}
        >
          <div className="flex items-center">
            <FaWpforms className="w-5 h-5 mr-3" /> FORM FILLER
          </div>
          {showFormFiller ? (
            <FaChevronUp className="text-xs ml-2" />
          ) : (
            <FaChevronDown className="text-xs ml-2" />
          )}
        </li>

        {showFormFiller && (
          <ul className="pl-4 bg-gray-800 text-gray-300 rounded-lg p-2 space-y-2">
            <li
              className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
              onClick={() => setActiveNav("DEVELOPMENT TYPE")}
            >
              <FaLayerGroup className="w-4 h-4 mr-2" /> DEVELOPMENT TYPE
            </li>
            <li
              className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
              onClick={() => setActiveNav("STATUS")}
            >
              <FaCodeBranch className="w-4 h-4 mr-2" /> STATUS
            </li>
            <li
              className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
              onClick={() => setActiveNav("ARCHITECTURAL THEME")}
            >
              <FaPalette className="w-4 h-4 mr-2" /> ARCHITECTURAL THEME
            </li>
            <li
              className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
              onClick={() => setActiveNav("LOCATION")}
            >
              <FaMapMarkerAlt className="w-4 h-4 mr-2" /> LOCATION
            </li>
          </ul>
        )}

        <li
          className="flex items-center cursor-pointer hover:text-blue-400 text-sm font-thin transition"
          onClick={() => setActiveNav("CHATBOT")}
        >
          <FaRobot className="w-5 h-5 mr-3" /> CHATBOT
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
