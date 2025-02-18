"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthPopup = () => {
  const [formData, setFormData] = useState({ password: "" });
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // Popup visibility state
  const [authToken, setAuthToken] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userName, setUserName] = useState(""); // State to store user name

  useEffect(() => {
    // Check login status from localStorage
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedin(loginStatus);

    // If logged in, fetch the name from localStorage
    if (loginStatus) {
      const name = localStorage.getItem("userInfo");
      setUserName(name); // Set the name if logged in
    }

    // If not logged in and trying to access '/admin', redirect to '/auth'
    if (window.location.pathname === "/admin" && !loginStatus) {
      window.location.replace("/auth");
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      password: formData.password,
    };
    console.log(loginData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Clear localStorage first to ensure it's clean before setting new login data
        localStorage.clear();
        Cookies.set("auth_token", data.token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userInfo", data.name); // Don't add extra quotes around data.name

        // Update the necessary states
        setAuthToken(data.token);
        setIsLoggedin(true); // Set isLoggedin to true
        setUserName(data.name); // Store the user's name in state

        // Set visibility or other UI-related states if needed
        setIsVisible(false);

        // Redirect to the admin page after successful login
        window.location.replace("/admin");
      } else {
        const errorData = await response.json();
        console.error("Error during login:", errorData);
        setError(errorData.error || "Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Conditionally render background based on login status */}

      <div className="popup-container fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="popup-content bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-center mb-4">ACCOUNT</h2>
          <form>
            <div>
              <label htmlFor="password" className="block text-lg font-medium">
                Password:
              </label>
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
    </>
  );
};

export default AuthPopup;
