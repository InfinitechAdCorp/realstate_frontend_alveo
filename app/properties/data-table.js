"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import React, { useState, useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/alert/page";
const handleShowSuccessToast = (message) => {
  showToast(message, "success");
};

const handleShowErrorToast = (message) => {
  showToast(message, "error"); // Error toast
};

const handleShowWarningToast = (message) => {
  showToast(message, "warning"); // Warning toast
};
const fetchProperties = async () => {
  const authToken = localStorage.getItem("auth_token"); // Retrieve the token from localStorage
  const log = localStorage.getItem("isLoggedIn");
  console.log(authToken);
  // Check if user is logged in and token is available
  if (!authToken || log !== "true") {
    console.error("Token not found or user not logged in.");
    return []; // Return empty array if not logged in or token is not found
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/properties`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`, // Attach the token in the Authorization header
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data; // Return fetched properties
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array in case of an error
  }
};

const fetchBuildings = async () => {
  const authToken = localStorage.getItem("auth_token"); // Retrieve the token from localStorage
  const log = localStorage.getItem("isLoggedIn");

  // Check if user is logged in and token is available
  if (!authToken || log !== "true") {
    console.error("Token not found or user not logged in.");
    return []; // Return empty array if not logged in or token is not found
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/buildings`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`, // Attach the token in the Authorization header
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data; // Return fetched buildings
  } catch (error) {
    console.error("Failed to fetch buildings:", error);
    return []; // Return an empty array in case of an error
  }
};

const fetchFacilities = async () => {
  const authToken = localStorage.getItem("auth_token"); // Retrieve the token from localStorage
  const log = localStorage.getItem("isLoggedIn");

  // Check if user is logged in and token is available
  if (!authToken || log !== "true") {
    console.error("Token not found or user not logged in.");
    return []; // Return empty array if not logged in or token is not found
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/facilities`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`, // Attach the token in the Authorization header
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data; // Return fetched facilities
  } catch (error) {
    console.error("Failed to fetch facilities:", error);
    return []; // Return an empty array in case of an error
  }
};

const fetchFeatures = async () => {
  const authToken = localStorage.getItem("auth_token"); // Retrieve the token from localStorage
  const log = localStorage.getItem("isLoggedIn");

  // Check if user is logged in and token is available
  if (!authToken || log !== "true") {
    console.error("Token not found or user not logged in.");
    return []; // Return empty array if not logged in or token is not found
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/features`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`, // Attach the token in the Authorization header
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data; // Return fetched features
  } catch (error) {
    console.error("Failed to fetch features:", error);
    return []; // Return an empty array in case of an error
  }
};

// Function to fetch all data at once
const fetchAllData = async () => {
  const log = localStorage.getItem("isLoggedIn");

  // Proceed only if the user is logged in
  if (log !== "true") {
    console.error("User is not logged in.");
    return;
  }

  try {
    // Fetch all data in parallel using Promise.all
    const [properties, buildings, facilities, features] = await Promise.all([
      fetchProperties(),
      fetchBuildings(),
      fetchFacilities(),
      fetchFeatures(),
    ]);

    // Handle the fetched data (e.g., update state or process data)
    console.log("Properties:", properties);
    console.log("Buildings:", buildings);
    console.log("Facilities:", facilities);
    console.log("Features:", features);
  } catch (error) {
    console.error("Failed to fetch all data:", error);
  }
};

