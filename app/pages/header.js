"use client"; // Add this line at the top
import { useRouter } from 'next/router'; // Import useRouter for navigation
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image'; // Assuming you're using Next.js's Image component
import Link from 'next/link';
import { throttle } from 'lodash';
import { useSession, signIn, signOut } from "next-auth/react"
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
                    <Link href={`/pages/explore?specificLocation=${item.slug}`}>
                        {item.title}
                    </Link>
                </li>
            ))}
        </ul>
/**
  const guide = [
        { title: "Terms and Conditions", slug: "terms" },
        { title: "Privacy Policy", slug: "privacy" }
    ];

 */
  
const locations = [
    { location: "Caloocan City", key: "caloocancity", name: "The Calinea Tower", path: "/Location/Residences View/The Calinea Tower View.jpg", lat: 14.6502, lng: 120.9822 },
    { location: "Las Pinas", key: "laspinas", name: "Sonora Garden Residence", path: "/Location/Residences View/Sonora Garden Residences View.jpg", lat: 14.4485, lng: 120.9940 },
    { location: "Makati City", key: "makaticity", name: "Fortis Residence", path: "/Location/Residences View/Fortis Residence View.jpg", lat: 14.5547, lng: 121.0244 },
    { location: "Mandaluyong City", key: "mandaluyongcity", name: "Sage Residence", path: "/Location/Residences View/Sage Residence View.jpg", lat: 14.5794, lng: 121.0365 },
    { location: "Manila", key: "manila", name: "The Campden Place", path: "/Location/Residences View/The Campden Place View.png", lat: 14.5995, lng: 120.9842 },
    { location: "Pasay City", key: "pasaycity", name: "Anissa Heights", path: "/Location/Residences View/Anissa Heights View.jpg", lat: 14.5333, lng: 120.9893 },
    { location: "Pasig City", key: "pasigcity", name: "Allegra Garden Place", path: "/Location/Residences View/Allegra Garden Place View.png", lat: 14.5733, lng: 121.0594 },
    { location: "Pasig City", key: "pasigcity", name: "Prisma Residence", path: "/Location/Residences View/Prisma Residence View.png", lat: 14.5842, lng: 121.0609 },
    { location: "Pasig City", key: "pasigcity", name: "Satory Residence", path: "/Location/Residences View/Satori Residence View.png", lat: 14.5826, lng: 121.0664 },
    { location: "Pasig City", key: "pasigcity", name: "The Valeron Tower", path: "/Location/Residences View/The Valeron Tower View.jpg", lat: 14.5833, lng: 121.0597 },
    { location: "Paranaque City", key: "paranaquecity", name: "Oak Harbor Residence", path: "/Location/Residences View/Oak Harbor Residence View.jpg", lat: 14.5081, lng: 120.9890 },
    { location: "Paranaque City", key: "paranaquecity", name: "The Atherton", path: "/Location/Residences View/The Atherton Views.jpg", lat: 14.5083, lng: 120.9792 },
    { location: "Quezon City", key: "quezoncity", name: "One Delta Terraces", path: "/Location/Residences View/One Delta Terraces View.jpg", lat: 14.6460, lng: 121.0568 },
    { location: "Quezon City", key: "quezoncity", name: "The Crestmont", path: "/Location/Residences View/The Crestmont View.jpg", lat: 14.6474, lng: 121.0532 },
    { location: "Quezon City", key: "quezoncity", name: "The Erin Heights", path: "/Location/Residences View/The Erin Heights View.png", lat: 14.6467, lng: 121.0605 },
    { location: "Quezon City", key: "quezoncity", name: "The Oriana", path: "/Location/Residences View/The Oriana View.png", lat: 14.6418, lng: 121.0582 },
    { location: "San Juan, Batangas", key: "batangascity", name: "Solmera Coast", path: "/Location/Residences View/Solmera Coast View.jpg", lat: 13.7952, lng: 121.0640 },
    { location: "Taguig City", key: "taguigcity", name: "Mulberry Place", path: "/Location/Residences View/Malberry Place View.jpg", lat: 14.5277, lng: 121.0582 },
    { location: "Tuba, Benguet", key: "benguet", name: "Moncello Crest", path: "/Location/Residences View/Moncello Crest View.jpg", lat: 16.4225, lng: 120.3502 }
];
const Header = () => {
     const [isPopupVisible, setPopupVisible] = useState(false);
    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };
    const [scrolled, setScrolled] = useState(false);
    const [isSidebarVisible, setSidebarVisible] = useState(false); // State for controlling sidebar visibility
    const sidebarRef = useRef(null); // Create a ref for the sidebar
      const [isExplorePage, setIsExplorePage] = useState(false);

  const [viewportSize, setViewportSize] = useState('');

  const handleViewportClick = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setViewportSize(`Viewport size: ${width}px x ${height}px`);
  };
