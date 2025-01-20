"use client";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Header from "../header";
import { Suspense } from "react";
import Footer from "./../footer";
import SEO from "./../../seo/page";
import {
  BsCopy,
  BsBuildings,
  BsHouseDoor,
  BsBag,
  BsBuildingCheck,
} from "react-icons/bs";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import Icon from "@/app/pages/socialmedia-icons/page";
function ExplorePage() {
  const searchParams = useSearchParams();
  const specificLocation = searchParams.get("specificLocation");
  const [value, setValue] = useState("all");
  const [allBuildings, setAllBuildings] = useState([]); // Store all buildings data here
  const [filteredBuildings, setFilteredBuildings] = useState([]); // Store the filtered buildings based on selected category
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false); // Set loading to false when the image has loaded
  };

  const images = [
    {
      icon: <BsCopy className="text-4xl" />, // Using the 'copy' icon from React Icons
      value: "all",
      label: "All Property",
    },
    {
      icon: <BsBuildings className="text-4xl" />, // Using the 'building' icon for Condominiums
      value: "condominiums",
      label: "Condominiums",
    },
    {
      icon: <BsHouseDoor className="text-4xl" />, // Using the 'home' icon for Residentials
      value: "residential",
      label: "Residentials",
    },
    {
      icon: <BsBag className="text-4xl" />, // Using the 'suitcase' icon for Commercials
      value: "commercial",
      label: "Commercials",
    },
    {
      icon: <HiOutlineBuildingOffice2 className="text-4xl" />, // Using the 'location' icon for Offices
      value: "office",
      label: "Offices",
    },
  ];

  const fetchBuildings = async () => {
    try {
      // Fetch buildings data once
      const buildingsEndpoint = `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/getbuildings`;
      const buildingsResponse = await fetch(buildingsEndpoint);
      if (!buildingsResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const buildingsData = await buildingsResponse.json();
      console.log("Buildings Data:", buildingsData);

      // Fetch properties data
      const propertiesEndpoint = `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/allproperty`;
      const propertiesResponse = await fetch(propertiesEndpoint);
      if (!propertiesResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const propertiesData = await propertiesResponse.json();
      console.log("Properties Data:", propertiesData);

      // Combine the building data with property status
      const combinedData = buildingsData.map((building) => {
        // Find the corresponding property by matching the ID
        const matchingProperty = propertiesData.find(
          (property) => property.id === building.id
        );

        // Add the status from property if matched, else default to "Unknown"
        return {
          ...building,
          status: matchingProperty ? matchingProperty.status : "Unknown",
        };
      });

      // Set the combined data in state
      setAllBuildings(combinedData);
      setFilteredBuildings(combinedData); // Initially, display all buildings
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const filterBuildings = (category) => {
    let filteredData;

    // Filter buildings based on the selected category (all, condominiums, residential)
    if (category === "all") {
      filteredData = allBuildings; // Show all buildings
    } else if (category === "condominiums") {
      filteredData = allBuildings.filter((building) =>
        building.development_type.toLowerCase().includes("condominium")
      );
    } else if (category === "residential") {
      filteredData = allBuildings.filter(
        (building) => building.residential_levels > 0
      );
    } else if (category === "commercial") {
      filteredData = allBuildings.filter(
        (building) => building.commercial_units > 0
      );
    } else if (category === "office") {
      filteredData = allBuildings.filter((building) =>
        building.development_type.toLowerCase().includes("office")
      );
    } else {
      filteredData = [];
    }

    // Sort buildings from newest to oldest based on created_at
    filteredData.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return dateB - dateA;
    });

    // Set filtered data to the state
    setFilteredBuildings(filteredData);
  };

  const handleImageClick = (index, category) => {
    setValue(category);
    filterBuildings(category); // Filter the buildings when a category is selected
  };

  const handleBuildingClick = async (buildingId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/property/id/${buildingId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const propertyData = await response.json();

      window.location.href = `${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/buildings/${buildingId}`;
    } catch (error) {
      console.error("Error fetching property:", error);
    }
  };

  // To check if a property is new
  const isNewProperty = (createdAt) => {
    const today = new Date();
    const createdDate = new Date(createdAt);
    const timeDiff = today - createdDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff <= 3;
  };

  useEffect(() => {
    fetchBuildings(); // Fetch buildings data only once when the component mounts
  }, []);

  return (
    <>
      <SEO
        title="REAL ESTATE"
        description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter."
        keywords="alveo, real estate, properties, parkings, building features, property features, property, buildings, building type"
        canonical="${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/explore"
      />
      <div className="mb-10">
        <Header /> <Icon />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center 2xl:mx-10">
        <div className="text-center mt-10 sm:-ml-10 cursor-pointer border-b-2 border-black">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative inline-block ml-5 sm:ml-8 justify-center lg:mt-5"
              onClick={() => handleImageClick(index, image.value)}
            >
              <div className="flex justify-center items-center transition-transform duration-200 ease-in-out hover:scale-110 hover:opacity-80">
                {image.icon}
              </div>
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-10
        bg-black bg-opacity-70 text-white text-center py-1 px-2 rounded-md opacity-0
        transition-all duration-200 ease-in-out hover:opacity-100 hover:translate-y-0
        hover:bg-opacity-90 hover:scale-105"
              >
                {image.label}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h1 className="text-center mt-3 text-2xl lg:text-4xl xl:text-3xl">
            {filteredBuildings.length} {value.toUpperCase()}{" "}
            {/* Access the selected category */}
          </h1>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 
        xl:grid-cols-3 2xl:grid-cols-4 lg:max-w-fit gap-4 mt-4 lg:mx-36 mb-16"
        >
          {filteredBuildings.map((building) => {
            // Define the background color based on the status
            let statusColor = "";
            switch (building.status?.toLowerCase()) {
              case "ready for occupancy":
                statusColor = "bg-green-500"; // Green for Ready for Occupancy
                break;
              case "under construction":
                statusColor = "bg-red-500"; // Red for Under Construction
                break;
              case "new":
                statusColor = "bg-blue-500"; // Blue for New
                break;
              case "pre-selling":
                statusColor = "bg-yellow-500"; // Yellow for Pre-selling
                break;
              default:
                statusColor = "bg-gray-500"; // Default gray if status is unknown
                break;
            }

            return (
              <div
                key={building.id}
                className="max-w-80 mx-10 sm:max-w-96 sm:mx-1 lg:max-w-96 lg:mx-0"
              >
                <div className="card overflow-hidden relative">
                  {/* Render the status with dynamic background color */}
                  {building.status && (
                    <span
                      className={`absolute top-2 right-2 text-white text-xs font-bold py-1 px-2 rounded-full z-10 ${statusColor}`}
                    >
                      {building.status.toUpperCase()}
                    </span>
                  )}

                  {loading && (
                    <div className="absolute w-full h-64 inset-0 flex items-center justify-center bg-gray-200">
                      <div className="text-5xl font-thin text-opacity-40 text-cyan-700 animate-pulse">
                        Λ L V E O
                      </div>
                    </div>
                  )}

                  {/* Actual image of the property */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${building.path}`}
                    alt={building.name}
                    onLoad={handleImageLoad}
                    className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300 ease-in-out"
                  />

                  <div className="p-4 bg-white">
                    <h3 className="text-xl font-semibold text-cyan-700">
                      {building.name}
                    </h3>
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Development Type:</strong>{" "}
                      {building.development_type}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Residential Levels:</strong>{" "}
                      {building.residential_levels}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Basement Parking:</strong>{" "}
                      {building.basement_parking_levels || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Commercial Units:</strong>{" "}
                      {building.commercial_units || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Podium Parking:</strong>{" "}
                      {building.podium_parking_levels || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Lower Ground Parking:</strong>{" "}
                      {building.lower_ground_floor_parking_levels || "N/A"}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuildingClick(building.property_id);
                      }}
                      className="mt-3 bg-cyan-700 text-white font-medium py-2 px-4 
            items-end text-end justify-end hover:bg-customBlue transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </>
  );
}

export default ExplorePage;