// DataTable Component
export function DataTable({ columns, data, newData }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [expandedRow, setExpandedRow] = useState(null); // Track expanded row
  const [otherBuildingsdata, setotherBuildingsData] = useState([]);
  const [facilityData, setFacilities] = useState([]);
  const [featureData, setFeatures] = useState([]);
  const [developmentTypes, setDevelopmentTypes] = useState([]);
  const [architecturalTheme, setArchitecturalTheme] = useState([]);
  const [status, setStatus] = useState([]);
  const [area, setArea] = useState([]);
  const [propertyData, setPropertyData] = useState({
    name: "",
    status: "",
    location: "",
    specific_location: "",
    price_range: "",
    lat: "",
    lng: "",
    units: "",
    land_area: "",
    development_type: "",
    architectural_theme: "",
    key: "",
    path: null, // Store file object for path
    view: null, // Store file object for view
  });

  const fillableFields = [
    { label: "Name", value: "name" },
    { label: "Lattitude", value: "lat" },
    { label: "Longtitude", value: "lng" },
    { label: "Specific Location", value: "specific_location" },
    { label: "Price Range", value: "price_range" },
    { label: "Units", value: "units" },
    { label: "Land Area", value: "land_area" },
  ];
  const pathAndViewFeatures = [
    { label: "Building Image", value: "path", type: "file" },
    { label: "Master Plan", value: "view", type: "file" }, // Use type 'file'
  ];
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPropertyData({ ...propertyData, [name]: value });
  };

  // Toggle expanded state when a row is clicked
  const handleRowClick = (rowId, value) => {
    setExpandedRow((prev) => (prev === rowId ? null : rowId)); // Toggle expanded state
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      const buildingresult = await fetchBuildings();
      setotherBuildingsData(buildingresult);

      const facilityresult = await fetchFacilities();
      setFacilities(facilityresult);

      const featureresult = await fetchFeatures(); // Fetch data from API

      // Check if the features field is a string and parse it
      const parsedFeatures = featureresult.map((feature) => {
        try {
          return {
            ...feature,
            features: feature.features ? JSON.parse(feature.features) : [],
          };
        } catch (error) {
          console.error("Error parsing features:", error);
          return feature; // Return as is in case of error
        }
      });

      // Set the parsed features into the state
      setFeatures(parsedFeatures);
    };

    fetchData();
  }, []);
  const [isAddPropertyOpen, setisAddPropertyOpen] = useState(false);
  const openAddProperty = () => {
    // Trigger the popup opening logic, potentially updating state or making API calls
    setisAddPropertyOpen(true);
  };
  const closeAddProperty = () => {
    // Set isAddPropertyOpen to false to close the popup
    setisAddPropertyOpen(false);
  };
  function addproperty() {
    // ... (existing functionality for adding a property)
    openAddProperty();
  }
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (!files || files.length === 0) return;

    const file = files[0];

    // Update the property data with the File object
    setPropertyData({
      ...propertyData,
      [name]: file,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log property data before appending
    console.log("Property Data before appending:", propertyData);

    const formData = new FormData();

    // Ensure that required fields are present
    // if (!propertyData.key || !propertyData.name || !propertyData.status) {
    //   handleShowWarningToast('Please fill in all required fields.');
    //   return;
    // }

    // Reassign 'key' to be the lowercase version of 'location'
    if (propertyData.location === "other") {
      propertyData.key = propertyData.custom_location.toLowerCase();
    } else {
      propertyData.key = propertyData.location.toLowerCase();
    }

    if (propertyData.development_type === "other") {
      propertyData.development_type = propertyData.custom_development_type;
    }
    if (propertyData.architectural_theme === "other") {
      propertyData.architectural_theme =
        propertyData.custom_architectural_theme;
    }
    if (propertyData.status === "other") {
      propertyData.status = propertyData.custom_status;
    }
    if (propertyData.location === "other") {
      propertyData.location = propertyData.custom_location;
    }

    // Append all property fields
    Object.keys(propertyData).forEach((key) => {
      // Exclude specific custom keys
      if (
        key === "custom_architectural_theme" ||
        key === "custom_development_type" ||
        key === "custom_location" ||
        key === "custom_status"
      ) {
        return; // Skip these keys
      }

      if (key === "path" || key === "view") {
        if (propertyData[key] instanceof File) {
          // Append file if it's an instance of File
          formData.append(key, propertyData[key]);
        }
      } else {
        // Append regular data
        formData.append(key, propertyData[key]);
      }
    });

    // Log the FormData content for debugging
    formData.forEach((value, key) => {
      console.log(`FormData - ${key}:`, value);
    });
    const authToken = localStorage.getItem("auth_token"); // Retrieve the token from localStorage

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/addproperty`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`, // Add the Authorization header with Bearer token
          },
          body: formData, // Send the formData
        }
      );

      // Check if the response is JSON
      const contentType = response.headers.get("Content-Type");
      console.log(true);
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Response Data:", data);

        if (response.ok) {
          handleShowSuccessToast("Property created successfully");
          closeAddProperty();
        } else {
          console.error("Error creating property:", data);
          handleShowErrorToast(`Error: ${data.message}`);
        }
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    // Check if the token exists
    const token = localStorage.getItem("auth_token");
    const log = localStorage.getItem("isLoggedIn");

    // Only proceed if the token exists and the user is logged in
    if (!token || log !== "true") {
      console.error("User is not logged in or token is missing.");
      setError("User is not logged in or token is missing.");
      return;
    }

    // If token exists, proceed with fetching data
    const fetchDevelopmentTypes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/development-types`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Include token in request headers
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch development types");
        }
        const data = await response.json();
        setDevelopmentTypes(data);
      } catch (error) {
        console.error("Error fetching development types:", error);
      }
    };

    const fetchArchitecturalTheme = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/architectural-themes`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Include token in request headers
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch architectural themes");
        }
        const data = await response.json();
        setArchitecturalTheme(data);
      } catch (error) {
        console.error("Error fetching architectural themes:", error);
      }
    };

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/status`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Include token in request headers
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch status");
        }
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    const fetchArea = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Include token in request headers
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch area");
        }
        const data = await response.json();
        setArea(data);
      } catch (error) {
        console.error("Error fetching area:", error);
      }
    };

    // Call the fetch functions if the user is logged in
    fetchDevelopmentTypes();
    fetchArchitecturalTheme();
    fetchStatus();
    fetchArea();
  }, []);
  return (
    <div className="max-h-20 ">
      {isAddPropertyOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-auto shadow-xl">
            <button
              onClick={() => closePopup("addProperty")}
              className="absolute top-4 right-4 bg-gray-500 text-white rounded-full p-2 focus:outline-none hover:bg-gray-600"
            >
              <span className="text-2xl">&times;</span>
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Add Property
            </h2>

            <div className="space-y-6 overflow-y-auto max-h-screen">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                encType="multipart/form-data"
              >
                {fillableFields.map((field) => (
                  <div key={field.value} className="flex flex-col space-y-2">
                    <label
                      htmlFor={field.value}
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      id={field.value}
                      name={field.value}
                      value={propertyData[field.value]}
                      onChange={handleChange}
                      className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Development Type
                  </label>
                  <div>
                    {propertyData["development_type"] === "" ||
                    propertyData["development_type"] === "other" ? (
                      // If the user selects 'Other', or hasn't selected anything, show an input field
                      <div className="relative">
                        <select
                          id="development_type"
                          name="development_type"
                          value={propertyData["development_type"]}
                          onChange={(e) =>
                            setPropertyData({
                              ...propertyData,
                              development_type:
                                e.target.value === "other"
                                  ? "other"
                                  : e.target.value,
                            })
                          }
                          className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                        >
                          {/* Default 'Select' placeholder */}
                          <option value="" disabled>
                            Select
                          </option>

                          {developmentTypes.map((type) => (
                            <option value={type.name} key={type.id}>
                              {type.name}
                            </option>
                          ))}

                          {/* Option to select 'Other' */}
                          <option value="other">
                            Other (type your custom type)
                          </option>
                        </select>

                        {propertyData["development_type"] === "other" && (
                          <input
                            type="text"
                            placeholder="Enter custom development type"
                            value={propertyData["custom_development_type"]}
                            onChange={(e) =>
                              setPropertyData({
                                ...propertyData,
                                custom_development_type: e.target.value,
                              })
                            }
                            className="mt-2 rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                          />
                        )}
                      </div>
                    ) : (
                      // Otherwise, show the select dropdown with options
                      <select
                        id="development_type"
                        name="development_type"
                        value={propertyData["development_type"]}
                        onChange={handleChange}
                        className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                      >
                        {developmentTypes.map((type) => (
                          <option value={type.name} key={type.id}>
                            {type.name}
                          </option>
                        ))}
                        {/* Add an option for the user to type a custom input */}
                        <option value="other">
                          Other (type your custom type)
                        </option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Architectural Theme
                  </label>
                  <div>
                    {propertyData["architectural_theme"] === "" ||
                    propertyData["architectural_theme"] === "other" ? (
                      // If the user selects 'Other', or hasn't selected anything, show an input field
                      <div className="relative">
                        <select
                          id="architectural_theme"
                          name="architectural_theme"
                          value={propertyData["architectural_theme"]}
                          onChange={(e) => {
                            const updatedValue =
                              e.target.value === "other"
                                ? "other"
                                : e.target.value;
                            setPropertyData({
                              ...propertyData,
                              architectural_theme: updatedValue,
                            });
                            console.log(
                              "Updated architectural_theme:",
                              updatedValue
                            );
                          }}
                          className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                        >
                          <option value="" disabled>
                            Select
                          </option>

                          {architecturalTheme.map((type) => (
                            <option value={type.name} key={type.name}>
                              {type.name}
                            </option>
                          ))}
                          {/* Option to select 'Other' */}
                          <option value="other">
                            Other (type your custom theme)
                          </option>
                        </select>

                        {propertyData["architectural_theme"] === "other" && (
                          <input
                            type="text"
                            placeholder="Enter custom architectural theme"
                            value={propertyData["custom_architectural_theme"]}
                            onChange={(e) => {
                              const updatedCustomTheme = e.target.value;
                              setPropertyData({
                                ...propertyData,
                                custom_architectural_theme: updatedCustomTheme,
                              });
                              console.log(
                                "Updated custom_architectural_theme:",
                                updatedCustomTheme
                              );
                            }}
                            className="mt-2 rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                          />
                        )}
                      </div>
                    ) : (
                      // Otherwise, show the select dropdown with options
                      <select
                        id="architectural_theme"
                        name="architectural_theme"
                        value={propertyData["architectural_theme"]}
                        onChange={(e) => {
                          const updatedValue = e.target.value;
                          setPropertyData({
                            ...propertyData,
                            architectural_theme: updatedValue,
                          });
                          console.log(
                            "Updated architectural_theme:",
                            updatedValue
                          );
                        }}
                        className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                      >
                        {architecturalTheme.map((type) => (
                          <option value={type.name} key={type.name}>
                            {type.name}
                          </option>
                        ))}
                        {/* Add an option for the user to type a custom input */}
                        <option value="other">
                          Other (type your custom theme)
                        </option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="relative">
                    {propertyData["status"] === "" ||
                    propertyData["status"] === "other" ? (
                      // If the user selects 'Other', or hasn't selected anything, show an input field
                      <>
                        <select
                          id="status"
                          name="status"
                          value={propertyData["status"]}
                          onChange={(e) =>
                            setPropertyData({
                              ...propertyData,
                              status:
                                e.target.value === "other"
                                  ? "other"
                                  : e.target.value,
                            })
                          }
                          className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                        >
                          <option value="" disabled>
                            Select
                          </option>

                          {status.map((type) => (
                            <option value={type.name} key={type.name}>
                              {type.name}
                            </option>
                          ))}
                          {/* Option to select 'Other' */}
                          <option value="other">
                            Other (type your custom status)
                          </option>
                        </select>

                        {propertyData["status"] === "other" && (
                          <input
                            type="text"
                            placeholder="Enter custom status"
                            value={propertyData["custom_status"]}
                            onChange={(e) =>
                              setPropertyData({
                                ...propertyData,
                                custom_status: e.target.value,
                              })
                            }
                            className="mt-2 rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                          />
                        )}
                      </>
                    ) : (
                      // Otherwise, show the select dropdown with options
                      <select
                        id="status"
                        name="status"
                        value={propertyData["status"]}
                        onChange={handleChange}
                        className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                      >
                        {status.map((type) => (
                          <option value={type.name} key={type.name}>
                            {type.name}
                          </option>
                        ))}
                        {/* Add an option for the user to type a custom input */}
                        <option value="other">
                          Other (type your custom status)
                        </option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="relative">
                    {propertyData["location"] === "" ||
                    propertyData["location"] === "other" ? (
                      // If the user selects 'Other', or hasn't selected anything, show an input field
                      <>
                        <select
                          id="location"
                          name="location"
                          value={propertyData["location"]}
                          onChange={(e) =>
                            setPropertyData({
                              ...propertyData,
                              location:
                                e.target.value === "other"
                                  ? "other"
                                  : e.target.value,
                            })
                          }
                          className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                        >
                          <option value="" disabled>
                            Select
                          </option>

                          {area.map((type) => (
                            <option value={type.area_name} key={type.area_name}>
                              {type.area_name}
                            </option>
                          ))}
                          {/* Option to select 'Other' */}
                          <option value="other">
                            Other (type your custom location)
                          </option>
                        </select>

                        {propertyData["location"] === "other" && (
                          <input
                            type="text"
                            placeholder="Enter custom location"
                            value={propertyData["custom_location"]}
                            onChange={(e) =>
                              setPropertyData({
                                ...propertyData,
                                custom_location: e.target.value,
                              })
                            }
                            className="mt-2 rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                          />
                        )}
                      </>
                    ) : (
                      // Otherwise, show the select dropdown with options
                      <select
                        id="location"
                        name="location"
                        value={propertyData["location"]}
                        onChange={handleChange}
                        className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
                      >
                        {area.map((type) => (
                          <option value={type.area_name} key={type.area_name}>
                            {type.area_name}
                          </option>
                        ))}
                        {/* Add an option for the user to type a custom input */}
                        <option value="other">
                          Other (type your custom location)
                        </option>
                      </select>
                    )}
                  </div>
                </div>

                {pathAndViewFeatures.map((field) => (
                  <div
                    key={field.value}
                    className="flex flex-col space-y-2 col-span-full md:col-span-1"
                  >
                    <label
                      htmlFor={field.value}
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    <input
                      type="file"
                      id={field.value}
                      name={field.value}
                      onChange={handleFileChange}
                      accept={field.value === "path" ? "image/*" : "*"}
                      className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </form>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-200"
                onClick={handleSubmit}
                // Trigger bulk update function
              >
                Submit
              </button>
              <button
                onClick={closeAddProperty} // Call the function here
                className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex mb-5 ">
        <Input
          placeholder="Search Building Name"
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <button onClick={addproperty}>
          <img src="/addbutton.png" className="w-8 h-8 " alt="Add Button" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-10 bg-white">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        style={{
          maxHeight: "500px", // Set a fixed height for the body
          overflowY: "auto", // Enable vertical scrolling
          display: "block", // Make the table body block-level
        }}
      >
        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    {/* Main Table Row */}
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        handleRowClick(row.id, row.original); // Toggle expanded state
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Content Row (Accordion) */}
                    {expandedRow === row.id && (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="p-4 bg-white-100"
                        >
                          <Accordion type="single" collapsible>
                            <AccordionItem value={row.id.toString()}>
                              <AccordionTrigger>
                                Other Buildings
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Building Name</TableHead>
                                        <TableHead>Development Type</TableHead>
                                        <TableHead>
                                          Residential Levels
                                        </TableHead>
                                        <TableHead>
                                          Basement Parking Levels
                                        </TableHead>
                                        <TableHead>
                                          Podium Parking Levels
                                        </TableHead>
                                        <TableHead>Commercial Units</TableHead>
                                        <TableHead>
                                          Lower Ground Parking Levels
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {/* Filter the otherBuildingsdata to show only buildings that match the current row's ID */}
                                      {otherBuildingsdata.length > 0 ? (
                                        otherBuildingsdata
                                          .filter(
                                            (building) =>
                                              building.property_id ===
                                              row.original.id // Match the property_id with the row's id
                                          )
                                          .map((building) => (
                                            <TableRow key={building.id}>
                                              <TableCell>
                                                {building.name}
                                              </TableCell>
                                              <TableCell>
                                                {building.development_type}
                                              </TableCell>
                                              <TableCell>
                                                {building.residential_levels}
                                              </TableCell>
                                              <TableCell>
                                                {building.basement_parking_levels ||
                                                  "N/A"}
                                              </TableCell>
                                              <TableCell>
                                                {building.podium_parking_levels ||
                                                  "N/A"}
                                              </TableCell>
                                              <TableCell>
                                                {building.commercial_units ||
                                                  "N/A"}
                                              </TableCell>
                                              <TableCell>
                                                {building.lower_ground_floor_parking_levels ||
                                                  "N/A"}
                                              </TableCell>
                                            </TableRow>
                                          ))
                                      ) : (
                                        <TableRow>
                                          <TableCell colSpan={7}>
                                            No buildings found
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value={`building-details-${row.id}`}>
                              <AccordionTrigger>
                                Building Details
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="rounded-md border p-4 overflow-y-auto ">
                                  <div className="flex space-x-6">
                                    {/* Building Features Table */}
                                    <div className="w-1/2  max-h-60 overflow-y-auto">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Feature</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {featureData.length > 0 ? (
                                            featureData
                                              .filter(
                                                (feature) =>
                                                  feature.id === row.original.id
                                              ) // Match feature by id
                                              .map((featureItem) =>
                                                featureItem.features.map(
                                                  (feature, index) => (
                                                    <TableRow key={index}>
                                                      {" "}
                                                      {/* Use index as the key for each feature */}
                                                      <TableCell>
                                                        {feature.name}
                                                      </TableCell>
                                                    </TableRow>
                                                  )
                                                )
                                              )
                                          ) : (
                                            <TableRow>
                                              <TableCell
                                                colSpan={2}
                                                className="text-center"
                                              >
                                                No features found
                                              </TableCell>
                                            </TableRow>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>

                                    {/* Building Facilities Table */}
                                    <div className="w-1/2 max-h-60 overflow-y-auto">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Facilities</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {facilityData
                                            .filter(
                                              (facility) =>
                                                facility.property_id ===
                                                row.original.id
                                            ) // Filter by property_id
                                            .map((facility, index) => {
                                              const correspondingFeature =
                                                featureData
                                                  .filter(
                                                    (feature) =>
                                                      feature.property_id ===
                                                      row.original.id
                                                  )
                                                  .map((feature) => {
                                                    const features = JSON.parse(
                                                      feature.features
                                                    ); // Parse the features JSON string
                                                    return features.find(
                                                      (f) =>
                                                        f.name === facility.name
                                                    ); // Find the matching feature
                                                  })[0];

                                              return (
                                                <TableRow key={facility.id}>
                                                  <TableCell>
                                                    {facility.name}
                                                  </TableCell>
                                                </TableRow>
                                              );
                                            })}

                                          {facilityData.filter(
                                            (facility) =>
                                              facility.property_id ===
                                              row.original.id
                                          ).length === 0 && (
                                            <TableRow>
                                              <TableCell colSpan={3}>
                                                No facilities found
                                              </TableCell>
                                            </TableRow>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
