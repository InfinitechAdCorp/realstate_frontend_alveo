// components/Header.js
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DevelopmentTypeModal from "@/components/admin/developmentTypeModal";
import ArchitecturalThemeModal from "@/components/admin/architecturalThemeModal";
import StatusModal from "@/components/admin/statusModal";

import { Input } from "@/components/ui/input";
import Demo from "../../properties/page";
import Header from "../header";

import AreaModal from "@/components/admin/areaModal";
import SubmittedProperties from "@/components/admin/submittedProperties";

export default function Admin({}) {
  const [isVisible, setIsVisible] = useState(true); // Controls visibility of popup
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
  });
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [properties, setProperties] = useState([]); // State to store fetched data from API
  const [counts, setCounts] = useState({
    properties: 0,
    otherBuildings: 0,
    condominiums: 0,
    locations: 0,
  });
  const [isSidebarVisible, setSidebarVisible] = useState(false); // State for controlling sidebar visibility
  const [isDevelopmentTypeModalOpen, setDevelopmentTypeModalOpen] =
    useState(false);
  const [isArchitecturalThemeModalOpen, setArchitecturalThemeModalOpen] =
    useState(false);
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [isAreaModalOpen, setAreaModalOpen] = useState(false);

  // Functions to open the respective modals
  const openDevelopmentTypeModal = () => setDevelopmentTypeModalOpen(true);
  const openArchitecturalThemeModal = () =>
    setArchitecturalThemeModalOpen(true);
  const openStatusModal = () => setStatusModalOpen(true);
  const openAreaModal = () => setAreaModalOpen(true);

  const closePopup = () => {
    setIsVisible(false);
  };

  const openSidebar = () => {
    setSidebarVisible(true);
  };

  // Function to close the sidebar
  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  // Functions to close the respective modals
  const closeModal = () => {
    setDevelopmentTypeModalOpen(false);
    setArchitecturalThemeModalOpen(false);
    setStatusModalOpen(false);
    setAreaModalOpen(false);
  };

  return (
    <>
      <div className=" w-full">
        <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
          <div className="flex justify-between items-center p-4">
            <div class="menu-container">
              <img
                src="/assets/menu.png"
                alt="Menu"
                class="cursor-pointer transform rotate-180 hover:opacity-80 w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                style={{ width: "25px", height: "25px" }}
                onClick={openSidebar}
              />
            </div>
            <div className="logosec">
              <a href="/">
                <div className="logo cursor-pointer text-darkblue font-semibold text-lg">
                  ALVEO LAND
                </div>
              </a>
            </div>

            <div className="message flex items-center space-x-4">
              <div className="circle w-4 h-4 rounded-full bg-red-500"></div>
              <img
                src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/8.png"
                className="icn"
                alt="message-icon"
                width={20}
                height={20}
              />
              <div className="dp">
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png"
                  className="dpicn rounded-full"
                  alt="profile"
                  width={40}
                  height={40}
                />
              </div>
            </div>
          </div>
        </header>
        {isSidebarVisible && (
          <div
            className="fixed top-0 left-0 h-full w-64 bg-blue-950 text-white transition-transform transform z-50 sm:w-72 overflow-y-auto lg:w-2/5 xl:w-2/12 2xl:w-2/12"
            tabIndex="-1"
            onClick={closeSidebar}
            onKeyDown={(e) => e.key === "Escape" && closeSidebar()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700 ">
              <a
                href="/pages/aboutalveo/aboutalveo"
                className="text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg"
              >
                ALVEO
              </a>
              <span
                className="text-xl font-bold cursor-pointer"
                onClick={closeSidebar}
              >
                &times;
              </span>
            </div>

            <nav className="p-4 cursor-pointer">
              <ul className="space-y-2" onClick={openDevelopmentTypeModal}>
                <li>Development Type</li>
              </ul>
              <ul className="space-y-2" onClick={openArchitecturalThemeModal}>
                <li>Architectural Theme</li>
              </ul>
              <ul className="space-y-2" onClick={openStatusModal}>
                <li>Status</li>
              </ul>
              <ul className="space-y-2" onClick={openAreaModal}>
                <li>Location</li>
              </ul>

              <a
                href="/appointment"
                className="text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg"
              >
                APPOINTMENTS
              </a>
              <a
                href="/pages/submitted-properties"
                className="text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg"
              >
                SUBMITTED PROPERTIES
              </a>
            </nav>
          </div>
        )}

        {/* Demo Section */}
        <div className="min-h-screen py-20 mt-14 w-[90%] mx-auto overflow-y-auto scrollbar-hidden flex justify-center">
          <div>
            <SubmittedProperties />
          </div>
        </div>

        <div>
          <DevelopmentTypeModal
            isOpen={isDevelopmentTypeModalOpen}
            closeModal={closeModal}
          />
          <ArchitecturalThemeModal
            isOpen={isArchitecturalThemeModalOpen}
            closeModal={closeModal}
          />
          <StatusModal isOpen={isStatusModalOpen} closeModal={closeModal} />
          <AreaModal isOpen={isAreaModalOpen} closeModal={closeModal} />
        </div>
      </div>
    </>
  );
}
