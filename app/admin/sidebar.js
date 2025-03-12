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
} from "react-icons/fa";

const Sidebar = ({
  setActiveNav,
  activeNav,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [showFormFiller, setShowFormFiller] = useState(false);
  const [showProperties, setShowProperties] = useState(false);

  console.log("🔹 Current Active Nav:", activeNav); // ✅ Logs on every render

  return (
    <div
      className={`fixed md:relative top-0 left-0 h-screen bg-gray-900 text-white p-5 font-thin shadow-lg transition-transform transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:w-64 z-50`}
    >
      {/* Logo - Increased Margin Top */}
      <div className="p-0 mt-6 mb-12 flex justify-center">
        <img src="/logo.png" className="w-36" alt="Logo" />
      </div>

      <button
        className="md:hidden absolute top-4 right-4 text-white"
        onClick={() => setIsSidebarOpen(false)}
      >
        ✕
      </button>

      {/* Menu Items */}
      <ul className="space-y-2">
        <SidebarItem
          icon={<FaTachometerAlt />}
          label="DASHBOARD"
          active={activeNav === "DASHBOARD"}
          onClick={() => setActiveNav("DASHBOARD")}
        />

        {/* Properties Section */}
        <SidebarDropdown
          icon={<FaBuilding />}
          label="PROPERTIES"
          active={
            activeNav === "PROPERTIES" || // ✅ When directly clicked
            ["OTHER BUILDING", "FEATURES", "FACILITIES"].includes(activeNav) // ✅ When a sub-item is active
          }
          showDropdown={showProperties}
          toggleDropdown={() => {
            setActiveNav("PROPERTIES"); // ✅ Set as active when toggled
            setShowProperties(!showProperties);
          }}
        >
          <SidebarItem
            icon={<FaBuilding />}
            label="OTHER BUILDING"
            active={activeNav === "OTHER BUILDING"}
            onClick={() => setActiveNav("OTHER BUILDING")}
          />
          <SidebarItem
            icon={<FaLayerGroup />}
            label="FEATURES"
            active={activeNav === "FEATURES"}
            onClick={() => setActiveNav("FEATURES")}
          />
          <SidebarItem
            icon={<FaMapMarkerAlt />}
            label="FACILITIES"
            active={activeNav === "FACILITIES"}
            onClick={() => setActiveNav("FACILITIES")}
          />
        </SidebarDropdown>

        <SidebarItem
          icon={<FaUsers />}
          label="CLIENT PROPERTY"
          active={activeNav === "CLIENT PROPERTY"}
          onClick={() => setActiveNav("CLIENT PROPERTY")}
        />
        <SidebarItem
          icon={<FaCalendarAlt />}
          label="APPOINTMENTS"
          active={activeNav === "APPOINTMENTS"}
          onClick={() => setActiveNav("APPOINTMENTS")}
        />
        <SidebarItem
          icon={<FaCommentDots />}
          label="TESTIMONIALS"
          active={activeNav === "TESTIMONIALS"}
          onClick={() => setActiveNav("TESTIMONIALS")}
        />

        {/* Form Filler Section */}
        <SidebarDropdown
          icon={<FaWpforms />}
          label="FORM FILLER"
          active={
            activeNav === "FORM FILLER" ||
            [
              "DEVELOPMENT TYPE",
              "STATUS",
              "ARCHITECTURAL THEME",
              "LOCATION",
            ].includes(activeNav)
          }
          showDropdown={showFormFiller}
          toggleDropdown={() => setShowFormFiller(!showFormFiller)}
        >
          <SidebarItem
            icon={<FaLayerGroup />}
            label="DEVELOPMENT TYPE"
            active={activeNav === "DEVELOPMENT TYPE"}
            onClick={() => setActiveNav("DEVELOPMENT TYPE")}
          />
          <SidebarItem
            icon={<FaCodeBranch />}
            label="STATUS"
            active={activeNav === "STATUS"}
            onClick={() => setActiveNav("STATUS")}
          />
          <SidebarItem
            icon={<FaPalette />}
            label="ARCHITECTURAL THEME"
            active={activeNav === "ARCHITECTURAL THEME"}
            onClick={() => setActiveNav("ARCHITECTURAL THEME")}
          />
          <SidebarItem
            icon={<FaMapMarkerAlt />}
            label="LOCATION"
            active={activeNav === "LOCATION"}
            onClick={() => setActiveNav("LOCATION")}
          />
        </SidebarDropdown>

        <SidebarItem
          icon={<FaRobot />}
          label="CHATBOT"
          active={activeNav === "CHATBOT"}
          onClick={() => setActiveNav("CHATBOT")}
        />
      </ul>
    </div>
  );
};

/* ✅ Sidebar Item Component */
const SidebarItem = ({ icon, label, active, onClick }) => (
  <li
    className={`flex items-center cursor-pointer text-sm font-thin transition px-3 py-2 rounded-md ${
      active
        ? "bg-blue-500 text-white border-l-4 border-blue-400"
        : "hover:text-blue-400"
    }`}
    onClick={onClick}
  >
    <span className="w-5 h-5 mr-3">{icon}</span>
    {label}
  </li>
);

/* ✅ Sidebar Dropdown Component */
const SidebarDropdown = ({
  icon,
  label,
  active,
  showDropdown,
  toggleDropdown,
  children,
}) => (
  <>
    <li
      className={`flex items-center justify-between cursor-pointer text-sm font-thin transition px-3 py-2 rounded-md ${
        active
          ? "bg-blue-500 text-white border-l-4 border-blue-400"
          : "hover:text-blue-400"
      }`}
      onClick={toggleDropdown}
    >
      <div className="flex items-center">
        <span className="w-5 h-5 mr-3">{icon}</span>
        {label}
      </div>
      {showDropdown ? (
        <FaChevronUp className="text-xs ml-2" />
      ) : (
        <FaChevronDown className="text-xs ml-2" />
      )}
    </li>
    {showDropdown && (
      <ul className="pl-4 bg-gray-800 text-gray-300 rounded-lg p-2 space-y-1">
        {children}
      </ul>
    )}
  </>
);

export default Sidebar;
