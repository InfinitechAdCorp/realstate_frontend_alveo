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
import { TiThMenu } from "react-icons/ti";
import Demo from "./../properties/page";
import Header from "../pages/header";
import AreaModal from "@/components/admin/areaModal";
import Appointment from "@/components/admin/appointments";
import SubmittedProperties from "@/components/admin/submittedProperties";
import Slider from "react-slick";
import Testimonial from "@/app/pages/testimonial/page";
import { jsPDF } from "jspdf";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Cookies from "js-cookie";
export default function Admin({}) {
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const [showProperties, setShowProperties] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Controls visibility of popup
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true); // Set loading state to true initially

  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // To track OTP sent state
  const [isLoggedIn, setIsLoggedin] = useState(false); // To track OTP sent state
  const [submittedProperties, setSubmittedProperties] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [authToken, setAuthToken] = useState([]); // State to store fetched data from API
  const [properties, setProperties] = useState([]); // State to store fetched data from API

  const typeValidationSchema = Yup.object({
    newType: Yup.string()
      .required("Type name is required")
      .min(3, "Type name must be at least 3 characters")
      .max(50, "Type name can't be longer than 50 characters"),
  });
  const themeValidationSchema = Yup.object({
    newTheme: Yup.string()
      .required("Theme name is required") // Ensure the theme name is provided
      .min(3, "Theme name must be at least 3 characters") // Optional: Validate length
      .max(50, "Theme name must be at most 50 characters"), // Optional: Validate max length
  });
  // For newStatus form
  const statusValidationSchema = Yup.object({
    newStatus: Yup.string()
      .required("Status name is required")
      .min(3, "Status name must be at least 3 characters")
      .max(50, "Status name can't be longer than 50 characters"),
  });
  const locationValidationSchema = Yup.object({
    newAreaName: Yup.string()
      .required("Area name is required")
      .min(3, "Area name must be at least 3 characters")
      .max(50, "Area name can't be longer than 50 characters"),
    newTitle: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title can't be longer than 50 characters"),
    newDescription: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(200, "Description can't be longer than 200 characters"),
  });

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
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isAreaModalOpen, setAreaModalOpen] = useState(false);

  // Functions to open the respective modals
  const openDevelopmentTypeModal = () => setDevelopmentTypeModalOpen(true);
  const openArchitecturalThemeModal = () =>
    setArchitecturalThemeModalOpen(true);

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
  const [themeModalOpen, setThemeModalOpen] = useState(false); // Modal state for Architectural Theme

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
    {
      name: "TESTIMONIALS",
      onClick: () => setActiveNav("TESTIMONIAL"),
      icon: "/assets/review.png",
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
      name: "DEVELOPMENT TYPE",
      onClick: () => setActiveNav("DEVELOPMENT TYPE"),
      icon: "/assets/turn-right.png",
    },
    {
      name: "STATUS",
      onClick: () => setActiveNav("STATUS"),
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
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("auth_token");

    // If no auth_token is found in localStorage, redirect to login
    if (!isLoggedIn) {
      router.push("/auth");
    }
  }, [router]);
  // useEffect(() => {
  //   const checkLoginStatus = () => {
  //     const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  //     if (!isLoggedIn && window.location.pathname === "/admin") {
  //       window.location.replace("/auth");
  //     }

  //     setLoading(false); // After the check, set loading to false
  //   };

  //   // Perform the login status check immediately
  //   checkLoginStatus();
  // }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // // Display loading state while checking the login status

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdownCanvas = () => {
    setIsCanvasOpen(!isCanvasOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("isLoggedIn");
    window.location.reload(); // You can redirect or reload the page after logging out
  };
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
    setError("");
    setSuccess("");
    if (!areaName || !title || !description) {
      setError("All fields are required");
      return;
    }
    const formData = new FormData();
    formData.append("area_name", areaName);
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    // Add area ID if it's an update request
    if (type === "update" && areaId) {
      formData.append("id", areaId);
    }
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-area`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header with token
          },
          body: formData, // Send the formData
        }
      );
      const data = await response.json();
      if (response.ok) {
        handleShowSuccessToast("Location added successfully!");
        // Fetch the updated list of locations after adding the new location
        fetchFormFiller_location(setData);
        // Reset form data
        setData((prevData) => ({
          ...prevData,
          newAreaName: "",
          newTitle: "",
          newDescription: "",
          newImage: null,
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
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, newImage: file });
    }
  };
  useEffect(() => {
    // Make sure user is logged in and token is available
    const storedToken = localStorage.getItem("auth_token");
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    setAuthToken(storedToken);
    if (!storedToken || storedLoginStatus !== "true") {
      console.error("User is not logged in or token not found.");
      return; // Don't proceed if not logged in
    }

    // Update state variables after checking login status
    setAuthToken(storedToken); // Ensure token is available in the state
    setIsLoggedin(storedLoginStatus === "true"); // Set login state if necessary

    const fetchData = async () => {
      try {
        // Fetch the data for each category
        const propertiesRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countproperties`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`, // Use the stored token
              "Content-Type": "application/json",
            },
          }
        );
        const propertiesData = await propertiesRes.json();

        const otherBuildingsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countotherbuildings`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const otherBuildingsData = await otherBuildingsRes.json();

        const condominiumsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countcondominiums`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const condominiumsData = await condominiumsRes.json();

        const locationsRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/countlocations`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const locationsData = await locationsRes.json();

        // Update the state with the fetched counts
        setCounts({
          properties: propertiesData.count || 0,
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

    fetchData(); // Call fetchData after setting the token
  }, [isLoggedIn, authToken]); // Depend on isLoggedIn and authToken

  const exportData = () => {
    const doc = new jsPDF();
    let y = 20; // Starting y value for the first line

    // Title of the PDF
    doc.setFontSize(18);
    doc.text("CLIENT PROPERTIES", 14, y);
    y += 15; // Increase y for spacing below the title

    // Table headers
    doc.setFontSize(12);
    doc.text("First Name", 14, y);
    doc.text("Last Name", 40, y);
    doc.text("Email", 70, y);
    doc.text("Phone", 120, y);
    doc.text("Property Name", 150, y);
    doc.text("Location", 190, y);
    doc.text("Price", 230, y);
    doc.text("Status", 260, y);
    doc.text("Description", 290, y);
    doc.text("Files", 340, y);
    y += 10; // Space after the header row

    // Table content
    submittedProperties.forEach((property) => {
      doc.setFontSize(10);

      // Print each data point in the corresponding column
      doc.text(property.first_name, 14, y);
      doc.text(property.last_name, 40, y);
      doc.text(property.email, 70, y);
      doc.text(property.phone, 120, y);
      doc.text(property.property_name, 150, y);
      doc.text(property.location, 190, y);
      doc.text(property.price, 230, y);
      doc.text(property.status, 260, y);
      doc.text(property.description, 290, y);
      const filesArray = JSON.parse(property.files);
      doc.text(
        filesArray.length > 0 ? filesArray.join(", ") : "No files",
        340,
        y
      );

      y += 10; // Space between rows

      // Add a new page if content exceeds page height
      if (y > 270) {
        doc.addPage();
        y = 20; // Reset y for new page
      }
    });

    // Save the PDF
    doc.save("client_properties.pdf");
  };

  useEffect(() => {
    const Token = localStorage.getItem("auth_token");
    const LoginStatus = localStorage.getItem("isLoggedIn");

    if (activeNav === "DASHBOARD") {
      fetchCount("countproperties", "properties");
      fetchCount("countotherbuildings", "otherBuildings");
      fetchCount("countcondominiums", "condominiums");
      fetchCount("countlocations", "locations");
    } else if (activeNav === "STATUS") {
      fetchFormFiller_status(Token); // Fetch other data for "Details"
    } else if (activeNav === "LOCATION") {
      fetchFormFiller_location(Token); // Fetch other data for "Details"
    } else if (activeNav === "DEVELOPMENT TYPE") {
      fetchFormFiller_developmenttype(Token); // Fetch other data for "Details"
    } else if (activeNav === "ARCHITECTURAL THEME") {
      fetchFormFiller_architecturaltheme(Token); // Fetch other data for "Details"
    } else if (activeNav === "TESTIMONIAL") {
      console.log(true);
    } else if (activeNav === "CHATBOT") {
      const fetchChatbotData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/getChatbot`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Token}`, // Apply token here
              },
            }
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
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/submitted-properties`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`, // Apply token here
          },
        }
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
  const fetchFormFiller_status = (token) => {
    console.log(token);
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Status:", data);
        setData((prevData) => ({ ...prevData, statusOptions: data }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const fetchFormFiller_developmenttype = (token) => {
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/development-types`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Development Types:", data);
        setData((prevData) => ({ ...prevData, developmentTypes: data }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const fetchFormFiller_architecturaltheme = (token) => {
    fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/architectural-themes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Architectural Themes:", data);
        setData((prevData) => ({ ...prevData, architecturalThemes: data }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const fetchFormFiller_location = () => {
    const token = localStorage.getItem("auth_token");
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Locations:", data);
        setData((prevData) => ({
          ...prevData,
          locations: data, // Update the locations state
        }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleAdd = (type, newItem, setData, field) => {
    console.log("Adding item:", newItem); // Log the new item being added
    console.log(type);
    const Token = localStorage.getItem("auth_token"); // Retrieve the token
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
          Authorization: `Bearer ${Token}`, // Include the token
        },
        body: JSON.stringify({ question, answer }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Ensure the response contains success status and new item with id
          if (data.success) {
            handleShowSuccessToast(
              `${isEditing ? "Updated" : "Added"} chatbot entry successfully!`,
              "success"
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

      if (!Token) {
        handleShowErrorToast("Authorization token is missing!");
        return;
      }

      fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/add-${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`, // Include the token
        },
        body: JSON.stringify({ name: newItem }), // Send new item data
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to add ${type}: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Add Response:", data);

          if (data?.success || data?.message) {
            handleShowSuccessToast(
              `${type.toUpperCase()} added successfully!`,
              "success"
            );

            // Update the state to add the new item
            setData((prevData) => ({
              ...prevData,
              [field]: Array.isArray(prevData[field])
                ? [
                    ...prevData[field],
                    { id: data.id || Date.now(), name: newItem },
                  ] // Use API `id` or fallback to `Date.now`
                : [{ id: data.id || Date.now(), name: newItem }],
            }));
          } else {
            handleShowErrorToast("Failed to add the item. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error adding item:", error);
          handleShowErrorToast("An error occurred while adding the item.");
        });
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
    const Token = localStorage.getItem("auth_token"); // Retrieve the token from localStorage

    if (!Token) {
      handleShowErrorToast("Authorization token is missing!");
      return;
    }
    // Handle deletion of chatbot entries separately
    if (type === "chatbot") {
      const url = `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/deleteChatbot/${id}`; // API endpoint for chatbot deletion
      console.log("Deleting from URL:", url);

      fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`, // Include the token
        },
      })
        .then((response) => {
          handleShowSuccessToast(`Deleted Successfully!`);

          return response.json(); // Parse the JSON response
        })
        .then((data) => {
          console.log("Delete Response:", data);
          setData((prevData) => {
            const updatedData = { ...prevData };
            if (Array.isArray(prevData[field])) {
              updatedData[field] = prevData[field].filter(
                (item) => item.id !== id
              );
            }
            return updatedData;
          });
          handleShowSuccessToast("Chatbot entry deleted successfully."); // Notify user
        })
        .catch((error) => {
          console.error("Error deleting chatbot entry:", error);
          handleShowErrorToast(
            "An error occurred while deleting the chatbot entry."
          );
        });
    } else {
      // Existing logic for deleting other types
      const url = `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/delete-${type}/${id}`;
      console.log("Deleting from URL:", url); // Debugging line to check the URL
      fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`, // Include the token
        },
      })
        .then((response) => {
          handleShowSuccessToast(`Deleted Successfully!`);

          return response.json();
        })
        .then((data) => {
          console.log(data.message);
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

        // Clear localStorage first to ensure it's clean before setting new login data
        localStorage.clear();

        // Store the token and other user data in localStorage
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userInfo", JSON.stringify(data.name));

        // Update the necessary states
        setAuthToken(data.token);
        setIsLoggedin(true); // Ensure isLoggedin is set to true

        // Set visibility or other UI-related states if needed
        setIsVisible(false);

        // No need to reload the page, just trigger any required side effects
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
    console.log(endpoint);
    const token = localStorage.getItem("auth_token");
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
    const token = localStorage.getItem("auth_token"); // Get the token from localStorage

    if (!token) {
      console.error("Token not found.");
      setError("Token not found.");
      return; // Exit if no token is found
    } else {
      if (log === "true") {
        console.log(token, log);
        setIsVisible(false);
        // Call the fetchCount function for each category, passing the appropriate endpoint and state key
        fetchCount("countproperties", "properties");
        fetchCount("countotherbuildings", "otherBuildings");
        fetchCount("countcondominiums", "condominiums");
        fetchCount("countlocations", "locations");
      } else {
        console.error("User is not logged in or token not found.");
      }
    }
  }, []);
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

    setAreaModalOpen(false);
  };
  useEffect(() => {
    // Check login status from cookies or localStorage
    const token = Cookies.get("auth_token");
    const loginStatus = token ? true : false;

    if (loginStatus) {
      setIsLoggedin(true);
      setLoading(false); // Hide loading screen if the user is logged in
    } else {
      setIsLoggedin(false);
      setLoading(false); // Still set loading to false if not logged in, to stop loading screen
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <p></p>
      </div>
    );
  }

  return (
    <>
      {/* {isVisible && (
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
      )} */}

      <div className="flex fixed w-full">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-black text-white shadow-md transition-transform duration-300 z-40 ${
            isCanvasOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:w-1/6`}
          style={{
            backgroundImage: `url('/assets/sidebar.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-center mt-14">
            <h1 className="font-bold text-5xl md:text-4xl sm:text-3xl">
              <a href="/admin">Λ L V E O</a>
            </h1>
            <p className="text-base md:text-sm sm:text-xs mt-2">
              an <b>AyalaLand</b> company
            </p>
          </div>

          <div className="mt-6">
            <nav className="p-6">
              <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-400"></div>
                <h1 className="text-sm px-3">MENU</h1>
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
                      activeNav === item.name ? "bg-white" : "hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`flex items-center text-sm p-1 ${
                        activeNav === item.name
                          ? "text-black"
                          : "text-white group-hover:text-black"
                      }`}
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-3 h-3 mr-2"
                      />
                      {item.name}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="p-6">
              <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-400"></div>
                <h1 className="text-sm px-3">MISC</h1>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>
              <ul>
                {navItems_2.map((item) => (
                  <li
                    key={item.name}
                    onClick={() => {
                      if (item.name === "FORM FILLER") {
                        setActiveNav(
                          activeNav === "FORM FILLER" ? null : "FORM FILLER"
                        );
                      } else {
                        setActiveNav(item.name);
                        item.onClick();
                      }
                    }}
                    className={`group cursor-pointer transition-all duration-300 rounded-lg ${
                      activeNav === item.name ? "bg-white" : "hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`flex items-center text-sm p-1 ${
                        activeNav === item.name
                          ? "text-black"
                          : "text-white group-hover:text-black"
                      }`}
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-3 h-3 mr-2"
                      />
                      {item.name}
                    </div>

                    {/* Submenu for "FORM FILLER" */}
                    {item.name === "FORM FILLER" &&
                      activeNav === "FORM FILLER" && (
                        <nav className="ml-4">
                          <ul>
                            {navItems_FormFiller.map((subItem) => (
                              <li
                                key={subItem.name}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveNav(subItem.name);
                                  subItem.onClick();
                                }}
                                className={`group cursor-pointer transition-all duration-300 rounded-lg text-sm ${
                                  activeNav === subItem.name
                                    ? "bg-blue-200"
                                    : "hover:bg-blue-200"
                                }`}
                              >
                                <div
                                  className={`flex items-center text-sm p-1 ${
                                    activeNav === subItem.name
                                      ? "text-black"
                                      : "text-black group-hover:text-black"
                                  }`}
                                >
                                  <img
                                    src={subItem.icon}
                                    alt={subItem.name}
                                    className="w-3 h-3 mr-2"
                                  />
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

        {isCanvasOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsCanvasOpen(false)}
          ></div>
        )}

        <div
          className={`w-[90%] p-4 h-screen   ${
            isCanvasOpen ? "ml-64" : "ml-0"
          } md:ml-64`}
        >
          <header className="fixed top-0 left-0 w-full bg-white shadow-lg">
            <div className="flex justify-between items-center p-4">
              <div className="flex justify-between items-center px-4">
                <div className="logosec text-center flex-grow">
                  <a href="/admin">
                    <div className="logo cursor-pointer text-darkblue font-semibold text-lg">
                      ALVEO LAND
                    </div>
                  </a>
                </div>
              </div>

              <div className="message flex items-center space-x-4">
                <div
                  className={`circle w-4 h-4 rounded-full ${
                    authToken ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/8.png"
                  className="icn"
                  alt="message-icon"
                  width={20}
                  height={20}
                />
                <div
                  className="message flex items-center space-x-4 relative"
                  onMouseEnter={() => setIsOpen(true)}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      setIsOpen(false);
                    }, 1500); // 5-second delay before closing
                  }}
                >
                  <img
                    src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png"
                    className="dpicn rounded-full"
                    alt="profile"
                    width={40}
                    height={40}
                  />

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute  -right-2 mt-32 w-40 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                      {/* Arrow above the dropdown */}
                      <div className="absolute top-[-8px] right-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white"></div>

                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-gray-800 w-full text-left rounded-lg hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Hamburger button */}
              {!isCanvasOpen && (
                <button
                  className="md:hidden p-2 bg-customBlue text-white "
                  onClick={() => setIsCanvasOpen(!isCanvasOpen)}
                >
                  <TiThMenu />
                </button>
              )}
            </div>
          </header>
          <div className="demo-container min-h-screen mt-14 w-11/12 mx-auto overflow-y-auto scrollbar-hidden  justify-center">
            {activeNav === "DASHBOARD" && (
              <>
                {/* Grid Container */}
                <div className="flex justify-center mt-10">
                  <div className="box-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full px-4 sm:px-8 max-w-screen-xl">
                    {/* Box 1 */}
                    <div className="box bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                      <div className="text text-center flex flex-col items-center">
                        <div className="flex items-center mb-2 sm:mb-4 justify-center">
                          <h2 className="topic-heading text-2xl sm:text-3xl font-semibold">
                            {counts.properties}
                          </h2>
                          <img
                            src="/assets/town.png"
                            alt="Views"
                            className="ml-2 sm:ml-4"
                            width={40}
                            height={40}
                          />
                        </div>
                        <h2 className="topic text-sm sm:text-lg font-medium">
                          Properties
                        </h2>
                      </div>
                    </div>

                    {/* Box 2 */}
                    <div className="box bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                      <div className="text text-center flex flex-col items-center">
                        <div className="flex items-center mb-2 sm:mb-4 justify-center">
                          <h2 className="topic-heading text-2xl sm:text-3xl font-semibold">
                            {counts.otherBuildings}
                          </h2>
                          <img
                            src="/assets/neighborhood.png"
                            alt="Other Buildings"
                            className="ml-2 sm:ml-4"
                            width={40}
                            height={40}
                          />
                        </div>
                        <h2 className="topic text-sm sm:text-lg font-medium">
                          Other Buildings
                        </h2>
                      </div>
                    </div>

                    {/* Box 3 */}
                    <div className="box bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                      <div className="text text-center flex flex-col items-center">
                        <div className="flex items-center mb-2 sm:mb-4 justify-center">
                          <h2 className="topic-heading text-2xl sm:text-3xl font-semibold">
                            {counts.condominiums}
                          </h2>
                          <img
                            src="/assets/skyline.png"
                            alt="Condominiums"
                            className="ml-2 sm:ml-4"
                            width={40}
                            height={40}
                          />
                        </div>
                        <h2 className="topic text-sm sm:text-lg font-medium">
                          Condominiums
                        </h2>
                      </div>
                    </div>

                    {/* Box 4 */}
                    <div className="box bg-gray-50 p-4 sm:p-6 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out">
                      <div className="text text-center flex flex-col items-center">
                        <div className="flex items-center mb-2 sm:mb-4 justify-center">
                          <h2 className="topic-heading text-2xl sm:text-3xl font-semibold">
                            {counts.locations}
                          </h2>
                          <img
                            src="/assets/location.png"
                            alt="Locations"
                            className="ml-2 sm:ml-4"
                            width={40}
                            height={40}
                          />
                        </div>
                        <h2 className="topic text-sm sm:text-lg font-medium">
                          Locations
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Section */}
                <div className="mt-8 px-4">
                  <Chart data={isLoggedIn} />
                </div>
              </>
            )}
            {activeNav === "TESTIMONIAL" && (
              <div className="mt-20">
                <Testimonial />
              </div>
            )}
            {activeNav === "PROPERTIES" && (
              <div className="mt-20">
                <Demo data={isLoggedIn} />
              </div>
            )}
            {activeNav === "APPOINTMENTS" && (
              <div className="mt-20">
                <Appointment />
              </div>
            )}
            {activeNav === "CLIENT PROPERTY" && (
              <div className="mt-20">
                <div className="justify-center text-center text-3xl my-2 mb-3">
                  <h1 className="text-customBlue">CLIENT PROPERTIES</h1>
                </div>
                <div className="text-center mb-4">
                  <button
                    onClick={exportData}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Export Data
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="table-auto border-collapse border border-gray-200 w-full text-sm text-left text-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border border-gray-200">
                          First Name
                        </th>
                        <th className="px-4 py-2 border border-gray-200">
                          Last Name
                        </th>
                        <th className="px-4 py-2 border border-gray-200">
                          Email
                        </th>
                        <th className="px-4 py-2 border border-gray-200">
                          Phone
                        </th>
                        <th className="px-4 py-2 border border-gray-200">
                          Property Name
                        </th>
                        <th className="px-4 py-2 border border-gray-200">
                          Location
                        </th>
                        <th className="px-4 py-2 border border-gray-200">
                          Price
                        </th>
                        <th className="px-4 py-2 border border-gray-200">
                          Status
                        </th>
                        <th className="px-4 py-2 border border-gray-200">
                          Description
                        </th>
                        <th className="px-4 py-2 border border-gray-200">
                          Files
                        </th>
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
                <div className="bg-white p-4 rounded-lg w-full max-w-3xl h-auto overflow-hidden flex items-center justify-center relative">
                  <button
                    onClick={closeModal2}
                    className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 rounded-full p-2"
                  >
                    X
                  </button>
                  <div className="flex justify-center items-center w-full h-full overflow-x-auto">
                    {modalImages.map((image, index) => (
                      <img
                        key={index}
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${image}`} // Full URL to the image
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-contain max-h-[80vh]" // Maintain aspect ratio and scale with max height
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeNav === "DEVELOPMENT TYPE" && (
              <div className=" overflow-y-auto mt-20">
                <div className=" overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Development Types</h2>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    >
                      Add Development Type
                    </button>
                  </div>
                  <ul className="h-[700px] overflow-y-auto">
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

            {/* Modal for Adding Development Type */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                  <h2 className="text-xl font-semibold mb-4">
                    Add Development Type
                  </h2>
                  <Formik
                    initialValues={{ newType: data.newType }}
                    validationSchema={typeValidationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      handleAdd(
                        "development-type",
                        values.newType,
                        setData,
                        "developmentTypes"
                      );
                      setData({ newType: "" }); // Clear input
                      setIsModalOpen(false);
                      setSubmitting(false);
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Field
                          type="text"
                          name="newType"
                          placeholder="New Type Name"
                          className="border rounded p-2 w-full mb-4"
                        />
                        <ErrorMessage
                          name="newType"
                          component="div"
                          className="text-red-500 text-sm mb-2"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                          >
                            {isSubmitting ? "Adding..." : "Add"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            )}

            {activeNav === "ARCHITECTURAL THEME" && (
              <div className="max-h-[80%] overflow-y-auto mt-20">
                <div className="">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      Architectural Themes
                    </h2>
                    <button
                      onClick={() => setThemeModalOpen(true)} // Open modal when clicked
                      className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    >
                      Add Theme
                    </button>
                  </div>

                  <ul className="h-[700px] overflow-y-auto">
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

            {/* Modal for Adding Architectural Theme */}
            {/* Modal for Adding New Architectural Theme */}
            {themeModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                  <h2 className="text-xl font-semibold mb-4">
                    Add New Architectural Theme
                  </h2>
                  <Formik
                    initialValues={{
                      newTheme: data.newTheme || "",
                    }}
                    validationSchema={themeValidationSchema} // Exclude validation for the file or image fields if applicable
                    onSubmit={(values, { setSubmitting }) => {
                      handleAdd(
                        "architectural-theme",
                        values.newTheme, // Only send the theme name
                        setData,
                        "architecturalThemes"
                      );
                      setData({ ...data, newTheme: "" });
                      setThemeModalOpen(false); // Close modal after adding
                      setSubmitting(false);
                    }}
                  >
                    {({ values, handleChange, handleBlur, isSubmitting }) => (
                      <Form>
                        {/* Theme Name */}
                        <Field
                          type="text"
                          name="newTheme"
                          placeholder="New Theme Name"
                          value={values.newTheme}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded p-2 w-full mb-4"
                        />
                        <ErrorMessage
                          name="newTheme"
                          component="div"
                          className="text-red-500 text-sm mb-2"
                        />

                        <div className="flex justify-end gap-2">
                          {/* Cancel Button */}
                          <button
                            type="button"
                            onClick={() => setThemeModalOpen(false)} // Close modal
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                          {/* Add Button */}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                          >
                            {isSubmitting ? "Adding..." : "Add"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>

                  {success && <p className="text-green-500 mt-4">{success}</p>}
                </div>
              </div>
            )}

            {activeNav === "STATUS" && (
              <div className="overflow-y-auto mt-20">
                <div className="overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Status</h2>
                    <button
                      onClick={() => setIsStatusModalOpen(true)}
                      className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    >
                      Add Status
                    </button>
                  </div>
                  <ul className="h-[700px] overflow-y-auto">
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

            {/* Modal for Adding Status */}

            {isStatusModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                  <h2 className="text-xl font-semibold mb-4">Add New Status</h2>
                  <Formik
                    initialValues={{ newStatus: data.newStatus || "" }}
                    validationSchema={statusValidationSchema} // Updated schema here
                    onSubmit={(values, { setSubmitting }) => {
                      handleAdd(
                        "status",
                        values.newStatus,
                        setData,
                        "statusOptions"
                      );
                      setData({ newStatus: "" }); // Clear input
                      setIsStatusModalOpen(false);
                      setSubmitting(false);
                    }}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Field
                          type="text"
                          name="newStatus"
                          placeholder="New Status"
                          className="border rounded p-2 w-full mb-4"
                        />
                        <ErrorMessage
                          name="newStatus"
                          component="div"
                          className="text-red-500 text-sm mb-2"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsStatusModalOpen(false)}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                          >
                            {isSubmitting ? "Adding..." : "Add"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            )}
            {activeNav === "LOCATION" && (
              <div className="h-[600px] overflow-y-auto mt-20 px-4 sm:px-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4">
                    Locations
                  </h2>
                  <button
                    onClick={() => setLocationModalOpen(true)} // Open modal when clicked
                    className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                  >
                    Add Location
                  </button>
                </div>
                <ul className="h-[700px] overflow-y-auto">
                  {data.locations?.length > 0 ? (
                    data.locations.map((location) => (
                      <li
                        key={location.id}
                        className="flex flex-col sm:flex-row justify-between p-2 border-b hover:bg-gray-100"
                      >
                        <span className="text-sm sm:text-base">
                          {location.area_name} - {location.title}
                        </span>
                        <button
                          onClick={() =>
                            handleDelete("location", location.id, "locations")
                          }
                          className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
                        >
                          Delete
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm sm:text-base">No Locations Found</li>
                  )}
                </ul>
              </div>
            )}

            {/* Modal for Adding Location */}
            {/* Modal for Adding Location */}
            {locationModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                  <h2 className="text-xl font-semibold mb-4">
                    Add New Location
                  </h2>
                  <Formik
                    initialValues={{
                      newAreaName: data.newAreaName || "",
                      newTitle: data.newTitle || "",
                      newDescription: data.newDescription || "",
                    }}
                    validationSchema={locationValidationSchema} // Excludes file field from validation
                    onSubmit={(values, { setSubmitting }) => {
                      handleAddLoc(
                        "location",
                        values.newAreaName,
                        values.newTitle,
                        values.newDescription,
                        data.newImage, // Handle image separately
                        setData,
                        "locations"
                      );
                      setData({
                        ...data,
                        newAreaName: "",
                        newTitle: "",
                        newDescription: "",
                        newImage: null,
                      });
                      setLocationModalOpen(false); // Close modal after adding
                      setSubmitting(false);
                    }}
                  >
                    {({ values, handleChange, handleBlur, isSubmitting }) => (
                      <Form>
                        {/* Area Name */}
                        <Field
                          type="text"
                          name="newAreaName"
                          placeholder="Area Name"
                          value={values.newAreaName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded p-2 w-full mb-4"
                        />
                        <ErrorMessage
                          name="newAreaName"
                          component="div"
                          className="text-red-500 text-sm mb-2"
                        />

                        {/* Title */}
                        <Field
                          type="text"
                          name="newTitle"
                          placeholder="Title"
                          value={values.newTitle}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded p-2 w-full mb-4"
                        />
                        <ErrorMessage
                          name="newTitle"
                          component="div"
                          className="text-red-500 text-sm mb-2"
                        />

                        {/* Description */}
                        <Field
                          type="text"
                          name="newDescription"
                          placeholder="Description"
                          value={values.newDescription}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded p-2 w-full mb-4"
                        />
                        <ErrorMessage
                          name="newDescription"
                          component="div"
                          className="text-red-500 text-sm mb-2"
                        />

                        {/* File Upload (no validation) */}
                        <input
                          type="file"
                          onChange={(e) => handleImageChange(e)} // handle image change
                          className="border rounded p-2 w-full mb-4"
                        />

                        <div className="flex justify-end gap-2">
                          {/* Cancel Button */}
                          <button
                            type="button"
                            onClick={() => setLocationModalOpen(false)} // Close modal
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                          {/* Add Button */}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                          >
                            {isSubmitting ? "Adding..." : "Add"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>

                  {success && <p className="text-green-500 mt-4">{success}</p>}
                </div>
              </div>
            )}

            {activeNav === "CHATBOT" && (
              <div className="h-[600px] overflow-y-auto mt-20">
                {/* Chatbot Entries */}
                <div className="h-80 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Chatbot Entries</h2>
                    <button
                      onClick={() => setIsChatbotModalOpen(true)}
                      className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    >
                      Add Chatbot Entry
                    </button>
                  </div>
                  <ul className="h-[700px] overflow-y-auto">
                    {data.chatbotEntries?.length > 0 ? (
                      data.chatbotEntries.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between p-2 border-b hover:bg-gray-100"
                        >
                          <div>
                            <h5 className="font-semibold">{item.question}</h5>
                            <p className="text-sm text-gray-600">
                              {item.answer}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleDelete("chatbot", item.id, "chatbotEntries")
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>No Chatbot Entries Found</li>
                    )}
                  </ul>
                </div>

                {/* Modal for Adding/Editing Chatbot Entry */}
                {isChatbotModalOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                      <h2 className="text-xl font-semibold mb-4">
                        {isEditing ? "Edit" : "Add"} Chatbot Entry
                      </h2>
                      <div className="space-y-4">
                        {/* Question Input */}
                        <input
                          type="text"
                          name="question"
                          value={chatbotFormData.question}
                          onChange={handleInputChange_chatbot}
                          placeholder="Enter question"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {/* Answer Input */}
                        <input
                          type="text"
                          name="answer"
                          value={chatbotFormData.answer}
                          onChange={handleInputChange_chatbot}
                          placeholder="Enter answer"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      {/* Add/Update Button */}
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          onClick={() => setIsChatbotModalOpen(false)}
                          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                        <button
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
                          className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-600"
                        >
                          {isEditing ? "Update" : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* <div>
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
          </div> */}
        </div>
      </div>
    </>
  );
}
