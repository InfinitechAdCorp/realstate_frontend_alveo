"use client";
import React, { useEffect, useState } from "react";
import Chart from "./chart";

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedin] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [counts, setCounts] = useState({
    properties: 0,
    otherBuildings: 0,
    condominiums: 0,
    locations: 0,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedLoginStatus = localStorage.getItem("isLoggedIn");

    if (!storedToken || storedLoginStatus !== "true") {
      console.error("User is not logged in or token not found.");
      return;
    }

    setAuthToken(storedToken);
    setIsLoggedin(true);

    const fetchData = async () => {
      try {
        const endpoints = [
          "countproperties",
          "countotherbuildings",
          "countcondominiums",
          "countlocations",
        ];
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            fetch(
              `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/${endpoint}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                  "Content-Type": "application/json",
                },
              }
            ).then((res) => res.json())
          )
        );

        setCounts({
          properties: responses[0].count || 0,
          otherBuildings: responses[1].count || 0,
          condominiums: responses[2].count || 0,
          locations: responses[3].count || 0,
        });

        console.log("Updated counts:", {
          properties: responses[0].count || 0,
          otherBuildings: responses[1].count || 0,
          condominiums: responses[2].count || 0,
          locations: responses[3].count || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-[90%] w-full relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      <div className="flex justify-center">
        <div className="w-full max-w-screen-2xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <DashboardBox
              count={counts.properties}
              label="Properties"
              icon="/assets/town.png"
            />
            <DashboardBox
              count={counts.otherBuildings}
              label="Other Buildings"
              icon="/assets/neighborhood.png"
            />
            <DashboardBox
              count={counts.condominiums}
              label="Condominiums"
              icon="/assets/skyline.png"
            />
            <DashboardBox
              count={counts.locations}
              label="Locations"
              icon="/assets/location.png"
            />
          </div>
        </div>
      </div>

      {/* Chart Component */}
      <div className="mt-10 w-full px-4">
        <Chart data={counts} />
      </div>
    </div>
  );
};

// Reusable Dashboard Box Component
const DashboardBox = ({ count, label, icon }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center w-full">
      <div className="flex items-center justify-center space-x-4">
        <h2 className="text-2xl sm:text-3xl font-semibold">{count}</h2>
        <img src={icon} alt={label} className="w-10 h-10 sm:w-12 sm:h-12" />
      </div>
      <h2 className="text-sm sm:text-lg font-medium mt-2">{label}</h2>
    </div>
  );
};

export default Dashboard;