useEffect(() => {
        // Check if the current URL path is '/pages/explore'
        if (typeof window !== 'undefined') {
            setIsExplorePage(window.location.pathname === '/pages/explore');

            // Throttled scroll function to reduce re-rendering
            const handleScroll = throttle(() => {
                setScrolled(window.scrollY > 50);
            }, 100); // Adjust delay as needed

            // Add scroll listener
            window.addEventListener('scroll', handleScroll);

            return () => {
                // Clean up scroll listener
                window.removeEventListener('scroll', handleScroll);
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
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                // Cleanup listener when sidebar is closed
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isSidebarVisible]);


    // Add scroll event listener to detect when user scrolls down



    // Function to open the sidebar
    const openSidebar = () => {
        setSidebarVisible(true);
    };

    // Function to close the sidebar
    const closeSidebar = () => {
        setSidebarVisible(false);
    };

    // Close the sidebar when clicking outside of it or clicking an item inside it


    const uniqueLocations = Array.from(new Set(locations.map(loc => loc.location)))
        .map(location => locations.find(loc => loc.location === location));
const style = {
    color: 'transparent',
    transform: 'rotate(-180deg)',
    cursor: 'pointer',
    // width: '100%', // Remove this line
    // height: 'auto', // Remove this line
};
    return (
        <>
<header className={`${scrolled ? 'scrolled' : ''}`}>
  <div className="bg-blue-500 flex items-center px-3 pt-3 h-12 w-screen relative">
    {/* Menu Icon */}
    <div className="flex items-center">
      <Image
        src="/assets/menu.png"
        alt="Menu"
        width={25}
        height={25}
        className="cursor-pointer transform rotate-180 hover:opacity-80 w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
        onClick={openSidebar}
      />
    </div>

    {/* Branding */}
     <div className="absolute left-1/2 transform -translate-x-1/2">
      <a href="/" className="branding-text" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="text-lg sm:text-lg lg:text-xl font-bold">ALVEO</h1>
      </a>
    </div>

    {/* Explore Our Properties Section */}
{!isExplorePage && (
  <div className="ml-auto flex items-end justify-end text-sm sm:text-base lg:text-lg xl:text-xl font-medium mt-1 w-1/2 pl-10">
    <a
      href="/pages/explore"
      className="flex items-center"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Image
        src="/assets/search.png"
        alt="Search"
        width={25}
        height={25}
        className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 -mt-2"
        style={{ transform: 'rotate(-270deg)', cursor: 'pointer' }}
      />
      <p className="ml-2 font-bold w-full">Explore Properties</p>
    </a>
  </div>
)}



    {/* Call Section */}
    {isExplorePage && (
      <div className="ml-auto flex items-center">
        <Image
          src="/assets/call.png"
          alt="Call"
          width={25}
          height={25}
          className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
        />
        <p className="ml-2 text-sm sm:text-base lg:text-lg xl:text-xl">123-4567</p>
      </div>
    )}
  </div>
</header>




      <div
  className={`fixed top-0 left-0 h-full w-64 bg-blue-950 text-white transition-transform transform z-50 
    sm:w-72 overflow-y-auto lg:w-2/5 xl:w-2/12 2xl:w-2/12
    ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}
  ref={sidebarRef}
  tabIndex="-1" // Makes the sidebar focusable
  onClick={closeSidebar}
  onKeyDown={(e) => e.key === 'Escape' && closeSidebar()} // Allows closing on Escape key
>
  <div className="flex justify-between items-center p-4 border-b border-gray-700 ">
    <Link href="/pages/aboutalveo/aboutalveo" className="text-lg font-bold no-underline text-white hover:text-gray-300 lg:text-3xl xl:text-lg">
      ABOUT ALVEO
    </Link>
    <span className="text-xl font-bold cursor-pointer" onClick={closeSidebar}>
      &times;
    </span>
  </div>

  <nav className="p-4">
    <Link href="/pages/location" className="block text-lg mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg">
      LOCATIONS
    </Link>
    <ul className="space-y-2">
      {uniqueLocations.map((location) => (
        <li key={location.key}>
          <a
            onClick={() => handleLocationClick(location.key)}
            className="block cursor-pointer hover:text-gray-300 no-underline text-white lg:text-xl xl:text-sm"
            href={`/pages/locations/${location.key}`}
          >
            {location.location}
          </a>
        </li>
      ))}
    </ul>

    <Link href="/pages/explore" className="block text-lg mt-6 mb-4 hover:text-gray-300 no-underline text-white lg:text-3xl xl:text-lg">
      PROPERTIES FOR SALE
    </Link>
    <ul className="space-y-2">
      {properties.map((item, index) => (
        <li key={index}>
          <Link href={`/pages/explore?specificLocation=${item.slug}`} className="block hover:text-gray-300 no-underline text-white lg:text-xl xl:text-sm">
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
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