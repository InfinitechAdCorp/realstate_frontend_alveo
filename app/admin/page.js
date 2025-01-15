"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/alert/page";
import DevelopmentTypeModal from "@/components/admin/developmentTypeModal";
import ArchitecturalThemeModal from "@/components/admin/architecturalThemeModal";
import StatusModal from "@/components/admin/statusModal";
import Chart from "@/components/admin/chart";
import { Input } from "@/components/ui/input";

import Demo from "./../properties/page";
import Header from "../pages/header";
import AreaModal from "@/components/admin/areaModal";
import Appointment from "@/components/admin/appointments";
import SubmittedProperties from "@/components/admin/submittedProperties";
import Slider from "react-slick";

export default function Admin({}) {
  const [showProperties, setShowProperties] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Controls visibility of popup
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // To track OTP sent state
  const [isLoggedIn, setisLoggedin] = useState(false); // To track OTP sent state
  const [submittedProperties, setSubmittedProperties] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [authToken_final, setAuthToken] = useState([]); // State to store fetched data from API
  const [properties, setProperties] = useState([]); // State to store fetched data from API

  const [counts, setCounts] = useState({
    properties: 0,
    otherBuildings: 0,
    condominiums: 0,
    locations: 0,
  });
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
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
  const [activeNav, setActiveNav] = useState("DASHBOARD"); // Default active nav
  const [data, setData] = useState({
    newType: "",
    newTheme: "",
    newStatus: "",
    newLocation: "",
    developmentTypes: [], // Ensure this is initialized as an array
    architecturalThemes: [],
    statusOptions: [],
    chatbotEntries: [], // Ensure chatbotEntries is an array
    newQuestion: "",
    newAnswer: "",
    newAreaName: "",
    newTitle: "",
    newDescription: "",
    newImage: null,
    locations: [],
  });

  const [chatbotData, setChatbotData] = useState([]);
  const [chatbotFormData, setChatbotFormData] = useState({
    question: "",
    answer: "",
  });

  const [editing, setEditing] = useState(null);
  const navItems_1 = [
    {
      name: "DASHBOARD",
      onClick: () => console.log("Properties Clicked"),
      icon: "/assets/dashboard.png",
    },
    {
      name: "PROPERTIES",
      onClick: () => console.log("Properties Clicked"),
      icon: "/assets/house.png",
    },
    {
      name: "CLIENT PROPERTY",
      onClick: () => console.log("Details Clicked"),
      icon: "/assets/customers.png",
    },
    {
      name: "APPOINTMENTS",
      onClick: () => console.log("Details Clicked"),
      icon: "/assets/appointment.png",
    },
  ];

  const navItems_2 = [
    {
      name: "FORM FILLER",
      onClick: () => console.log("Detailes Clicked"),
      icon: "/assets/form.png",
    },
    {
      name: "CHATBOT",
      onClick: () => console.log("Detailes Clicked"),
      icon: "/assets/robotic.png",
    },
  ];
  const navItems_FormFiller = [
    {
      name: "DEVELOPMENT TYPE", // New item for development types
      onClick: () => setActiveNav("DEVELOPMENT TYPE"), // Set activeNav to "DEVELOPMENT TYPES"
      icon: "/assets/turn-right.png",
    },
    {
      name: "STATUS", // New item for status
      onClick: () => setActiveNav("STATUS"), // Set activeNav to "STATUS"
      icon: "/assets/turn-right.png",
    },
    {
      name: "ARCHITECTURAL THEME", // New item for architectural themes
      onClick: () => setActiveNav("ARCHITECTURAL THEME"), // Set activeNav to "ARCHITECTURAL THEMES"
      icon: "/assets/turn-right.png",
    },
    {
      name: "LOCATION", // New item for locations
      onClick: () => setActiveNav("LOCATION"), // Set activeNav to "LOCATIONS"
      icon: "/assets/turn-right.png",
    },
  ];

  const [isEditing, setIsEditing] = useState(false);

  const [success, setSuccess] = useState("");
  const handleAddLoc = async (
    type,
    areaName,
    title,
    description,
    image,
    setData,
    listType,
    areaId = null
  ) => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages

    // Validate input fields
    if (!areaName || !title || !description) {
      setError("All fields are required");
      return;
    }

    // Create a new object to send the data, including the Base64 string for the image
    const requestData = {
      area_name: areaName,
      title: title,
      description: description,
      image: image || null, // Send the Base64 string or null if no image is selected
    };

    // Add area ID if it's an update request
    if (type === "update" && areaId) {
      requestData.id = areaId;
    }

    // Log the requestData for debugging

    console.log("Request Data:", requestData);

    try {
      // Send the request to the backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-area`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensure content type is set to JSON
          },
          body: JSON.stringify(requestData), // Send the data as JSON string
        }
      );

      const data = await response.json(); // Parse the JSON response

      if (response.ok) {
        handleShowSuccessToast("Location added successfully!");

        // Fetch the updated list of locations after adding the new location
        fetchLocations(setData);

        // Optionally, clear the form fields or reset the state
        setData((prevData) => ({
          ...prevData,
          newAreaName: "",
          newTitle: "",
          newDescription: "",
          newImage: null, // Reset the image
        }));
      } else {
        console.error("Error:", data.message);
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("An error occurred:", err);
      setError("An error occurred during submission");
    }
  };
  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };

  const handleShowErrorToast = (message) => {
    showToast(message, "error"); // Error toast
  };

  const handleShowWarningToast = (message) => {
    showToast(message, "warning"); // Warning toast
  };
  // Fetch locations and update state
  const fetchLocations = async (setData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area`
      );
      const data = await response.json();
      console.log("Fetched Locations:", data);
      setData((prevData) => ({ ...prevData, locations: data }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
      // Convert the image file to Base64 string using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        // Once conversion is complete, update the state with the Base64 string
        setData({ ...data, newImage: reader.result });
        console.log("Selected image (Base64):", reader.result); // Log the Base64 string for debugging
      };
      reader.readAsDataURL(file); // Read the file as Base64 string
    }
  };
  useEffect(() => {
    const authToken = localStorage.getItem("auth_token"); // Retrieve the token from localStorage

    // Function to fetch data from the backend
    const fetchData = async () => {
      try {
        // Set loading to true when the fetch starts

        // Fetch the data for each category
        const propertiesRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countproperties`
        );
        const propertiesData = await propertiesRes.json();

        const otherBuildingsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countotherbuildings`
        );
        const otherBuildingsData = await otherBuildingsRes.json();

        const condominiumsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countcondominiums`
        );
        const condominiumsData = await condominiumsRes.json();

        const locationsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countlocations`
        );
        const locationsData = await locationsRes.json();

        // Update the state with the fetched counts
        setCounts({
          properties: propertiesData.count || 0, // Use 0 if count is not available
          otherBuildings: otherBuildingsData.count || 0,
          condominiums: condominiumsData.count || 0,
          locations: locationsData.count || 0,
        });
        console.log("Updated counts:", {
          properties: propertiesData.count || 0,
          otherBuildings: otherBuildingsData.count || 0,
          condominiums: condominiumsData.count || 0,
          locations: locationsData.count || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch the data when the component mounts (page loads)
    fetchData();
  }, []);

  useEffect(() => {
    console.log(activeNav);
    if (activeNav === "DASHBOARD") {
      fetchCount(); // Fetch other data for "Details"
    } else if (activeNav === "STATUS") {
      fetchFormFiller_status(); // Fetch other data for "Details"
    } else if (activeNav === "LOCATION") {
      fetchFormFiller_location(); // Fetch other data for "Details"
    } else if (activeNav === "DEVELOPMENT TYPE") {
      fetchFormFiller_developmenttype(); // Fetch other data for "Details"
    } else if (activeNav === "ARCHITECTURAL THEME") {
      fetchFormFiller_architecturaltheme(); // Fetch other data for "Details"
    } else if (activeNav === "CHATBOT") {
      const fetchChatbotData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/getChatbot`
          );
          const chatbotData = await response.json();
          console.log(chatbotData);
          // Update chatbotEntries state
          setData((prevData) => ({
            ...prevData,
            chatbotEntries: chatbotData,
          }));
        } catch (error) {
          console.error("Error fetching chatbot data:", error);
        }
      };

      fetchChatbotData();
    } else if (activeNav === "CLIENT PROPERTY") {
      fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/submitted-properties`
      )
        .then((response) => response.json())
        .then((data) => {
          setSubmittedProperties(data); // Store the data in the state
        })
        .catch((error) => {
          console.error("Error fetching submitted properties:", error);
        });
    }
  }, [activeNav]);
  const fetchFormFiller_status = () => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/status`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Status:", data);
        setData((prevData) => ({ ...prevData, statusOptions: data }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  const fetchFormFiller_developmenttype = () => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/development-types`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Development Types:", data);
        setData((prevData) => ({ ...prevData, developmentTypes: data }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  const fetchFormFiller_architecturaltheme = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/architectural-themes`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Architectural Themes:", data);
        setData((prevData) => ({ ...prevData, architecturalThemes: data }));
      })

      .catch((error) => console.error("Error fetching data:", error));
  };
  const fetchFormFiller_location = () => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Locations:", data);
        setData((prevData) => ({ ...prevData, locations: data }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleAdd = (type, newItem, setData, field) => {
    console.log("Adding item:", newItem); // Log the new item being added
    console.log(type);
    // Check if we are adding a chatbot entry
    if (type === "chatbot") {
      const { question, answer } = newItem;

      // If we are editing an existing entry, use PUT instead of POST
      const method = isEditing ? "PUT" : "POST";
      console.log(method);
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/chatbot/${newItem.id}`
        : `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/addChatbot`;
      console.log(url);
      fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, answer }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Ensure the response contains success status and new item with id
          if (data.success) {
            handleShowSuccessToast(
              `${isEditing ? "Updated" : "Added"} chatbot entry successfully!`
            );

            // If adding a new entry, add the entry with id to the chatbotEntries array
            if (isEditing) {
              setData((prevData) => ({
                ...prevData,
                chatbotEntries: prevData.chatbotEntries.map((item) =>
                  item.id === newItem.id ? { ...item, question, answer } : item
                ),
              }));
            } else {
              const addedItem = { ...newItem, id: data.data.id }; // Ensure newItem includes id
              setData((prevData) => ({
                ...prevData,
                chatbotEntries: [...prevData.chatbotEntries, addedItem],
              }));
            }

            // Clear the input fields
            setChatbotFormData({ question: "", answer: "" });
          } else {
            console.error("Error response from API:", data.message);
          }

          fetchData(); // Optionally fetch the updated data
        })
        .catch((error) => {
          // Log the error if request fails
          console.error("Error adding/updating data:", error);
        });
    } else {
      // Existing logic for other types (e.g., developmentTypes, locations)
      fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItem }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Log success and update state
          if (data.success) {
            handleShowSuccessToast(`Item added successfully: ${newItem}`);

            // Update the data state by adding the new item to the appropriate field
            setData((prevData) => ({
              ...prevData,
              [field]: Array.isArray(prevData[field])
                ? [...prevData[field], { name: newItem }] // Add new item to array
                : [{ name: newItem }], // Initialize as an array if it was not an array
            }));

            // Clear the input after adding the new item
            if (field === "developmentTypes") {
              setData({ ...data, newType: "" });
            } else if (field === "architecturalThemes") {
              setData({ ...data, newTheme: "" });
            } else if (field === "statusOptions") {
              setData({ ...data, newStatus: "" });
            } else if (field === "locations") {
              setData({
                ...data,
                newAreaName: "",
                newTitle: "",
                newDescription: "",
                newImage: null,
              });
            }
          } else {
            handleShowSuccessToast("Added Successfully");
          }

          // Optionally, you can fetch the updated data
          fetchData();
        })
        .catch((error) => handleShowErrorToast("Error adding data:", error));
    }
  };
  const openModal2 = (filesArray) => {
    setModalImages(filesArray.map((file) => file.replace(/\\/g, "/"))); // Replace backslashes with forward slashes
    setModalIsOpen(true);
  };

  // Function to close the modal
  const closeModal2 = () => {
    setModalIsOpen(false);
    setModalImages([]);
  };
  const handleDelete = (type, id, field) => {
    console.log(type, id, field); // Debugging log to check the values

    // Handle deletion of chatbot entries separately
    if (type === "chatbot") {
      const url = `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/deleteChatbot/${id}`; // API endpoint for chatbot deletion
      console.log("Deleting from URL:", url);

      // Send DELETE request
      fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          // Check if the response is successful
          if (response.ok) {
            handleShowSuccessToast(`Deleted Successfully!`);
          } else {
            handleShowErrorToast(`Deletion Failed!`);
          }
          return response.json(); // Parse the JSON response
        })
        .then((data) => {
          console.log("Delete Response:", data);

          // Update state to remove the deleted chatbot entry
          setData((prevData) => {
            const updatedData = { ...prevData };

            // Ensure the field exists and is an array
            if (Array.isArray(prevData[field])) {
              updatedData[field] = prevData[field].filter(
                (item) => item.id !== id
              );
            }

            return updatedData; // Return updated state
          });
          handleShowSuccessToast("Chatbot entry deleted successfully."); // Optional: Notify user
        })
        .catch((error) => {
          console.error("Error deleting chatbot entry:", error);
          handleShowErrorToast(
            "An error occurred while deleting the chatbot entry."
          );
        });
    } else {
      // Existing logic for deleting other types (e.g., developmentTypes, locations)
      const url = `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/delete-${type}/${id}`;
      console.log("Deleting from URL:", url); // Debugging line to check the URL

      fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            handleShowSuccessToast(`Deleted Successfully: ${id}`);
          } else {
            handleShowErrorToast(`Deletion Failed: ${id}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data.message);

          // Update state by filtering out the deleted item from array fields
          setData((prevData) => {
            const updatedData = { ...prevData };

            if (Array.isArray(prevData[field])) {
              updatedData[field] = prevData[field].filter(
                (item) => item.id !== id
              );
            } else {
              updatedData[field] =
                prevData[field] === id ? "" : prevData[field];
            }

            // Reset the form values after deletion (for each field type)
            if (field === "developmentTypes") {
              updatedData.newType = "";
            } else if (field === "architecturalThemes") {
              updatedData.newTheme = "";
            } else if (field === "statusOptions") {
              updatedData.newStatus = "";
            } else if (field === "locations") {
              updatedData.newAreaName = "";
              updatedData.newTitle = "";
              updatedData.newDescription = "";
              updatedData.newImage = null;
            }

            return updatedData;
          });
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
          handleShowErrorToast("An error occurred while deleting the item.");
        });
    }
  };

  const handleInputChange_chatbot = (e) => {
    const { name, value } = e.target;
    setChatbotFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
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

        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userInfo", JSON.stringify(data.name));

        // Optional: Set token in a state or context if needed
        setAuthToken(data.token);
        setIsVisible(false);
        setisLoggedin(true);
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

  const handlePropertiesClick = () => {
    setShowProperties(!showProperties);
  };
  const fetchCount = async (endpoint, key) => {
    // Safely use localStorage inside useEffect
    const token = localStorage.getItem("auth_token"); // Get the token from localStorage
    console.log("Auth Token:", token);

    if (!token) {
      console.error("Token not found.");
      setError("Token not found.");
      return; // Exit if no token is found
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/${endpoint}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
            "Content-Type": "application/json", // Optional: specify the content type if needed
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCounts((prevCounts) => ({ ...prevCounts, [key]: data.count }));
      } else {
        console.error(`Error fetching ${key} count:`, data);
        setError(data.error || "Error fetching data.");
      }
    } catch (error) {
      console.error(`Fetch error for ${key}:`, error);
      setError("An unexpected error occurred while fetching data.");
    }
  };
  // UseEffect to fetch data after successful login
  useEffect(() => {
    const log = localStorage.getItem("isLoggedIn");
    if (log === "true") {
      fetchCount("countproperties", "properties");
      fetchCount("countotherbuildings", "otherBuildings");
      fetchCount("countcondominiums", "condominiums");
      fetchCount("countlocations", "locations");
    }
  });
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
      {isVisible && (
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

            {/* Log the admin email to the console */}
          </div>
        </div>
      )}

      <div className="flex fixed w-full">
        <div className="text-xl text-black w-1/6 relative border-r shadow-md bg-white z-50 items-center justify-center">
          <div className="text-center top-1/2 mt-20 ">
            <h1 className="text-4xl font-bold">
              <a href="/">Λ L V E O</a>
            </h1>
            <p style={{ fontSize: "10px" }}>
              an <b>AyalaLand </b>company
            </p>
          </div>

          <div className=" border-indigo-950 w-full">
            <nav className="p-6 z-50">
              <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-400"></div>
                <h1 className="text-sm px-3 text-gray-700">MENU</h1>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>

              <ul>
                {navItems_1.map((item) => (
                  <li
                    key={item.name}
                    onClick={() => {
                      setActiveNav(item.name);
                      item.onClick();
                    }}
                    className={`group cursor-pointer transition-all duration-300 rounded-lg ${
                      activeNav === item.name
                        ? "bg-indigo-100"
                        : "hover:bg-indigo-100"
                    }`}
                  >
                    <div
                      className={`flex items-center text-sm p-1 transition-all duration-300 ${
                        activeNav === item.name
                          ? "text-indigo-600"
                          : "text-gray-700 group-hover:text-indigo-600"
                      }`}
                    >
                      {/* Icon */}
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-3 h-3 mr-2" // Adjust size and spacing
                      />
                      {/* Name */}
                      {item.name}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
            <nav className="p-6 z-50">
              <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-400"></div>
                <h1 className="text-sm px-3 text-gray-700">MISC</h1>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>

              <ul>
                {navItems_2.map((item) => (
                  <li
                    key={item.name}
                    onClick={() => {
                      if (item.name === "FORM FILLER") {
                        // Check if FORM FILLER is already open
                        if (activeNav === "FORM FILLER") {
                          // Close FORM FILLER if it is already open
                          setActiveNav(null);
                        } else {
                          // Open FORM FILLER submenu
                          setActiveNav("FORM FILLER");
                        }
                      } else {
                        // For other items, update the activeNav and trigger their onClick behavior
                        setActiveNav(item.name);
                        item.onClick();
                      }
                    }}
                    className={`group cursor-pointer transition-all duration-300 rounded-lg ${
                      activeNav === item.name
                        ? "bg-indigo-100"
                        : "hover:bg-indigo-100"
                    }`}
                  >
                    <div
                      className={`flex items-center text-sm p-1 transition-all duration-300 ${
                        activeNav === item.name
                          ? "text-indigo-600"
                          : "text-gray-700 group-hover:text-indigo-600"
                      }`}
                    >
                      {/* Icon */}
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-3 h-3 mr-2" // Adjust size and spacing
                      />
                      {/* Name */}
                      {item.name}
                    </div>

                    {/* Conditional rendering for "FORM FILLER" submenu */}
                    {item.name === "FORM FILLER" &&
                      (activeNav === "FORM FILLER" ||
                        navItems_FormFiller.some(
                          (subItem) => activeNav === subItem.name
                        )) && (
                        <nav className="z-50 ml-2">
                          <ul>
                            {navItems_FormFiller.map((subItem) => (
                              <li
                                key={subItem.name}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent click event from affecting parent
                                  setActiveNav(subItem.name); // Update activeNav for submenu item
                                  subItem.onClick();
                                }}
                                className={`group cursor-pointer transition-all duration-300 rounded-lg text-sm ${
                                  activeNav === subItem.name
                                    ? "bg-blue-200"
                                    : "hover:bg-blue-200"
                                }`}
                              >
                                <div
                                  className={`flex items-center text-sm p-1 transition-all duration-300 ml-6 ${
                                    activeNav === subItem.name
                                      ? "bg-blue-200"
                                      : "text-gray-700 group-hover:text-indigo-600"
                                  }`}
                                >
                                  {/* Icon */}
                                  <img
                                    src={subItem.icon}
                                    alt={subItem.name}
                                    className="w-3 h-3 mr-2"
                                  />
                                  {/* Name */}
                                  {subItem.name}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className=" w-5/6">
          <header className="fixed top-0 left-0 w-full bg-white shadow-lg">
            <div className="flex justify-between items-center p-4">
              <div className="logosec text-center items-center">
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

          {/* <div className='main-container mt-24 p-4 ms-10 flex justify-center items-center'>
            <div className='main max-w-screen-xl mx-auto'>
              
            </div>
          </div> */}

          <div className="demo-container min-h-screen mt-14 w-11/12 mx-auto overflow-y-auto scrollbar-hidden  justify-center">
            {activeNav === "DASHBOARD" && (
              <>
                <div className="flex justify-center mt-10 h-20">
                  <div className="box-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-screen-xl">
                    {/* Box 1 */}
                    <div className="box bg-gray-50 p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                      <div className="text text-center flex flex-col items-center">
                        <div className="flex items-center mb-4">
                          <h2 className="topic-heading text-3xl font-semibold">
                            {counts.properties}
                          </h2>
                          <img
                            src="/assets/town.png"
                            alt="Views"
                            className="ml-4"
                            width={50}
                            height={50}
                          />
                        </div>
                        <h2 className="topic text-lg font-medium">
                          Properties
                        </h2>
                      </div>
                    </div>

                    {/* Box 2 */}
                    <div className="box bg-gray-50 p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                      <div className="text text-center flex flex-col items-center">
                        <div className="flex items-center mb-4">
                          <h2 className="topic-heading text-3xl font-semibold">
                            {counts.otherBuildings}
                          </h2>
                          <img
                            src="/assets/neighborhood.png"
                            alt="Other Buildings"
                            className="ml-4"
                            width={50}
                            height={50}
                          />
                        </div>
                        <h2 className="topic text-lg font-medium">
                          Other Buildings
                        </h2>
                      </div>
                    </div>

                    {/* Box 3 */}
                    <div className="box bg-gray-50 p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                      <div className="text text-center flex flex-col items-center">
                        <div className="flex items-center mb-4">
                          <h2 className="topic-heading text-3xl font-semibold">
                            {counts.condominiums}
                          </h2>
                          <img
                            src="/assets/skyline.png"
                            alt="Condominiums"
                            className="ml-4"
                            width={50}
                            height={50}
                          />
                        </div>
                        <h2 className="topic text-lg font-medium">
                          Condominiums
                        </h2>
                      </div>
                    </div>

                    {/* Box 4 */}
                    <div className="box bg-gray-50 p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                      <div className="text text-center flex flex-col items-center">
                        <div className="flex items-center mb-4">
                          <h2 className="topic-heading text-3xl font-semibold">
                            {counts.locations}
                          </h2>
                          <img
                            src="/assets/location.png"
                            alt="Locations"
                            className="ml-4"
                            width={50}
                            height={50}
                          />
                        </div>
                        <h2 className="topic text-lg font-medium">Locations</h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-fit relative">
                  <Chart />
                </div>
              </>
            )}

            {activeNav === "PROPERTIES" && (
              <div className="mt-20">
                <Demo />
              </div>
            )}
            {activeNav === "APPOINTMENTS" && (
              <div className="mt-20">
                <Appointment />
              </div>
            )}
            {activeNav === "CLIENT PROPERTY" && (
              <div className="mt-20">
                <div className="justify-center text-center text-3xl my-2">
                  <h1>CLIENT PROPERTIES</h1>
                </div>
                <div className="overflow-x-auto">
                  <table className="table-auto min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">First Name</th>
                        <th className="px-4 py-2">Last Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Phone</th>
                        <th className="px-4 py-2">Property Name</th>
                        <th className="px-4 py-2">Location</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Files</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submittedProperties.map((property) => {
                        // Parse the files field into an array
                        const filesArray = JSON.parse(property.files);

                        return (
                          <tr key={property.id}>
                            <td className="border px-4 py-2">
                              {property.first_name}
                            </td>
                            <td className="border px-4 py-2">
                              {property.last_name}
                            </td>
                            <td className="border px-4 py-2">
                              {property.email}
                            </td>
                            <td className="border px-4 py-2">
                              {property.phone}
                            </td>
                            <td className="border px-4 py-2">
                              {property.property_name}
                            </td>
                            <td className="border px-4 py-2">
                              {property.location}
                            </td>
                            <td className="border px-4 py-2">
                              {property.price}
                            </td>
                            <td className="border px-4 py-2">
                              {property.status}
                            </td>
                            <td className="border px-4 py-2">
                              {property.description}
                            </td>
                            <td className="border px-4 py-2">
                              {/* Button to show images in the modal */}
                              {filesArray.length > 0 && (
                                <button
                                  onClick={() => openModal2(filesArray)}
                                  className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                                >
                                  Show Images
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal for displaying images */}
            {modalIsOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded-lg w-1/3 h-auto overflow-x-auto flex items-center justify-center">
                  <button
                    onClick={closeModal2}
                    className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded p-2"
                  >
                    X
                  </button>
                  <div className="flex justify-center items-center w-full h-full">
                    {modalImages.map((image, index) => (
                      <img
                        key={index}
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${image}`} // Full URL to the image
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-contain" // Make image fill the container
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeNav === "DEVELOPMENT TYPE" && (
              <div className="h-[600px] overflow-y-auto mt-20">
                {/* Development Type */}
                <div className="h-80 overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">
                    Development Types
                  </h2>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="New Type Name"
                      value={data.newType}
                      onChange={(e) =>
                        setData({ ...data, newType: e.target.value })
                      }
                      className="border rounded p-2 w-full"
                    />
                    <button
                      onClick={() => {
                        handleAdd(
                          "development-type",
                          data.newType,
                          setData,
                          "developmentTypes"
                        );
                        setData({ ...data, newType: "" }); // Clear input after adding
                      }}
                      className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    >
                      Add
                    </button>
                  </div>
                  <ul>
                    {data.developmentTypes?.length > 0 ? (
                      data.developmentTypes.map((type) => (
                        <li
                          key={type.id}
                          className="flex justify-between p-2 border-b hover:bg-gray-100"
                        >
                          <span>{type.name}</span>
                          <button
                            onClick={() =>
                              handleDelete(
                                "development-type",
                                type.id,
                                "developmentTypes"
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>No Development Types Found</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeNav === "ARCHITECTURAL THEME" && (
              <div className="h-[600px] overflow-y-auto mt-20">
                {/* Architectural Theme */}
                <div className="h-80 overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">
                    Architectural Themes
                  </h2>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="New Theme Name"
                      value={data.newTheme}
                      onChange={(e) =>
                        setData({ ...data, newTheme: e.target.value })
                      }
                      className="border rounded p-2 w-full"
                    />
                    <button
                      onClick={() => {
                        handleAdd(
                          "architectural-theme",
                          data.newTheme,
                          setData,
                          "architecturalThemes"
                        );
                        setData({ ...data, newTheme: "" }); // Clear input after adding
                      }}
                      className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    >
                      Add
                    </button>
                  </div>
                  <ul>
                    {data.architecturalThemes?.length > 0 ? (
                      data.architecturalThemes.map((theme) => (
                        <li
                          key={theme.id}
                          className="flex justify-between p-2 border-b hover:bg-gray-100"
                        >
                          <span>{theme.name}</span>
                          <button
                            onClick={() =>
                              handleDelete(
                                "architectural-theme",
                                theme.id,
                                "architecturalThemes"
                              )
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>No Architectural Themes Found</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeNav === "STATUS" && (
              <div className="h-[600px] overflow-y-auto mt-20">
                {/* Status */}
                <div className="h-80 overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">Status</h2>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="New Status"
                      value={data.newStatus}
                      onChange={(e) =>
                        setData({ ...data, newStatus: e.target.value })
                      }
                      className="border rounded p-2 w-full"
                    />
                    <button
                      onClick={() => {
                        handleAdd(
                          "status",
                          data.newStatus,
                          setData,
                          "statusOptions"
                        );
                        setData({ ...data, newStatus: "" }); // Clear input after adding
                      }}
                      className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    >
                      Add
                    </button>
                  </div>
                  <ul>
                    {data.statusOptions?.length > 0 ? (
                      data.statusOptions.map((status) => (
                        <li
                          key={status.id}
                          className="flex justify-between p-2 border-b hover:bg-gray-100"
                        >
                          <span>{status.name}</span>
                          <button
                            onClick={() =>
                              handleDelete("status", status.id, "statusOptions")
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>No Status Options Found</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeNav === "LOCATION" && (
              <div className="h-[600px] overflow-y-auto mt-20">
                {/* Locations */}
                <div className="grid grid-cols-1 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Locations</h2>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder="Area Name"
                      value={data.newAreaName || ""}
                      onChange={(e) =>
                        setData({ ...data, newAreaName: e.target.value })
                      }
                      className="border rounded p-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Title"
                      value={data.newTitle || ""}
                      onChange={(e) =>
                        setData({ ...data, newTitle: e.target.value })
                      }
                      className="border rounded p-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={data.newDescription || ""}
                      onChange={(e) =>
                        setData({ ...data, newDescription: e.target.value })
                      }
                      className="border rounded p-2 w-full"
                    />
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="border rounded p-2 w-full"
                    />
                    <button
                      onClick={() => {
                        handleAddLoc(
                          "location",
                          data.newAreaName,
                          data.newTitle,
                          data.newDescription,
                          data.newImage,
                          setData,
                          "locations"
                        );
                      }}
                      className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    >
                      Add
                    </button>
                  </div>
                  {error && <p className="text-red-500 mb-4">{error}</p>}
                  {success && <p className="text-green-500 mb-4">{success}</p>}
                  <ul>
                    {data.locations?.length > 0 ? (
                      data.locations.map((location) => (
                        <li
                          key={location.id}
                          className="flex justify-between p-2 border-b hover:bg-gray-100"
                        >
                          <span>
                            {location.area_name} - {location.title}
                          </span>
                          <button
                            onClick={() =>
                              handleDelete("location", location.id, "locations")
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>No Locations Found</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeNav === "CHATBOT" && (
              <div className="p-6 w-full bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                  Chatbot Table
                </h3>

                <table className="w-full table-auto mb-8 border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600">
                        Question
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600">
                        Answer
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-white bg-indigo-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.chatbotEntries && data.chatbotEntries.length > 0 ? (
                      data.chatbotEntries.map((item) => (
                        <tr
                          key={item.id || `${item.question}-${item.answer}`}
                          className="hover:bg-gray-100"
                        >
                          <td className="px-4 py-2 text-sm text-gray-800">
                            {item.id}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            {item.question}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            {item.answer}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            <button
                              className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-500"
                              onClick={() =>
                                handleDelete(
                                  "chatbot",
                                  item.id,
                                  "chatbotEntries"
                                )
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-4 py-2 text-center text-sm text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    {isEditing ? "Edit" : "Add"} Chatbot Entry
                  </h4>

                  <div className="space-y-4">
                    <input
                      type="text"
                      name="question"
                      value={chatbotFormData.question}
                      onChange={handleInputChange_chatbot}
                      placeholder="Enter question"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      name="answer"
                      value={chatbotFormData.answer}
                      onChange={handleInputChange_chatbot}
                      placeholder="Enter answer"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      className={`w-1/2 mt-10 py-3 text-white rounded-md ${
                        isEditing
                          ? "bg-indigo-600 hover:bg-indigo-500"
                          : "bg-green-600 hover:bg-green-500"
                      }`}
                      onClick={() =>
                        handleAdd(
                          "chatbot",
                          {
                            question: chatbotFormData.question,
                            answer: chatbotFormData.answer,
                          },
                          setData,
                          "chatbotEntries"
                        )
                      }
                    >
                      {isEditing ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
      </div>
    </>
  );
}
