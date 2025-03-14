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
import { useRouter } from "next/navigation";

const AdminLayout = () => {
  const [activeNav, setActiveNav] = useState(
    () => localStorage.getItem("activeNav") || "DASHBOARD"
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  let logoutTimeout; // Store timeout reference
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("auth_token");
    const username = localStorage.getItem("userInfo");

    if (!authToken) {
      setIsLoggedIn(false);
      router.push("/auth");
    } else {
      setIsLoggedIn(true);
      setUser(username || "Admin");
    }
  }, [router]);

  useEffect(() => {
    if (activeNav === "PROPERTIES") {
      fetchProperties();
    }
  }, [activeNav]);
  const handleNavChange = (navItem) => {
    setActiveNav(navItem);
    localStorage.setItem("activeNav", navItem);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const fetchProperties = async () => {
    setLoading(true);
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
      setProperties(data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handles mouse enter and leave for logout button
  const handleMouseEnter = () => {
    clearTimeout(logoutTimeout);
    setShowLogout(true);
  };

  const handleMouseLeave = () => {
    logoutTimeout = setTimeout(() => {
      setShowLogout(false);
    }, 300); // Adds a delay before hiding
  };

  return (
    <div className="flex h-screen overflow-hidden w-full min-w-[320px]">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={handleNavChange} // ✅ Use the new function
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col bg-gray-100 text-black min-w-[320px]">
        {/* Header Section */}
        <header className="bg-white shadow-md p-4 flex items-center justify-end w-full md:px-4 lg:px-6 relative">
          <button
            className="md:hidden text-gray-600 text-2xl"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars />
          </button>
          {/* <h1 className="text-lg font-semibold text-gray-800 truncate text-center md:text-left">
            Λ L V E O
          </h1> */}
          <div className="flex items-center space-x-3 relative">
            {/* Status Indicator */}
            <div
              className={`circle w-4 h-4 rounded-full ${
                isLoggedIn ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600 hidden sm:inline md:text-base lg:text-lg">
              Welcome, {user}
            </span>
            <div
              className="relative flex items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <FaUserCircle className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800" />
              {showLogout && (
                <div
                  className="z-10 absolute top-full mt-2 w-20 text-center right-0 bg-white shadow-lg border border-gray-300 rounded-md px-3 py-1 text-lg text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="p-4 flex-1 overflow-y-auto min-w-[320px]">
          {activeNav === "DASHBOARD" && <Dashboard />}
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
            <Feature
              properties={properties}
              loading={loading}
              fetchProperties={fetchProperties}
            />
          )}
          {activeNav === "CLIENT PROPERTY" && <ClientProperty />}
          {activeNav === "APPOINTMENTS" && <Appointment />}
          {activeNav === "TESTIMONIALS" && <Testimonial />}
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
