"use client"; // Add this line at the top
import { useRouter } from "next/router"; // Import useRouter for navigation
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image"; // Assuming you're using Next.js's Image component

import { throttle } from "lodash";
import { useSession, signIn, signOut } from "next-auth/react";
/** 
const services = [
    { title: "CommTalk", slug: "commtalk" },
    { title: "Contact Us", slug: "contactus" },
    { title: "Join Team Alveo", slug: "jointeamalveo" },
];
 * 
*/

const properties = [
  { title: "Condominiums", slug: "condominiums" },
  { title: "Lots", slug: "residential" },
  { title: "Commercials", slug: "commercial" },
  { title: "Offices", slug: "office" },
];
<ul>
  {properties.map((item, index) => (
    <li key={index}>
      <a href={`/pages/explore?specificLocation=${item.slug}`}>{item.title}</a>
    </li>
  ))}
</ul>;
/**
  const guide = [
        { title: "Terms and Conditions", slug: "terms" },
        { title: "Privacy Policy", slug: "privacy" }
    ];

 */

const Header = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false); // State for controlling sidebar visibility
  const sidebarRef = useRef(null); // Create a ref for the sidebar
  const [isExplorePage, setIsExplorePage] = useState(false);
  const [areas, setArea] = useState([]);
  const [viewportSize, setViewportSize] = useState("");

  const handleViewportClick = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setViewportSize(`Viewport size: ${width}px x ${height}px`);
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Scroll threshold, adjust as needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    // Check if the current URL path is '/pages/explore'
    if (typeof window !== "undefined") {
      setIsExplorePage(window.location.pathname === "/pages/explore");

      // Throttled scroll function to reduce re-rendering
      const handleScroll = throttle(() => {
        setScrolled(window.scrollY > 50);
      }, 100); // Adjust delay as needed

      // Add scroll listener
      window.addEventListener("scroll", handleScroll);

      return () => {
        // Clean up scroll listener
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  // Click outside detection for sidebar
  useEffect(() => {
    if (isSidebarVisible) {
      const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          closeSidebar();
        }
      };

      // Add event listener only when sidebar is visible
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        // Cleanup listener when sidebar is closed
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isSidebarVisible]);

  // Function to open the sidebar
  const openSidebar = () => {
    setSidebarVisible(true);
  };

  // Function to close the sidebar
  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  // Close the sidebar when clicking outside of it or clicking an item inside it

  // const uniqueLocations = Array.from(
  //   new Set(locations.map(loc => loc.location))
  // ).map(location => locations.find(loc => loc.location === location))
  // const style = {
  //   color: 'transparent',
  //   transform: 'rotate(-180deg)',
  //   cursor: 'pointer'
  //   // width: '100%', // Remove this line
  //   // height: 'auto', // Remove this line
  // }

  useEffect(() => {
    const fetchArea = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/admin/area");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setArea(data);
      } catch (error) {
        console.error("Error fetching", error);
      }
    };

    fetchArea();
  }, []);

  return (
    <>
      <header
        className={`${
          scrolled ? "scrolled" : ""
        } fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out`}
      >
        <div
          className={`flex items-center px-3 pt-3 h-16 w-screen relative`}
          style={{
            backgroundColor: scrolled ? "rgba(0, 43, 71, 0.8)" : "#002B47", // Adjust background color for the entire container
            boxShadow: scrolled ? "0 4px 6px rgba(0, 43, 71, 0.5)" : "none", // Shadow on scroll
            backgroundImage: scrolled
              ? "linear-gradient(180deg, rgba(0, 43, 71, 0.8), rgba(0, 43, 71, 0) 80%)"
              : "none", // Add a gradient pattern effect on scroll
            transition:
              "all 0.6s ease-in-out, background-image 0.6s ease-in-out", // Smooth transition effect
          }}
        >
          {/* Left Half with Color Change Effect */}
          <div className="w-1/2 h-full">
            <div className="flex items-center pl-5">
              <Image
                src="/assets/menus.png"
                alt="Menu"
                width={45}
                height={45}
                className="cursor-pointer transform hover:opacity-80 w-8 h-8 sm:w-5 sm:h-5 lg:w-10 lg:h-10 text-white"
                style={{
                  clipPath: "inset(0 0 40% 0)", // Hide the right half of the image
                  objectFit: "cover", // Ensure proper scaling
                }}
                onClick={openSidebar}
              />
            </div>
          </div>

          {/* Right Half Branding Section */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a
              href="/"
              className="branding-text"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h1 className="text-lg sm:text-lg lg:text-xl font-bold text-white">
                Λ L V E O
              </h1>
            </a>
          </div>

          {/* Right Section: Explore or Call */}
          <div className="ml-auto flex items-center justify-end text-sm sm:text-base lg:text-lg xl:text-xl font-medium mt-1 w-1/2 pl-10">
            {!isExplorePage ? (
              <a
                href="/pages/explore"
                className="flex items-center"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Image
                  src="/assets/search.png"
                  alt="Search"
                  width={25}
                  height={25}
                  className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 -mt-4 -mr-2"
                  style={{ transform: "rotate(90deg)", cursor: "pointer" }}
                />
                <p
                  className="ml-2 mr-5  w-full"
                  style={{
                    fontFamily: "Assistant, sans-serif",
                    fontStyle: "normal",
                    fontWeight: 500,
                    color: "rgb(254, 254, 254)",
                    fontSize: "12px",
                    lineHeight: "14px",
                  }}
                >
                  EXPLORE OUR PROPERTIES
                </p>
              </a>
            ) : (
              <div className="ml-auto flex items-center">
                <Image
                  src="/assets/call.png"
                  alt="Call"
                  width={15}
                  height={15}
                  className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 -mt-3"
                />
                <p className="ml-2 text-sm sm:text-base lg:text-lg xl:text-xl">
                  CALL (632) 88485000
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-blue-950 text-white transition-transform transform z-50 
    sm:w-72 overflow-y-auto lg:w-2/5 xl:w-2/12 2xl:w-2/12
    ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"}`}
        ref={sidebarRef}
        tabIndex="-1" // Makes the sidebar focusable
        onClick={closeSidebar}
        onKeyDown={(e) => e.key === "Escape" && closeSidebar()} // Allows closing on Escape key
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700 ">
          <a
            href="/pages/aboutalveo/aboutalveo"
            className="text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg"
          >
            ABOUT ALVEO
          </a>
          <span
            className="text-xl font-bold cursor-pointer"
            onClick={closeSidebar}
          >
            &times;
          </span>
        </div>

        <nav className="p-4">
          <a
            href="/pages/location"
            className="block text-lg mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg"
          >
            LOCATIONS
          </a>
          <ul className="space-y-2">
            {areas.map((area) => (
              <li key={area.key}>
                <a
                  className="block cursor-pointer hover:text-gray-300 no-underline text-white lg:text-xl xl:text-sm"
                  href={`/pages/locations/${area.area_name
                    .toLowerCase()
                    .replace(/\s+/g, "")}`}
                >
                  {area.area_name}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/pages/explore"
            className="block text-lg mt-6 mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg"
          >
            PROPERTIES FOR SALE
          </a>
          <ul className="space-y-2">
            {properties.map((item, index) => (
              <li key={index}>
                <a
                  href={`/pages/explore?specificLocation=${item.slug}`}
                  className="block hover:text-gray-300 no-underline text-white lg:text-xl xl:text-sm"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="/pages/set-appointment"
            className="block text-lg mt-6 mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg"
          >
            SET APPOINTMENT
          </a>
          <a
            href="/pages/submit-property"
            className="block text-lg mt-6 mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg"
          >
            SUBMIT PROPERTY
          </a>
        </nav>

        {isPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded shadow-lg text-center">
              <h3 className="text-lg font-bold mb-2">LOGIN</h3>
              <p>This is the content of the popup.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
