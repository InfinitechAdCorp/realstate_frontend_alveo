"use client";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Header from "../header";
import { Suspense } from "react";
import Footer from "./../footer";
import SEO from "./../../seo/page";

function ExplorePage() {
  const searchParams = useSearchParams();
  const specificLocation = searchParams.get("specificLocation");

  const [buildings, setBuildings] = useState([]);
  const [clickedIndex, setClickedIndex] = useState(null);

  const images = [
    {
      src: "/assets/copy.png",
      alt: "Copy Icon",
      value: "all",
      label: "All Property",
    },
    {
      src: "/assets/skyline.png",
      alt: "Skyline Icon",
      value: "condominiums",
      label: "Condominiums",
    },
    {
      src: "/assets/neighborhood.png",
      alt: "Neighborhood Icon",
      value: "residential",
      label: "Residentials",
    },
    {
      src: "/assets/bag.png",
      alt: "Bag Icon",
      value: "commercial",
      label: "Commercials",
    },
    {
      src: "/assets/location.png",
      alt: "Location Icon",
      value: "office",
      label: "Offices",
    },
  ];

  const fetchBuildings = async (value) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/getbuildings`;
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      let filteredData;
      if (value === "all") {
        filteredData = data;
      } else if (value === "condominiums") {
        filteredData = data.filter((building) =>
          building.development_type.toLowerCase().includes("condominium")
        );
      } else if (value === "residential") {
        filteredData = data.filter(
          (building) => building.residential_levels > 0
        );
      } else if (value === "commercial") {
        filteredData = data.filter((building) => building.commercial_units > 0);
      } else if (value === "office") {
        filteredData = data.filter(
          (building) => building.development_type === "Office"
        );
      } else {
        filteredData = [];
      }

      // Sort ang property from newest to oldest
      filteredData.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA;
      });

      setBuildings(filteredData);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleImageClick = (index, value) => {
    setClickedIndex(index);
    fetchBuildings(value);
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

  // Para sa new badge it will display only if the property is added with 3 days interval
  const isNewProperty = (createdAt) => {
    const today = new Date();
    const createdDate = new Date(createdAt);
    const timeDiff = today - createdDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff <= 3;
  };

  useEffect(() => {
    const locationValue = specificLocation || "all";
    fetchBuildings(locationValue);
  }, [specificLocation]);

  return (
    <>
      <SEO
        title="REAL ESTATE"
        description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter."
        keywords="alveo, real estate, properties, parkings, building features, property features, property, buildings, building type"
        canonical="${process.env.NEXT_PUBLIC_LOCAL_PORT}/pages/explore"
      />
      <div className="mb-10">
        <Header />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center 2xl:mx-10">
        <div className="text-center mt-3 sm:-ml-10">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative inline-block ml-5 sm:ml-8 justify-center lg:mt-5 ${
                clickedIndex === index ? "bg-gray-300 shadow-lg" : ""
              }`}
              onClick={() => handleImageClick(index, image.value)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="transition-transform transform duration-200 ease-in-out hover:scale-110 hover:opacity-80 h-8 gap-10 md:w-10 md:h-10 lg:w-14 lg:h-14 xl:w-10 xl:h-10"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white text-center py-1 px-2 rounded-md opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
                {image.label}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-center mt-3 text-2xl lg:text-4xl xl:text-3xl">
            {buildings.length} PROPERTIES
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:max-w-fit gap-4 mt-4 lg:mx-36 mb-16">
          {buildings.map((building) => (
            <div
              key={building.id}
              className="max-w-80 mx-10 sm:max-w-96 sm:mx-1 lg:max-w-96 lg:mx-0"
            >
              <div className="card rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out relative">
                {isNewProperty(building.created_at) && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded-full">
                    NEW
                  </span>
                )}
                <img
                  src={
                    building.path &&
                    building.path.startsWith(
                      `${process.env.NEXT_PUBLIC_SERVER_PORT}/`
                    )
                      ? building.path
                      : building.path && building.path.startsWith("/property/")
                      ? `${
                          process.env.NEXT_PUBLIC_SERVER_PORT
                        }${building.path.replace(/\\/g, "/")}`
                      : building.path
                      ? `${
                          process.env.NEXT_PUBLIC_SERVER_PORT
                        }/assets/Location/${encodeURIComponent(
                          building.path.replace("assets/Location/", "")
                        )}`
                      : ""
                  }
                  className="w-full h-64 object-cover rounded-t-lg"
                  alt={building.name}
                />
                <div className="p-4 bg-white">
                  <h3 className="text-xl font-semibold text-blue-600">
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuildingClick(building.property_id);
                    }}
                    className="mt-3 bg-blue-500 text-white font-medium py-2 px-4 rounded-full hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function ExploreWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExplorePage />
    </Suspense>
  );
}
