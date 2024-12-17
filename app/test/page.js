// components/Header.js
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";

import Demo from "./../properties/page";
import Header from "../pages/header";
import Link from "next/link";
export default function Admin({}) {
  const [isVisible, setIsVisible] = useState(true); // Controls visibility of popup
  const [formData, setFormData] = useState({ email: "", password: "", code: "" });
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // To track OTP sent state

  const [properties, setProperties] = useState([]); // State to store fetched data from API
  const [counts, setCounts] = useState({
    properties: 0,
    otherBuildings: 0,
    condominiums: 0,
    locations: 0,
  });

 const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleLogin = async (e) => {
  e.preventDefault();

  // Step 1: User submits email and password to login
  const response = await fetch("http://localhost:8000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: formData.email, password: formData.password }),
  });

  if (response.ok) {
    // If login is successful, show OTP input
    setError(""); // Reset any previous error
    console.log("Login successful. OTP sent to email.");
    setIsOtpSent(true); // Allow the user to enter OTP
  } else {
    setError("Invalid email or password.");
  }
};

const handleOtpVerification = async (e) => {
  e.preventDefault();

  // Step 2: User submits OTP for verification
  const otpResponse = await fetch("http://localhost:8000/api/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.email, // Include email to identify user for OTP check
      otp: formData.otp, // OTP entered by user
    }),
  });

  if (otpResponse.ok) {
    // If OTP verification is successful
    console.log("OTP verified. You are now logged in.");
    // Redirect user to dashboard or home page
  } else {
    setError("Invalid or expired OTP.");
  }
};

  const fetchCount = async (endpoint, key) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/${endpoint}`
      );
      const data = await response.json();
      if (response.ok) {
        setCounts((prevCounts) => ({ ...prevCounts, [key]: data.count }));
      } else {
        console.error(`Error fetching ${key} count:`, data);
      }
    } catch (error) {
      console.error(`Fetch error for ${key}:`, error);
    }
  };

  useEffect(() => {
    fetchCount("countproperties", "properties");
    fetchCount("countotherbuildings", "otherBuildings");
    fetchCount("countcondominiums", "condominiums");
    fetchCount("countlocations", "locations");
  }, []); // Runs once on mount




  // Fetch data from the API on page load
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/admin/properties"
        ); // Your Next.js API route
        const data = await response.json();
        setProperties(data); // Store fetched properties
 
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, []); // Empty dependency array ensures this runs only on mount

  const closePopup = () => {
    setIsVisible(false);
  };


  return (
    <>
  {isVisible && (
  <div className="popup-container fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
    <div className="popup-content bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">ACCOUNT</h2>
      <form>
        <div>
          <label htmlFor="email" className="block text-lg font-medium">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="h-10 text-xl w-full mt-2 px-4 border border-gray-300 rounded-md"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="password" className="block text-lg font-medium">Password:</label>
          <input
            className="h-10 text-xl w-full mt-2 px-4 border border-gray-300 rounded-md"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="w-full flex gap-6 mt-4 justify-center">
          <button
            className="w-32 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
            type="submit"
            onClick={handleLogin}
          >
            LOGIN
          </button>
        </div>
      </form>
    </div>
  </div>
)}

  
 <div className="fixed w-full">


<header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
  <div className="flex justify-between items-center p-4">
    <div className="logosec">
      <Link href="/">
        <div className="logo cursor-pointer text-darkblue font-semibold text-lg">
          ALVEO LAND
        </div>
      </Link>
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
<div className="main-container mt-24 p-4 flex justify-center items-center">
  <div className="main max-w-screen-xl mx-auto">
    <div className="box-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
      
      {/* Box 1 */}
      <div className="box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
        <div className="text text-center flex flex-col items-center">
          <div className="flex items-center mb-2">
            <h2 className="topic-heading text-3xl font-semibold">{counts.properties}</h2>
            <img src="/assets/town.png" alt="Views" className="ml-4" width={50} height={50} />
          </div>
          <h2 className="topic text-lg font-medium">Properties</h2>
        </div>
      </div>

      {/* Box 2 */}
      <div className="box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
        <div className="text text-center flex flex-col items-center">
          <div className="flex items-center mb-2">
            <h2 className="topic-heading text-3xl font-semibold">{counts.otherBuildings}</h2>
            <img src="/assets/neighborhood.png" alt="Other Buildings" className="ml-4" width={50} height={50} />
          </div>
          <h2 className="topic text-lg font-medium">Other Buildings</h2>
        </div>
      </div>

      {/* Box 3 */}
      <div className="box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
        <div className="text text-center flex flex-col items-center">
          <div className="flex items-center mb-2">
            <h2 className="topic-heading text-3xl font-semibold">{counts.condominiums}</h2>
            <img src="/assets/skyline.png" alt="Condominiums" className="ml-4" width={50} height={50} />
          </div>
          <h2 className="topic text-lg font-medium">Condominiums</h2>
        </div>
      </div>

      {/* Box 4 */}
      <div className="box bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
        <div className="text text-center flex flex-col items-center">
          <div className="flex items-center mb-2">
            <h2 className="topic-heading text-3xl font-semibold">{counts.locations}</h2>
            <img src="/assets/location.png" alt="Locations" className="ml-4" width={50} height={50} />
          </div>
          <h2 className="topic text-lg font-medium">Locations</h2>
        </div>
      </div>
      
    </div>
  </div>
</div>

{/* Demo Section */}
<div className="demo-container min-h-screen mt-14 w-9/12 mx-auto overflow-y-auto scrollbar-hidden flex justify-center">
  <div>
    <Demo />
  </div>
</div>




       </div>
 
    </>
  );
}
