"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Dashboard from "./components/dashboard";
import Chatbot from "./components/chatbot";
import Location from "./components/formfiller/location";
import Architectural from "./components/formfiller/architecturaltheme";
import Status from "./components/formfiller/status";
import Testimonial from "./components/testimonial";
import DevelopmentType from "./components/formfiller/developmenttype";
import Appointment from "./components/appointment";
import ClientProperty from "./components/clientproperty";
import Property from "./components/property";
import OtherBuilding from "./components/otherBuildings";
import Facility from "./components/buildingFacility";
import Feature from "./components/buildingFeatures";
import { FaUserCircle, FaBars } from "react-icons/fa";

const AdminLayout = () => {
  const [activeNav, setActiveNav] = useState("DASHBOARD");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [properties, setProperties] = useState([]); // Store properties here
  const [loading, setLoading] = useState(false); // Manage loading state

  useEffect(() => {
    console.log(activeNav);
    if (activeNav === "PROPERTIES") {
      fetchProperties(); // Fetch properties when "PROPERTIES" is active
    }
  }, [activeNav]);

  const fetchProperties = async () => {
    setLoading(true); // Set loading to true
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/properties`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch properties");

      const data = await response.json();
      setProperties(data); // Update state with fetched properties
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  return (
    <div className="flex h-screen overflow-hidden w-full min-w-[320px]">
      <Sidebar
        setActiveNav={setActiveNav}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col bg-gray-100 text-black min-w-[320px]">
        <header className="bg-white shadow-md p-4 flex items-center justify-between w-full md:px-4 lg:px-6">
          <button
            className="md:hidden text-gray-600 text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars />
          </button>
          <h1 className="text-lg font-semibold text-gray-800 truncate text-center md:text-left">
            Λ L V E O
          </h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 hidden sm:inline md:text-base lg:text-lg">
              Welcome, Admin
            </span>
            <FaUserCircle className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800" />
          </div>
        </header>
        <div className="p-4 flex-1 overflow-y-auto min-w-[320px]">
          {activeNav === "DASHBOARD" && <Dashboard />}
          {/* Pass fetched properties to Property component */}
          {activeNav === "PROPERTIES" && (
            <Property properties={properties} loading={loading} />
          )}
          {activeNav === "OTHER BUILDING" && (
            <OtherBuilding properties={properties} loading={loading} />
          )}
          {activeNav === "FACILITIES" && (
            <Facility properties={properties} loading={loading} />
          )}
          {activeNav === "FEATURES" && (
            <Feature properties={properties} loading={loading} />
          )}
          {activeNav === "CLIENT PROPERTY" && <ClientProperty />}
          {activeNav === "APPOINTMENTS" && <Appointment />}
          {activeNav === "TESTIMONIAL" && <Testimonial />}
          {activeNav === "CHATBOT" && <Chatbot />}
          {activeNav === "DEVELOPMENT TYPE" && <DevelopmentType />}
          {activeNav === "STATUS" && <Status />}
          {activeNav === "ARCHITECTURAL THEME" && <Architectural />}
          {activeNav === "LOCATION" && <Location />}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
