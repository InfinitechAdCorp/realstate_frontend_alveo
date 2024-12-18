// components/Header.js
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Input } from "@/components/ui/input";

import Header from "../pages/header";
import Link from "next/link";
export default function Admin({}) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [properties, setProperties] = useState([]); // State to store fetched data from API
  const [buildings, setBuildings] = useState([]);
  const [data, setData] = useState([]); // This will hold the data for either properties or buildings
  const [viewType, setViewType] = useState("properties"); // To track if we are showing properties or buildings
  const [selectedItems, setSelectedItems] = useState([]); // Store selected item IDs
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [checkedItems, setCheckedItems] = useState({}); // Track checked items by property ID
  const [isPopupVisible1, setPopupVisible1] = useState(false);
  const [currentItem, setCurrentItem] = useState(null); // State to hold the current item
  const [additionalInputs, setAdditionalInputs] = useState([]);
  const [numberOfFacilities, setNumberOfFacilities] = useState(0);
  const [facilityInputs, setFacilityInputs] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const [featureInputs, setFeatureInputs] = useState([]); // Add featureInputs state
  const [inputPropertyId, setInputPropertyId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [buildingInputs, setBuildingInputs] = useState([]);
  const [locationInputs, setLocationInputs] = useState([
    {
      numberOfLocations: 0,
      propertyId: "",
      name: "",
      location: "",
      specific_location: "",
      lat: "",
      lng: "",
      path: "",
    },
  ]);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !code) {
      setError("All fields are required");
      return;
    }

 
    // Prepare the data to send in the request body
    const data = {
      email,
      password,
      code,
    };

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST", // Use POST method to send data
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(data), // Convert data to JSON string
      });

      if (response.ok) {
        // If request is successful
        setAlertMessage("Registered Successfully!");
        setAlertStatus("success");
        setShowAlert(true);
        const responseData = await response.json();
      } else {
        // If request fails
        const errorData = await response.json();
        setError(`Error: ${errorData.message}`);
        setAlertMessage("Failed to Register!");
        setAlertStatus("error");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Something went wrong");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !code) {
      setError("All fields are required");
      return;
    }


    // Prepare the data to send in the request body
    const data = {
      email,
      password,
      code,
    };

    // Perform the fetch request
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST", // Use POST method to send data
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
        body: JSON.stringify(data), // Convert data to JSON string
      });

      if (response.ok) {
        // If request is successful
        const responseData = await response.json();

        // Store the token in localStorage or sessionStorage
        localStorage.setItem("token", responseData.token);

        // Set alert message and show alert
        setAlertMessage("Login successful!");
        setAlertStatus("success");
        setShowAlert(true);

        // Optionally, trigger additional actions after login
        fetchLocations(); // Assuming this is a function to fetch data after login

        closePopup(); // Close the login popup/modal
      } else {
        // If request fails
        setAlertMessage("Login Failed! Incorrect information.");
        setAlertStatus("error");
        setShowAlert(true);

        // Handle the error response from the API
        const errorData = await response.json();
        setError(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong");
    }
  };

  const [otherbuildingInputs, setotherBuildingInputs] = useState([]);
  const [propertyInput, setPropertyInput] = useState([
    // Example initial property objects; you can replace this with your actual data structure
    {
      name: "",
      status: "",
      location: "",
      specific_location: "",
      price_range: "",
      units: "",
      land_area: "",
      development_type: "",
      architectural_theme: "",
    },
    // Add more property objects as needed
  ]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("info"); // Default to 'info'

  const triggerAlert = () => {
    setShowAlert(true);
    // Automatically hide alert after 3 seconds
    setTimeout(() => setShowAlert(false), 3000);
  };
  const fetchGeolocation = async (address, propertyId, index) => {
    const apiKey = "AIzaSyAS_yg3EUDpuONWhT1dJQjc5JETJf5uITI"; // Replace with your actual API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        // Update latitude and longitude for the specific index
        handleUpdate(propertyId, "lat", location.lat, index);
        handleUpdate(propertyId, "lng", location.lng, index);
      } else if (data.status === "ZERO_RESULTS") {
        console.error("No geolocation results found for this address.");
      }
    } catch (error) {
      console.error("Failed to fetch geolocation:", error);
    }
  };

  // Function to handle the number of buildings change
  const handleNumberOfBuildingsChange = (propertyId, newValue) => {
    setBuildingInputs((prevInputs) => {
      const existingInput = prevInputs.find(
        (input) => input.propertyId === propertyId
      );
      if (existingInput) {
        // Update existing input
        return prevInputs.map((input) =>
          input.propertyId === propertyId
            ? {
                ...input,
                numberOfBuildings: newValue,
                buildings: Array(newValue).fill({}),
              }
            : input
        );
      } else {
        // Add a new entry for this propertyId
        return [
          ...prevInputs,
          {
            propertyId,
            numberOfBuildings: newValue,
            buildings: Array(newValue).fill({}),
          },
        ];
      }
    });
  };
  const handleBuildingInputChange = (propertyId, index, field, value) => {
    setBuildingInputs((prev) => {
      const propertyInputs = prev.find(
        (input) => input.propertyId === propertyId
      );
      const updatedBuildings = propertyInputs
        ? [...propertyInputs.buildings]
        : [];

      // Ensure we have an object for this building
      if (!updatedBuildings[index]) {
        updatedBuildings[index] = {}; // Initialize if undefined
      }

      // Update specific field for this building
      updatedBuildings[index] = {
        ...updatedBuildings[index],
        [field]: value,
      };

      return prev.map((input) =>
        input.propertyId === propertyId
          ? { ...input, buildings: updatedBuildings }
          : input
      );
    });
  };
  const renderFeatureInputs = (propertyId, inputs) => {
    return inputs.map((inputValue, inputIndex) => (
      <div
        key={inputIndex}
        className="feature-input"
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <div
          className="input-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <label>{`Feature ${inputIndex + 1} Name:`}</label>
          <input
            style={{ height: "30px", textIndent: "10px" }}
            type="text"
            value={inputValue.featureName || ""}
            placeholder="Enter feature name"
            onChange={(e) =>
              handleFeatureNameChange(propertyId, inputIndex, e.target.value)
            } // Handle change here
          />

          <label>{`Feature ${inputIndex + 1} Image:`}</label>
          <input
            style={{ height: "30px", textIndent: "10px" }}
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageChange(propertyId, inputIndex, e.target.files[0])
            } // Handle file input change
          />
        </div>
      </div>
    ));
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
   
  };

  const renderFacilityInputs = (propertyId, inputs) =>
    inputs.map((inputValue, index) => (
      <div
        key={index}
        className="facility-input"
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <div
          className="input-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <label>{`Facility ${index + 1}`}</label>
          <input
            style={{ height: "30px", textIndent: "10px" }}
            type="text"
            value={inputValue}
            onChange={(e) =>
              handleInputChange(propertyId, index, e.target.value)
            }
            placeholder="Enter facility name"
          />
        </div>
      </div>
    ));
  const renderBuildingInputs = (propertyId) => {
    const propertyInputs = buildingInputs.find(
      (input) => input.propertyId === propertyId
    );
    const numberOfBuildings = propertyInputs
      ? propertyInputs.numberOfBuildings
      : 0;

    return [...Array(numberOfBuildings)].map((_, index) => (
      <div
        key={index}
        className="building-input"
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <div
          className="input-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <label>{`Building ${index + 1} Name:`}</label>
          <input
            style={{ height: "30px", textIndent: "10px" }}
            type="text"
            onChange={(e) =>
              handleBuildingInputChange(
                propertyId,
                index,
                "name",
                e.target.value
              )
            }
            placeholder="Enter building name"
          />
          <label htmlFor={`imageUpload1-${propertyId}-${index}`}>
            Building View:
          </label>
          <input
            style={{ height: "30px", textIndent: "10px" }}
            type="file"
            id={`imageUpload1-${propertyId}-${index}`}
            accept="image/*"
            onChange={(e) =>
              handleBuildingInputChange(
                propertyId,
                index,
                "buildingView",
                e.target.files[0]
              )
            }
          />

          <label>{`Development Type for Building ${index + 1}:`}</label>
          <input
            style={{ height: "30px", textIndent: "10px" }}
            type="text"
            onChange={(e) =>
              handleBuildingInputChange(
                propertyId,
                index,
                "developmentType",
                e.target.value
              )
            }
            placeholder="Enter development type"
          />

          <label>{`Residential Levels for Building ${index + 1}:`}</label>
          <input
            type="number"
            style={{ height: "30px", textIndent: "10px" }}
            onChange={(e) =>
              handleBuildingInputChange(
                propertyId,
                index,
                "residentialLevels",
                e.target.value
              )
            }
            placeholder="Enter residential levels"
            min="0"
          />

          <label>{`Basement Parking Levels for Building ${index + 1}:`}</label>
          <input
            type="number"
            style={{ height: "30px", textIndent: "10px" }}
            onChange={(e) =>
              handleBuildingInputChange(
                propertyId,
                index,
                "basementParkingLevels",
                e.target.value
              )
            }
            placeholder="Enter basement parking levels"
            min="0"
          />

          <label>{`Podium Parking Levels for Building ${index + 1}:`}</label>
          <input
            type="number"
            style={{ height: "30px", textIndent: "10px" }}
            onChange={(e) =>
              handleBuildingInputChange(
                propertyId,
                index,
                "podiumParkingLevels",
                e.target.value
              )
            }
            placeholder="Enter podium parking levels"
            min="0"
          />

          <label>{`Lower Ground Floor Parking Levels for Building ${
            index + 1
          }:`}</label>
          <input
            type="number"
            style={{ height: "30px", textIndent: "10px" }}
            onChange={(e) =>
              handleBuildingInputChange(
                propertyId,
                index,
                "lowerGroundFloorParkingLevels",
                e.target.value
              )
            }
            placeholder="Enter lower ground floor parking levels"
            min="0"
          />

          <label>{`Commercial Units for Building ${index + 1}:`}</label>
          <input
            type="number"
            style={{ height: "30px", textIndent: "10px" }}
            onChange={(e) =>
              handleBuildingInputChange(
                propertyId,
                index,
                "commercialUnits",
                e.target.value
              )
            }
            placeholder="Enter commercial units"
            min="0"
          />
        </div>
      </div>
    ));
  };
  const handleSinglePropertyInputChange = (index, key, value) => {
    // Update the specific property in the propertyInput array using the index
    setPropertyInput((prevState) =>
      prevState.map((property, i) =>
        i === index ? { ...property, [key]: value } : property
      )
    );
  };

  const handlePropertyInputChange = (index, key, value) => {
    // Handle file inputs or other changes as needed
    setPropertyInput((prevState) =>
      prevState.map((property, i) =>
        i === index ? { ...property, [key]: value } : property
      )
    );
  };
  const renderLocationInputs = (propertyId) => {
    const numberOfLocations = locationInputs[0]?.numberOfLocations || 0;
    const inputs = [];

    for (let i = 0; i < numberOfLocations; i++) {
      inputs.push(
        <div
          className="location-input"
          key={i}
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <div
            className="input-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <label htmlFor={`locationName-${i}`}> Location Name:</label>
            <input
              style={{ height: "30px", textIndent: "10px" }}
              type="text"
              id={`locationName-${i}`}
              value={locationInputs[i]?.name || ""}
              onChange={(e) =>
                handleLocationInputChange(i, "name", e.target.value, propertyId)
              }
              placeholder="Enter location name"
            />

            <label htmlFor={`location-${i}`}>Location:</label>
            <input
              type="text"
              style={{ height: "30px", textIndent: "10px" }}
              id={`location-${i}`}
              value={locationInputs[i]?.location || ""}
              onChange={(e) =>
                handleLocationInputChange(
                  i,
                  "location",
                  e.target.value,
                  propertyId
                )
              }
              placeholder="Enter location"
            />

            <label htmlFor={`specificLocation-${i}`}>Specific Location:</label>
            <input
              type="text"
              style={{ height: "30px", textIndent: "10px" }}
              id={`specificLocation-${i}`}
              value={locationInputs[i]?.specific_location || ""} // Ensure this is defined
              onChange={(e) =>
                handleLocationInputChange(
                  i,
                  "specific_location",
                  e.target.value,
                  propertyId
                )
              } // Call the handler
              placeholder="Enter specific location"
            />

            <label htmlFor={`lat-${i}`}>Latitude:</label>
            <input
              type="text"
              style={{ height: "30px", textIndent: "10px" }}
              id={`lat-${i}`}
              value={locationInputs[i]?.lat || ""} // Ensure it binds to the correct state
              onChange={(e) =>
                handleLocationInputChange(i, "lat", e.target.value, propertyId)
              }
              placeholder="Enter latitude"
              disabled
            />

            <label htmlFor={`lng-${i}`}>Longitude:</label>
            <input
              type="text"
              style={{ height: "30px", textIndent: "10px" }}
              id={`lng-${i}`}
              value={locationInputs[i]?.lng || ""} // Ensure it binds to the correct state
              onChange={(e) =>
                handleLocationInputChange(i, "lng", e.target.value, propertyId)
              }
              placeholder="Enter longitude"
              disabled
            />

            <label htmlFor={`imageUploadPath-${i}`}>Location Image:</label>
            <input
              style={{ height: "30px", textIndent: "10px" }}
              type="file"
              id={`imageUploadPath-${i}`}
              accept="image/*"
              onChange={(e) =>
                handleLocationInputChange(
                  i,
                  "locationImage",
                  null,
                  propertyId,
                  e.target.files[0]
                )
              }
            />
          </div>
        </div>
      );
    }

    return inputs;
  };

  const [typingTimeout, setTypingTimeout] = useState(null);
  const handleLocationInputChange = (
    index,
    key,
    value,
    propertyId,
    file = null
  ) => {
    const updatedInputs = [...locationInputs];

    // If the input is a file (image), handle the image upload
    if (file) {
      updatedInputs[index] = {
        ...updatedInputs[index],
        [key]: file, // Store the image file
      };
    } else {
      updatedInputs[index] = {
        ...updatedInputs[index],
        [key]: value, // For text input fields
      };
    }

    // Update the state with the new location data
    setLocationInputs(updatedInputs);

    // If 'specific_location' is updated, fetch geolocation (optional, based on your use case)
    if (key === "specific_location") {
      fetchGeolocation(value, propertyId, index); // Pass index to geolocation fetch
    }

  
  };

  const renderPropertyInputs = (index) => {
    const propertyInputData = propertyInput[index]; // Get the property data by index

    return (
      <div
        className="property-input"
        key={index}
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <div
          className="input-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <label htmlFor={`name-${index}`}>Property Name:</label>
          <input
            style={{ height: "30px", textIndent: "10px" }}
            type="text"
            id={`name-${index}`}
            value={propertyInputData.name || ""} // Use empty string if undefined
            onChange={(e) =>
              handleSinglePropertyInputChange(index, "name", e.target.value)
            }
            placeholder="Enter property name"
          />

          <label htmlFor={`status-${index}`}>Status:</label>
          <input
            type="text"
            style={{ height: "30px", textIndent: "10px" }}
            id={`status-${index}`}
            value={propertyInputData.status || ""}
            onChange={(e) =>
              handleSinglePropertyInputChange(index, "status", e.target.value)
            }
            placeholder="Enter property status"
          />

          <label htmlFor={`location-${index}`}>Location:</label>
          <input
            style={{ height: "30px", textIndent: "10px" }}
            type="text"
            id={`location-${index}`}
            value={propertyInputData.location || ""}
            onChange={(e) =>
              handleSinglePropertyInputChange(index, "location", e.target.value)
            }
            placeholder="Enter property location"
          />

          <label htmlFor={`key-${index}`}>Key:</label>
          <input
            type="text"
            style={{ height: "30px", textIndent: "10px" }}
            id={`key-${index}`} // Use a unique ID for the key input
            value={propertyInputData.key || ""} // Use empty string if undefined
            onChange={(e) =>
              handleSinglePropertyInputChange(index, "key", e.target.value)
            } // Handle key input change
            placeholder="Enter property key" // Placeholder for the key input
          />

          <label htmlFor={`specificLocation-${index}`}>
            Specific Location:
          </label>
          <input
            style={{ height: "30px", textIndent: "10px" }}
            type="text"
            id={`specificLocation-${index}`}
            value={propertyInputData.specific_location || ""}
            onChange={(e) =>
              handleSinglePropertyInputChange(
                index,
                "specific_location",
                e.target.value
              )
            }
            placeholder="Enter specific location"
          />

          <label htmlFor={`priceRange-${index}`}>Price Range:</label>
          <input
            type="text"
            style={{ height: "30px", textIndent: "10px" }}
            id={`priceRange-${index}`}
            value={propertyInputData.price_range || ""}
            onChange={(e) =>
              handleSinglePropertyInputChange(
                index,
                "price_range",
                e.target.value
              )
            }
            placeholder="Enter price range"
          />

          <label htmlFor={`units-${index}`}>Units:</label>
          <input
            type="text"
            style={{ height: "30px", textIndent: "10px" }}
            id={`units-${index}`}
            value={propertyInputData.units || ""}
            onChange={(e) =>
              handleSinglePropertyInputChange(index, "units", e.target.value)
            }
            placeholder="Enter number of units"
          />

          <label htmlFor={`landArea-${index}`}>Land Area:</label>
          <input
            type="text"
            style={{ height: "30px", textIndent: "10px" }}
            id={`landArea-${index}`}
            value={propertyInputData.land_area || ""}
            onChange={(e) =>
              handleSinglePropertyInputChange(
                index,
                "land_area",
                e.target.value
              )
            }
            placeholder="Enter land area"
          />

          <label htmlFor={`developmentType-${index}`}>Development Type:</label>
          <input
            type="text"
            style={{ height: "30px", textIndent: "10px" }}
            id={`developmentType-${index}`}
            value={propertyInputData.development_type || ""}
            onChange={(e) =>
              handleSinglePropertyInputChange(
                index,
                "development_type",
                e.target.value
              )
            }
            placeholder="Enter development type"
          />

          <label htmlFor={`architecturalTheme-${index}`}>
            Architectural Theme:
          </label>
          <input
            type="text"
            style={{ height: "30px", textIndent: "10px" }}
            id={`architecturalTheme-${index}`}
            value={propertyInputData.architectural_theme || ""}
            onChange={(e) =>
              handleSinglePropertyInputChange(
                index,
                "architectural_theme",
                e.target.value
              )
            }
            placeholder="Enter architectural theme"
          />

          <label htmlFor={`imageUploadPath-${index}`}>Property Image:</label>
          <input
            style={{ height: "30px", textIndent: "10px" }}
            type="file"
            id={`imageUploadPath-${index}`}
            accept="image/*"
            onChange={(e) =>
              handlePropertyInputChange(
                index,
                "propertyImage",
                e.target.files[0]
              )
            }
          />

          <label htmlFor={`masterPlanImg-${index}`}>Master Plan:</label>
          <input
            style={{ height: "30px", textIndent: "10px" }}
            type="file"
            id={`masterPlanImg-${index}`}
            accept="image/*"
            onChange={(e) =>
              handlePropertyInputChange(
                index,
                "masterPlanImg",
                e.target.files[0]
              )
            }
          />
        </div>
      </div>
    );
  };
  const handleUpdate = (propertyId, key, value, index) => {
  
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.propertyId === propertyId
          ? { ...item, item: { ...item.item, [key]: value } }
          : item
      )
    );
    setPopupVisible(true);

    setLocationInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      updatedInputs[index] = { ...updatedInputs[index], [key]: value }; // Update only the correct index
      return updatedInputs;
    });
  };

  const handleFacilityUpdate = (propertyId, idx, value) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.propertyId === propertyId
          ? {
              ...item,
              item: item.item.map((facility, index) =>
                index === idx ? value : facility
              ),
            }
          : item
      )
    );
  };

  const handleFeatureUpdate = (propertyId, idx, value) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.propertyId === propertyId
          ? {
              ...item,
              item: item.item.map((feature, index) =>
                index === idx ? { ...feature, name: value } : feature
              ),
            }
          : item
      )
    );
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setCurrentItem(null); // Clear the current item
  };
  const handleUpdateValues = () => {
 
    let endpoint = "";

    // Define the endpoint based on the viewType
    if (selectedItems[0].viewType === "location") {
      endpoint = "http://localhost:8000/api/admin/update-location";
    } else if (selectedItems[0].viewType === "properties") {
      endpoint = "http://localhost:8000/api/admin/update-properties";
    } else if (selectedItems[0].viewType === "buildings") {
      endpoint = "http://localhost:8000/api/admin/update-buildings";
    } else if (selectedItems[0].viewType === "features") {
      endpoint = "http://localhost:8000/api/admin/update-features";
    } else if (selectedItems[0].viewType === "facilities") {
      endpoint = "http://localhost:8000/api/admin/update-facilities";
    } else {
      console.error("Invalid viewType");
      return; // Exit if viewType is not recognized
    }
    const dataToSend = selectedItems.map((item) => ({
      propertyId: item.propertyId, // Get the propertyId for each item
      item: item.item, // Include the features for each property
    }));
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend), // Send data with propertyId and items
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message);
          });
        }
        return response.json();
      })
      .then((data) => {
      
        setPopupVisible(false); // Close the popup after successful update
        if (selectedItems[0].viewType === "location") {
          setAlertMessage("Successfully updating location!");
          setAlertStatus("success");
          setShowAlert(true);
          fetchLocations(); // Ensure to call the function with parentheses
        } else if (selectedItems[0].viewType === "properties") {
          setAlertMessage("Successfully updating properties!");
          setAlertStatus("success");
          setShowAlert(true);
          fetchProperties(); // Ensure to call the function with parentheses
        } else if (selectedItems[0].viewType === "buildings") {
          setAlertMessage("Successfully updating buildings!");
          setAlertStatus("success");
          setShowAlert(true);
          fetchBuildings(); // Ensure to call the function with parentheses
        } else if (selectedItems[0].viewType === "features") {
          setAlertMessage("Successfully updating features!");
          setAlertStatus("success");
          setShowAlert(true);
          fetchFeatures(); // Ensure to call the function with parentheses
        } else if (selectedItems[0].viewType === "facilities") {
          setAlertMessage("Successfully updating facilities!");
          setAlertStatus("success");
          setShowAlert(true);
          fetchFacilities(); // Ensure to call the function with parentheses
        }
        clearSelectedItems();
      })
      .catch((error) => {
        console.error("Error updating values:", error);
        setAlertMessage("Failed to update.");
        setAlertStatus("error");
        setShowAlert(true);
      });
  };
  // Function to check if an item is selected
  const isSelected = (propertyId) => {
    return selectedItems.some((item) => item.propertyId === propertyId);
  };

  const handleCRUD = (
    propertyId,
    viewType,
    item,
    facilitiesData,
    featuresData
  ) => {
    // Initialize the parsed item
    let parsedItem = item;

    // Check the viewType and parse item if it is 'features'
    if (viewType === "features") {
      parsedItem = typeof item === "string" ? JSON.parse(item) : item; // Parse only for features
    }

    // Create a new entry with the correct item structure
    const newEntry = {
      propertyId,
      viewType,
      item: parsedItem,
      facilities: facilitiesData,
      features: featuresData,
    };

    // Update the selected items state
    setSelectedItems((prevData) => {
      // Check if the item is already selected
      const itemIndex = prevData.findIndex(
        (existingItem) => existingItem.propertyId === propertyId
      );

      if (itemIndex !== -1) {
        // If the item is already selected, remove it
        const updatedData = prevData.filter((_, index) => index !== itemIndex);
        return updatedData; // Return the updated items without the unchecked item
      } else {
        // If the item is not selected, add it
        const updatedData = [...prevData, newEntry];

        // Remove duplicates based on propertyId
        const uniqueData = updatedData.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.propertyId === item.propertyId)
        );

        return uniqueData; // Return the unique items
      }
    });
  };

  useEffect(() => {

    // Remove duplicates based on propertyId and log unique items
    const uniqueItems = selectedItems.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.propertyId === item.propertyId)
    );


  }, [selectedItems]);
  const handleAdd = () => {
    if (
      (selectedItems.length > 0 && selectedItems[0].viewType === "location") ||
      (selectedItems.length === 0 && viewType === "location")
    ) {
      setPopupVisible1(true); // Show the popup
    } else if (
      (selectedItems.length > 0 &&
        selectedItems[0].viewType === "properties") ||
      (selectedItems.length === 0 && viewType === "properties")
    ) {
      setPopupVisible1(true); // Show the popup
    } else if (selectedItems.length === 0 && viewType === "buildings") {
      setPopupVisible1(true); // Show the popup
    } else if (
      selectedItems.length > 0 &&
      selectedItems[0].viewType === "buildings"
    ) {
      setPopupVisible1(true); // Show the popup
    } else if (selectedItems.length === 0 && viewType === "features") {
      setPopupVisible1(true); // Show the popup
    } else if (
      selectedItems.length > 0 &&
      selectedItems[0].viewType === "features"
    ) {
      setPopupVisible1(true); // Show the popup
    } else if (selectedItems.length === 0 && viewType === "facilities") {
      setPopupVisible1(true); // Show the popup
    } else if (
      selectedItems.length > 0 &&
      selectedItems[0].viewType === "facilities"
    ) {
      const updatedInputs = selectedItems.map((item) => ({
        propertyId: item.propertyId, // Store the property ID
        facilities: Array(numberOfFacilities).fill(""), // Create an array for facility inputs based on the number of facilities
        availableFacilities: item.item, // Store available facilities for this property
      }));

      setAdditionalInputs(updatedInputs); // Set state with inputs for each property
      setPopupVisible1(true); // Show the popup
    }
  };
  const handlePropertyIdChange = (oldPropertyId, newPropertyId) => {
    setFacilityInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.propertyId === oldPropertyId
          ? { ...input, propertyId: newPropertyId }
          : input
      )
    );
    setFeatureInputs((prevInputs) => {
      const updatedInputs = prevInputs.map((input) =>
        input.propertyId === oldPropertyId
          ? { ...input, propertyId: newPropertyId }
          : input
      );
      return updatedInputs;
    });
  };

  const handleNumberOfFeaturesChange = (propertyId, e) => {
    const numberOfFeatures = e.target.value;
    setFeatureInputs((prevInputs) => {
      const existingInput = prevInputs.find(
        (input) => input.propertyId === propertyId
      );
      if (existingInput) {
        // Update existing input
        return prevInputs.map((input) =>
          input.propertyId === propertyId
            ? {
                ...input,
                inputs: Array.from({ length: numberOfFeatures }, (_, i) => ({
                  featureName: existingInput.inputs[i]?.featureName || "",
                  image: existingInput.inputs[i]?.image || null,
                })),
              }
            : input
        );
      } else {
        // Create new input for the property
        return [
          ...prevInputs,
          {
            propertyId,
            inputs: Array.from({ length: numberOfFeatures }, () => ({
              featureName: "",
              image: null,
            })),
          },
        ];
      }
    });
  };
  const handleFeatureInputChange = (propertyId, inputIndex, newValue) => {
    setFeatureInputs((prevInputs) =>
      prevInputs.map((inputData) => {
        if (inputData.propertyId === propertyId) {
          const updatedInputs = inputData.inputs.map((inputValue, index) => {
            if (index === inputIndex) {
              return { ...inputValue, name: newValue }; // Update the feature name
            }
            return inputValue;
          });
          return { ...inputData, inputs: updatedInputs }; // Return updated input data
        }
        return inputData;
      })
    );
  };

  const handleInputChange = (propertyId, index, value) => {
    setFacilityInputs((prevInputs) => {
      return prevInputs.map((input) => {
        if (input.propertyId === propertyId) {
          const updatedInputs = [...input.inputs];
          updatedInputs[index] = value; // Update the specific input
          return { ...input, inputs: updatedInputs };
        }
        return input;
      });
    });
  };
  const handleImageChange = (propertyId, inputIndex, file) => {
    setFeatureInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.propertyId === propertyId
          ? {
              ...input,
              inputs: input.inputs.map((inputValue, index) =>
                index === inputIndex
                  ? { ...inputValue, image: file }
                  : inputValue
              ),
            }
          : input
      )
    );
  };

  const handleFeatureNameChange = (propertyId, inputIndex, value) => {
    setFeatureInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.propertyId === propertyId
          ? {
              ...input,
              inputs: input.inputs.map((inputValue, index) =>
                index === inputIndex
                  ? { ...inputValue, featureName: value }
                  : inputValue
              ),
            }
          : input
      )
    );
  };

  const handleNumberOfFacilitiesChange = (propertyId, event) => {
    const value = parseInt(event.target.value) || 0; // Ensure it's a number

    // Create a new array for facility inputs if it doesn't exist
    setFacilityInputs((prevInputs) => {
      const updatedInputs = [...prevInputs];
      const index = updatedInputs.findIndex(
        (input) => input.propertyId === propertyId
      );

      // If propertyId does not exist in the inputs array, add it
      if (index === -1) {
        updatedInputs.push({ propertyId, inputs: Array(value).fill("") });
      } else {
        // Update the number of inputs for the existing propertyId
        updatedInputs[index].inputs = Array(value).fill(""); // Reset to new empty inputs
      }

      return updatedInputs;
    });
  };

  const handleImageUpload = async (file, propertyId, inputIndex) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("propertyId", propertyId);
    formData.append("inputIndex", inputIndex);

    try {
      const response = await fetch("http://localhost:8000/api/admin/upload", {
        // Replace with your upload endpoint
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();

      return data; // Return the response data for further processing
    } catch (error) {
      console.error("Error uploading image:", error);
      return null; // Return null if there's an error
    }
  };

 // Log propertyId whenever it changes
  const createFormData = (buildingInputs) => {
    const formData = new FormData();

    buildingInputs.forEach((input, propertyIndex) => {
      formData.append(`propertyId[${propertyIndex}]`, input.propertyId);
      formData.append(
        `numberOfBuildings[${propertyIndex}]`,
        input.numberOfBuildings
      );

      input.buildings.forEach((building, buildingIndex) => {
        formData.append(
          `buildings[${propertyIndex}][${buildingIndex}][name]`,
          building.name
        );
        formData.append(
          `buildings[${propertyIndex}][${buildingIndex}][developmentType]`,
          building.developmentType
        );
        formData.append(
          `buildings[${propertyIndex}][${buildingIndex}][residentialLevels]`,
          building.residentialLevels
        );
        formData.append(
          `buildings[${propertyIndex}][${buildingIndex}][basementParkingLevels]`,
          building.basementParkingLevels
        );
        formData.append(
          `buildings[${propertyIndex}][${buildingIndex}][podiumParkingLevels]`,
          building.podiumParkingLevels
        );
        formData.append(
          `buildings[${propertyIndex}][${buildingIndex}][lowerGroundFloorParkingLevels]`,
          building.lowerGroundFloorParkingLevels
        );
        formData.append(
          `buildings[${propertyIndex}][${buildingIndex}][commercialUnits]`,
          building.commercialUnits
        );

        // Append files if they exist and specify placeholder for path
        if (building.buildingView) {
          formData.append(
            `buildings[${propertyIndex}][${buildingIndex}][buildingView]`,
            building.buildingView
          );
          formData.append(
            `buildings[${propertyIndex}][${buildingIndex}][buildingViewPath]`,
            ""
          ); // Placeholder for backend response
        }
      });
    });

    return formData;
  };
  function createFormDataProperty(propertyInput) {
    const formData = new FormData();

    // Get the first object from the propertyInput
    const propertyData = propertyInput[0]; // Ensure propertyInput has at least one item

    for (const key in propertyData) {
      if (propertyData.hasOwnProperty(key)) {
        formData.append(key, propertyData[key]); // Append the property
      }
    }

    return formData;
  }
  const handleAddSubmit = async () => {
    if (
      (selectedItems.length > 0 || selectedItems.length === 0) &&
      viewType === "location"
    ) {
   
      if (Array.isArray(locationInputs) && locationInputs.length > 0) {
        const formData = new FormData();
   

        // Append each location data field
        locationInputs.forEach((location, index) => {
          formData.append("locations[" + index + "][name]", location.name);
          formData.append(
            "locations[" + index + "][location]",
            location.location
          );
          formData.append(
            "locations[" + index + "][specific_location]",
            location.specific_location
          );
          formData.append("locations[" + index + "][lat]", location.lat);
          formData.append("locations[" + index + "][lng]", location.lng);
          formData.append(
            "locations[" + index + "][locationImage]",
            location.locationImage
          );
        });

        // Log the contents of formData

        try {
          const response = await fetch(
            "http://localhost:8000/api/admin/addlocation",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          fetchLocations();
          setPopupVisible1(false);
          setAlertMessage("Location saved successfully!");
          setAlertStatus("success");
          setShowAlert(true);
        } catch (error) {
          console.error("Error saving location:", error);
          setPopupVisible1(false);
          setAlertMessage("Error saving location.");
          setAlertStatus("error");
          setShowAlert(true);
        }
      } else {
        console.error("Invalid propertyInput: It must be a non-empty array.");
      }
    } else if (
      (selectedItems.length > 0 || selectedItems.length === 0) &&
      viewType === "properties"
    ) {
      if (Array.isArray(propertyInput) && propertyInput.length > 0) {
        const formData = createFormDataProperty(propertyInput);
        try {
          // Make the API request to save the property
          const response = await fetch(
            "http://localhost:8000/api/admin/addproperty",
            {
              method: "POST",
              body: formData,
            }
          );

          // Check if the response is okay
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          // Parse the JSON data from the response
          const data = await response.json();
          fetchProperties();
          setPopupVisible1(false);
          setAlertMessage("Property saved Successfully!");
          setAlertStatus("success");
          setShowAlert(true);
          // Optionally: Handle the success response here
        } catch (error) {
          console.error("Error saving property:", error);
          setPopupVisible1(false);
          setAlertMessage("Error saving property.");
          setAlertStatus("error");
          setShowAlert(true);
          // Handle error accordingly, maybe show a notification or alert
        }
      } else {
        console.error("Invalid propertyInput: It must be a non-empty array.");
      }
    } else if (selectedItems.length > 0 && viewType === "buildings") {
      const formData = createFormData(buildingInputs);
      try {
        const response = await fetch(
          "http://localhost:8000/api/admin/addbuildings",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        fetchBuildings();
        setPopupVisible1(false);
        setAlertMessage("Buildings saved successfully!");
        setAlertStatus("success");
        setShowAlert(true);
      } catch (error) {
        setPopupVisible1(false);
        console.error("Error saving buildings:", error);
        setAlertMessage("Error saving buildings. ");
        setAlertStatus("error");
        setShowAlert(true);
      }
    } else if (selectedItems.length === 0 && viewType === "buildings") {
      const formData = createFormData(buildingInputs);
      try {
        const response = await fetch(
          "http://localhost:8000/api/admin/addbuildings",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        fetchBuildings();
        setPopupVisible1(false);
        setAlertMessage("Buildings saved successfully!");
        setAlertStatus("success");
        setShowAlert(true);
      } catch (error) {
        console.error("Error saving buildings:", error);
        setPopupVisible1(false);
        setAlertMessage("Error saving buildings.");
        setAlertStatus("error");
        setShowAlert(true);
      }
    } else if (selectedItems.length > 0 && viewType === "features") {
      const formData = new FormData();

      featureInputs.forEach(({ propertyId, inputs }) => {
        inputs.forEach(({ featureName, image }, index) => {
          formData.append(
            `features[${propertyId}][${index}][propertyId]`,
            propertyId
          ); // Append propertyId
          formData.append(
            `features[${propertyId}][${index}][featureName]`,
            featureName
          );
          if (image) {
            formData.append(`features[${propertyId}][${index}][image]`, image);
          }
        });
      });



      try {
        const response = await fetch(
          "http://localhost:8000/api/admin/addfeature",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
  
        fetchFeatures();
        setPopupVisible1(false);
        setAlertMessage("Feature added successfully!");
        setAlertStatus("success");
        setShowAlert(true);
        fetchFeatures(); // Optionally fetch features again after adding
      } catch (error) {
        console.error("Error:", error);
        setPopupVisible1(false);
        setAlertMessage("Failed adding feature.");
        setAlertStatus("error");
        setShowAlert(true);
      }
      fetchFeatures();
    } else if (selectedItems.length === 0 && viewType === "features") {
      const formData = new FormData();

      featureInputs.forEach(({ propertyId: featurePropertyId, inputs }) => {
        // Use feature's propertyId if available, otherwise fallback to propertyId from useState
        const finalPropertyId = featurePropertyId || propertyId;

        inputs.forEach(({ featureName, image }, index) => {
          formData.append(
            `features[${finalPropertyId}][${index}][propertyId]`,
            finalPropertyId
          );
          formData.append(
            `features[${finalPropertyId}][${index}][featureName]`,
            featureName
          );
          if (image) {
            formData.append(
              `features[${finalPropertyId}][${index}][image]`,
              image
            );
          }
        });
      });

      // Debugging output


      // Send formData to the API
      fetch("http://localhost:8000/api/admin/addfeature", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((responseData) => {
  
          fetchFeatures();
          setPopupVisible1(false);
          setAlertMessage("Feature Added Successfully!");
          setAlertStatus("success");
          setShowAlert(true);
          // Optionally fetch features again or update state after success
        })
        .catch((error) => console.error("Error:", error));
      setPopupVisible1(false);
      setAlertMessage("Failed to add feature.");
      setAlertStatus("error");
      setShowAlert(true);
      fetchFeatures();
    } else if (selectedItems.length === 0 && viewType == "facilities") {

      setPopupVisible1(true); // Show the pop up
      if (!propertyId) {
        console.error("Property ID is missing or invalid.");
        return;
      }
      // Create an array of facility objects
      const submittedFacilities = facilityInputs[0].inputs.map((facility) => ({
        property_id: propertyId, // Assuming propertyId is defined correctly
        facilities: facility, // Facility name or description
      }));



      // Wrap the array in an object with the key 'facilities'
      const requestBody = { facilities: submittedFacilities };

      // Make the API request
      try {
        const response = await fetch(
          "http://localhost:8000/api/admin/addfacilitiesalone",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody), // Send the wrapped data as JSON
          }
        );

        if (response.ok) {
          const result = await response.json();
   
          fetchFacilities();
          // Handle success, e.g., notify the user or refresh the list
          fetchFacilities();
          setPopupVisible1(false);

          setAlertMessage("Feature Added Successfully!");
          setAlertStatus("success");
          setShowAlert(true);
        } else {
          setPopupVisible1(false);
          setAlertMessage("Failed to add feature.");
          setAlertStatus("error");
          setShowAlert(true);
          const errorMessage = await response.text(); // Read the error response
          console.error(
            "Error submitting data:",
            response.statusText,
            errorMessage
          );
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    } else if (
      selectedItems.length > 0 &&
      selectedItems[0].viewType === "facilities"
    ) {
      const submittedData = facilityInputs.flatMap((input) => {
        return input.inputs
          .filter((facility) => facility !== "")
          .map((facility) => ({
            property_id: input.propertyId, // Ensure this matches your backend's expected field
            facilities: facility, // Each facility name
          }));
      });


      try {
        const response = await fetch(
          "http://localhost:8000/api/admin/add-facilities",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submittedData), // Send the collected data as JSON
          }
        );

        if (response.ok) {
          const result = await response.json();
          fetchFacilities();
          setPopupVisible1(false);
          setAlertMessage("Facilities Added Successfully!");
          setAlertStatus("success");
          setShowAlert(true);
        } else {
          setPopupVisible1(false);
          setAlertMessage("Failed adding facilities.");
          setAlertStatus("error");
          setShowAlert(true);
          console.error("Error submitting data:", response.statusText);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    }
  };
  const [counts, setCounts] = useState({
    properties: 0,
    otherBuildings: 0,
    condominiums: 0,
    locations: 0,
  });

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

  const handleNumberOfLocationsChange = (value) => {
    const updatedLocationInputs = [...locationInputs];

    // Check if the first item exists in the array, and then update its numberOfLocations
    if (updatedLocationInputs[0]) {
      updatedLocationInputs[0].numberOfLocations = value;
    } else {
      // Initialize it properly if it's undefined
      updatedLocationInputs[0] = {
        numberOfLocations: value,
        propertyId: "",
        name: "",
        location: "",
        specific_location: "",
        lat: "",
        lng: "",
        path: "",
      };
    }

    setLocationInputs(updatedLocationInputs); // Update the state with the new value
  };

  const handleDelete = async () => {
    // Extract property IDs from selectedItems
    const idsToDelete = selectedItems.map((item) => item.propertyId);

    // Check if there are any IDs to delete
    if (idsToDelete.length === 0) {
      setAlertMessage("Failed to delete items.");
      setAlertStatus("error");
      setShowAlert(true);
      // Exit if no IDs are selected
    }
    let url;
    if (viewType === "location") {
      url = "http://localhost:8000/api/admin/deletelocation";
    } else if (viewType === "properties") {
      url = "http://localhost:8000/api/admin/deleteproperty";
    } else if (viewType === "buildings") {
      url = "http://localhost:8000/api/admin/deletebuilding";
    } else if (viewType === "features") {
      url = "http://localhost:8000/api/admin/deletefeature";
    } else if (viewType === "facilities") {
      url = "http://localhost:8000/api/admin/deletefacility";
    } else {
      console.error("Invalid viewType");
      return; // Exit if viewType is invalid
    }

    if (idsToDelete.length === 0) {
      console.error("No IDs selected for deletion.");
      return; // Exit if no IDs are selected
    }

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: idsToDelete }), // Send the array of IDs as JSON
      });

      if (!response.ok) {
        throw new Error(`Error deleting items: ${response.statusText}`);
      }
      setPopupVisible1(false);

      clearSelectedItems();
      setAlertMessage("Deleted Successfully!");
      setAlertStatus("success");
      setShowAlert(true);
    } catch (error) {
      clearSelectedItems();
      setPopupVisible1(false);
      setAlertMessage("Failed to delete items.");
      setAlertStatus("error");
      setShowAlert(true);
    }

    if (selectedItems[0].viewType === "location") {
      fetchLocations(); // Ensure to call the function with parentheses
    } else if (selectedItems[0].viewType === "properties") {
      fetchProperties(); // Ensure to call the function with parentheses
    } else if (selectedItems[0].viewType === "buildings") {
      fetchBuildings(); // Ensure to call the function with parentheses
    } else if (selectedItems[0].viewType === "features") {
      fetchFeatures(); // Ensure to call the function with parentheses
    } else if (selectedItems[0].viewType === "facilities") {
      fetchFacilities(); // Ensure to call the function with parentheses
    }
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // 5000ms = 5 seconds

      return () => clearTimeout(timer); // Clear the timer if the component unmounts or showAlert changes
    }
  }, [showAlert]);

  const groupFacilitiesByProperty = (facilities) => {
    const grouped = facilities.reduce((acc, facility) => {
      const { property_id, name } = facility;
      if (!acc[property_id]) {
        acc[property_id] = {
          property_id: property_id,
          facilities: [],
        };
      }
      acc[property_id].facilities.push(name);
      return acc;
    }, {});

    // Convert grouped object into an array
    return Object.values(grouped);
  };
  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/locations");
      const data = await response.json();
      setData(data); // Store fetched properties
      setViewType("location"); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  const fetchProperties = async () => {
    clearSelectedItems();
    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/properties"
      ); // Fetch properties API
      const data = await response.json();
      setData(data); // Store fetched properties
      setViewType("properties"); // Set view type to properties
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  const fetchBuildings = async () => {
    clearSelectedItems();
    try {
      const response = await fetch("http://localhost:8000/api/admin/buildings"); // Fetch buildings API
      const data = await response.json();
      setData(data); // Store fetched buildings
      setViewType("buildings"); // Set view type to buildings
    } catch (error) {
      console.error("Failed to fetch buildings:", error);
    }
  };
  // Fetch facilities data and group it by property_id
  const fetchFacilities = async () => {
    clearSelectedItems();
    try {
      const response = await fetch(
        "http://localhost:8000/api/admin/facilities"
      );
      const facilitiesData = await response.json();

      // Group the facilities by property_id
      const groupedFacilities = groupFacilitiesByProperty(facilitiesData);
      setData(groupedFacilities); // Set the grouped data
      setViewType("facilities"); // Set view type to facilities
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
    }
  };
  const fetchFeatures = async () => {
    clearSelectedItems();
    try {
      const response = await fetch("http://localhost:8000/api/admin/features"); // Fetch features API
      const data = await response.json();
      setData(data); // Store fetched features
      setViewType("features"); // Set view type to features

    } catch (error) {
      console.error("Failed to fetch features:", error);
    }
  };

  const FeaturesHeaders = ["Property ID", "Features", "CRUD"];
  const facilityHeaders = ["Property ID", "Facilities", "CRUD"];

  const propertyHeaders = [
    "Property ID",
    "Building Name",
    "Status",
    "Development Type",
    "Price Range",
    "Architectural Theme",
    "CRUD",
  ];

  const buildingHeaders = [
    "Property ID",
    "Building Name",
    "Development Type",
    "Residential Levels",
    "Basement Parking Levels",
    "Podium Parking Levels",
    "Commercial Units",
    "CRUD",
  ];
  const locationHeaders = [
    "Building Name",
    "Location",
    "Specific Location",
    "Lat",
    "Lng",
    "CRUD",
  ];
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setError("");

    try {
      // Send the form data to the backend
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST", // Ensure that the method is POST, not GET
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
      } else {
        const data = await response.json();
  
      }

      // If login is successful, handle the success (redirect or update UI)
      const data = await response.json();

      // You can store the user data or token here if needed
      closePopup(); // Close the popup after successful login
    } catch (error) {
      // Handle error and show the error message
      console.error("Error during login:", error);
      setError(error.message);
    }
  };

  return (
    <>
      {showAlert && (
        <div className="alert-container">
          <Alert status={alertStatus} className={`custom-alert ${alertStatus}`}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>
              {alertStatus === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      {/** {isVisible && (
      <div className="popup-container">
        <div className="popup-content">
          <h2>ACCOUNT</h2>
          <form>
            
         <div >
          <label>Email:</label>

         <input 
          type="email" 
          id="email"  
          className="h-10 text-1xl w-full indent-5 border border-stone-950 rounded-md"  
          name="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />

        </div>
        <br/>
        <div className="flex gap-6">
          <div>
                    <label>Password:</label>
                    <input 
                    className="h-10 text-1xl w-40 indent-5 border border-stone-950 rounded-md"  
                        type="password" 
                          id="password" 
                          name="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                    />
                  </div>
                  <div>
                    <label>Company Code: </label>
                    <input 
                          className="h-10 text-1xl w-40 indent-5 border border-stone-950 rounded-md"  
                        type="password"  // Use password input for the 'code'
                          id="code"        // Unique id for the 'code' field
                          name="code"      // Unique name for the 'code' field
                          value={code}     // Track 'code' state
                          onChange={(e) => setCode(e.target.value)} 
                          required 
                    />
                  </div>
        </div>
        


            {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="w-full flex gap-14 pl-20">
        
            <button  className="relative -ml-16 w-32" type="submit" onClick={handleRegister}>
              REGISTER
            </button>

        
            <button type="submit" className="relative w-32" onClick={handleLogin}>
              LOGIN
            </button>
   
           </div>
          </form>
        </div>

   
        <div className="popup-overlay" ></div>
      </div>
    )} 
 */}

      <header className="-mt-14">
        <div className="logosec">
          <Link href="/">
            <div
              className="logo"
              style={{ cursor: "pointer", color: "darkblue" }}
            >
              ALVEO LAND
            </div>
          </Link>
        </div>

        <div className="message">
          <div className="circle"></div>
          <img
            src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/8.png"
            className="icn"
            alt=""
            width={20} // You can adjust these dimensions
            height={20}
          />
          <div className="dp">
            <img
              src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180014/profile-removebg-preview.png"
              className="dpicn"
              alt="dp"
              width={40} // You can adjust these dimensions
              height={40}
            />
          </div>
        </div>
      </header>
      <div className="main-container">
        <div className="navcontainer">
          <nav className="nav">
            <div className="nav-upper-options">
              <div className="nav-option option1" onClick={fetchLocations}>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210182148/Untitled-design-(29).png"
                  className="nav-img"
                  alt="dashboard"
                  width={40} // Adjust width as necessary
                  height={40} // Adjust height as necessary
                />
                <h3>Locations</h3>
              </div>

              <div className="option2 nav-option" onClick={fetchProperties}>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183322/9.png"
                  className="nav-img"
                  alt="articles"
                  width={40}
                  height={40}
                />
                <h3>Buildings</h3>
              </div>

              <div className="nav-option option3" onClick={fetchBuildings}>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183320/5.png"
                  className="nav-img"
                  alt="report"
                  width={40}
                  height={40}
                />
                <h3>Other Buildings</h3>
              </div>

              <div className="nav-option option4" onClick={fetchFeatures}>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/6.png"
                  className="nav-img"
                  alt="institution"
                  width={40}
                  height={40}
                />
                <h3>Building Features</h3>
              </div>

              <div className="nav-option option5" onClick={fetchFacilities}>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183323/10.png"
                  className="nav-img"
                  alt="profile"
                  width={40}
                  height={40}
                />
                <h3>Facilities</h3>
              </div>

              <div className="nav-option logout" style={{ cursor: "pointer" }}>
                <img
                  src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
                  className="nav-img"
                  alt="logout"
                  width={40}
                  height={40}
                />
                <h3>Logout</h3>
              </div>
            </div>
          </nav>
        </div>

        <div className="main">
          <div className="searchbar2">
            <input type="text" placeholder="Search" />
            <div className="searchbtn">
              <img
                src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                className="icn srchicn"
                alt="search-button"
                width={20}
                height={20}
              />
            </div>
          </div>

          <div className="box-container">
            <div className="box box1">
              <div className="text">
                <h2 className="topic-heading">{counts.properties}</h2>
                <h2 className="topic">Properties</h2>
              </div>
              <img src="/assets/town.png" alt="Views" width={50} height={50} />
            </div>

            <div className="box box2">
              <div className="text">
                <h2 className="topic-heading">{counts.otherBuildings}</h2>
                <h2 className="topic">Other Buildings</h2>
              </div>
              <img
                src="/assets/neighborhood.png"
                alt="likes"
                width={50}
                height={50}
              />
            </div>

            <div className="box box3">
              <div className="text">
                <h2 className="topic-heading">{counts.condominiums}</h2>
                <h2 className="topic">Condominiums</h2>
              </div>
              <img
                src="/assets/skyline.png"
                alt="comments"
                width={50}
                height={50}
              />
            </div>

            <div className="box box4">
              <div className="text">
                <h2 className="topic-heading">{counts.locations}</h2>
                <h2 className="topic">Locations</h2>
              </div>
              <img
                src="/assets/location.png"
                alt="published"
                width={50}
                height={50}
              />
            </div>
          </div>
          {isPopupVisible && (
            <div className="popup-overlay1">
              <div className="popup-content1">
                {/* Display all selected items */}
                <div className="selected-items-container">
                  <h2>Selected Items</h2>
                  {selectedItems.length > 0 ? (
                    selectedItems.map((selectedItem, index) => (
                      <div key={index} className="selected-item">
                        <p>
                          <strong>Property ID:</strong>{" "}
                          {selectedItem.propertyId}
                        </p>

                        {selectedItem.viewType === "location" &&
                          Object.entries(selectedItem.item).map(
                            ([key, value]) =>
                              [
                                "name",
                                "location",
                                "specific_location",
                                "lat",
                                "lng",
                              ].includes(key) && (
                                <label key={key}>
                                  <strong>
                                    {key
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (char) =>
                                        char.toUpperCase()
                                      )}
                                    :
                                  </strong>
                                  <input
                                    type="text"
                                    value={value ?? "N/A"} // Ensure value is controlled here
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      handleUpdate(
                                        selectedItem.propertyId,
                                        key,
                                        newValue
                                      );

                                      // Automatically fetch lat and lng when specific_location changes
                                      if (key === "specific_location") {
                                        fetchGeolocation(
                                          newValue,
                                          selectedItem.propertyId
                                        );
                                      }
                                    }}
                                  />
                                </label>
                              )
                          )}
                        {selectedItem.viewType === "properties" &&
                          Object.entries(selectedItem.item).map(
                            ([key, value]) =>
                              [
                                "name",
                                "status",
                                "location",
                                "specific_location",
                                "development_type",
                                "price_range",
                                "architectural_theme",
                                "land_area",
                              ].includes(key) && (
                                <label key={key}>
                                  <strong>
                                    {key
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (char) =>
                                        char.toUpperCase()
                                      )}
                                    :
                                  </strong>
                                  <input
                                    type="text"
                                    defaultValue={value ?? "N/A"}
                                    onChange={(e) =>
                                      handleUpdate(
                                        selectedItem.propertyId,
                                        key,
                                        e.target.value
                                      )
                                    }
                                  />
                                </label>
                              )
                          )}

                        {selectedItem.viewType === "buildings" &&
                          Object.entries(selectedItem.item).map(
                            ([key, value]) =>
                              [
                                "name",
                                "development_type",
                                "residential_levels",
                                "basement_parking_levels",
                                "podium_parking_levels",
                                "commercial_units",
                              ].includes(key) && (
                                <label key={key}>
                                  <strong>
                                    {key
                                      .replace(/_/g, " ")
                                      .replace(/\b\w/g, (char) =>
                                        char.toUpperCase()
                                      )}
                                    :
                                  </strong>
                                  <input
                                    type="text"
                                    defaultValue={value ?? "N/A"}
                                    onChange={(e) =>
                                      handleUpdate(
                                        selectedItem.propertyId,
                                        key,
                                        e.target.value
                                      )
                                    }
                                  />
                                </label>
                              )
                          )}
                        {selectedItem.viewType === "facilities" && (
                          <>
                            <strong>Facilities:</strong>

                            {selectedItem.item.map((facility, idx) => (
                              <label key={idx}>
                                <strong> {idx + 1}:</strong>
                                <input
                                  type="text"
                                  defaultValue={facility}
                                  onChange={(e) =>
                                    handleFacilityUpdate(
                                      selectedItem.propertyId,
                                      idx,
                                      e.target.value
                                    )
                                  }
                                />
                              </label>
                            ))}
                          </>
                        )}
                        {selectedItem.viewType === "features" && (
                          <>
                            <strong>Features:</strong>

                            {selectedItem.item.map((feature, idx) => (
                              <label key={idx}>
                                <strong>{idx + 1}:</strong>
                                <input
                                  type="text"
                                  defaultValue={feature.name}
                                  onChange={(e) =>
                                    handleFeatureUpdate(
                                      selectedItem.propertyId,
                                      idx,
                                      e.target.value
                                    )
                                  }
                                />
                              </label>
                            ))}
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No items selected.</p>
                  )}
                  <button
                    className="close-button1"
                    onClick={handleUpdateValues}
                  >
                    Update
                  </button>
                  <button
                    className="close-button1"
                    onClick={() => setPopupVisible(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          {isPopupVisible1 && (
            <div className="popup-overlay2">
              <div className="popup-content2">
                <div className="selected-items-container">
                  <div className="selected-item">
                    {(selectedItems.length > 0 &&
                      selectedItems[0].viewType === "location") ||
                    (selectedItems.length === 0 && viewType === "location") ? (
                      <>
                        <label style={{ fontSize: "30px", marginLeft: "35%" }}>
                          Location
                        </label>
                        <label htmlFor={`numberOfLocations`}>
                          Number of locations to add:
                        </label>
                        <input
                          type="number"
                          id={`numberOfLocations`}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0; // Ensure it's a valid number
                            handleNumberOfLocationsChange(value); // Update the state for number of locations
                          }}
                          min="0" // Prevent negative numbers
                        />

                        {/* Render input boxes for each location */}
                        {locationInputs[0] &&
                          locationInputs[0].numberOfLocations > 0 &&
                          renderLocationInputs(locationInputs[0].propertyId)}
                      </>
                    ) : (selectedItems.length > 0 &&
                        selectedItems[0].viewType === "properties") ||
                      (selectedItems.length === 0 &&
                        viewType === "properties") ? (
                      <>
                        <label style={{ fontSize: "30px", marginLeft: "35%" }}>
                          Property
                        </label>
                        {/* Pass a unique propertyId manually. For example, using a counter or similar logic */}
                        {propertyInput.map((_, index) =>
                          renderPropertyInputs(index)
                        )}
                      </>
                    ) : selectedItems.length > 0 &&
                      selectedItems[0].viewType === "buildings" ? (
                      <>
                        <label style={{ fontSize: "30px", marginLeft: "35%" }}>
                          Building
                        </label>
                        {selectedItems.map((item) => (
                          <div
                            key={item.propertyId}
                            className="property-container"
                          >
                            <h3>Property ID: {item.propertyId}</h3>

                            {/* Input for Number of Buildings */}
                            <label
                              htmlFor={`numberOfBuildings-${item.propertyId}`}
                            >
                              Number of buildings to add:
                            </label>
                            <input
                              type="number"
                              id={`numberOfBuildings-${item.propertyId}`}
                              onChange={(e) =>
                                handleNumberOfBuildingsChange(
                                  item.propertyId,
                                  Number(e.target.value)
                                )
                              }
                              min="0"
                            />

                            {/* Render building inputs for the curr ent item */}
                            {renderBuildingInputs(item.propertyId)}
                          </div>
                        ))}
                      </>
                    ) : selectedItems.length === 0 &&
                      viewType === "buildings" ? (
                      <>
                        <label style={{ fontSize: "30px", marginLeft: "35%" }}>
                          Building
                        </label>
                        <label htmlFor={`propertyId-input`}>Property ID:</label>
                        <input
                          type="text"
                          id="propertyId-input"
                          placeholder="Enter Property ID"
                          onChange={(e) => {
                            const newPropertyId = e.target.value.trim();
                            if (newPropertyId) {
                              handlePropertyIdChange(null, newPropertyId);
                              setBuildingInputs([
                                {
                                  propertyId: newPropertyId,
                                  numberOfBuildings: 0,
                                  buildings: [],
                                },
                              ]);
                       
                            }
                          }}
                        />

                        <label htmlFor={`numberOfBuildings`}>
                          Number of buildings to add:
                        </label>
                        <input
                          type="number"
                          id={`numberOfBuildings`}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0; // Ensure it's a number
                            handleNumberOfBuildingsChange(
                              buildingInputs[0]?.propertyId || "",
                              value
                            ); // Use existing property ID
                          }}
                          min="0" // Prevent negative numbers
                        />

                        {/* Render input boxes for each building */}
                        {buildingInputs.length > 0 &&
                          buildingInputs[0].numberOfBuildings > 0 &&
                          renderBuildingInputs(buildingInputs[0].propertyId)}
                      </>
                    ) : selectedItems.length === 0 &&
                      viewType === "facilities" ? ( // Condition met for no selected items
                      <>
                        <label style={{ fontSize: "30px", marginLeft: "35%" }}>
                          Facility
                        </label>
                        <label htmlFor={`propertyId-input`}>Property ID:</label>
                        <input
                          type="text"
                          id="propertyId-input"
                          placeholder="Enter Property ID"
                          onChange={(e) => {
                            const newPropertyId = e.target.value.trim();
                            if (newPropertyId) {
                              setPropertyId(newPropertyId); // Store in state
                              handlePropertyIdChange(null, newPropertyId);
                              setFacilityInputs([
                                { propertyId: newPropertyId, inputs: [] },
                              ]);
                      
                            }
                          }}
                        />

                        <label htmlFor={`numberOfFacilities`}>
                          Number of facilities to add:
                        </label>
                        <input
                          type="number"
                          id={`numberOfFacilities`}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0; // Ensure it's a number
                            // Generate empty inputs based on the number provided
                            setFacilityInputs([
                              {
                                propertyId: propertyId,
                                inputs: Array(value).fill(""),
                              },
                            ]); // Use the existing propertyId from state
                            handleNumberOfFacilitiesChange(null, {
                              target: { value },
                            }); // Use null for propertyId
                          }}
                          min="0" // Prevent negative numbers
                        />

                        {/* Render input boxes for each facility */}
                        {facilityInputs.length > 0 &&
                          facilityInputs[0].inputs.length > 0 &&
                          renderFacilityInputs(
                            facilityInputs[0].propertyId,
                            facilityInputs[0].inputs
                          )}
                      </>
                    ) : selectedItems.length > 0 &&
                      selectedItems[0].viewType === "facilities" ? (
                      <>
                        <label style={{ fontSize: "30px", marginLeft: "35%" }}>
                          Facility
                        </label>
                        {selectedItems.map((item) => (
                          <div key={item.propertyId}>
                            <h3>Property ID: {item.propertyId}</h3>
                            <label
                              htmlFor={`numberOfFacilities-${item.propertyId}`}
                            >
                              Number of facilities to add:
                            </label>
                            <input
                              type="number"
                              id={`numberOfFacilities-${item.propertyId}`}
                              onChange={(e) =>
                                handleNumberOfFacilitiesChange(
                                  item.propertyId,
                                  e
                                )
                              }
                              min="0" // Prevent negative numbers
                            />

                            {/* Render input boxes for each facility for the specific property */}
                            {facilityInputs
                              .filter(
                                (input) => input.propertyId === item.propertyId
                              )
                              .map((inputData) =>
                                renderFacilityInputs(
                                  inputData.propertyId,
                                  inputData.inputs
                                )
                              )}
                          </div>
                        ))}
                      </>
                    ) : selectedItems.length > 0 &&
                      selectedItems[0].viewType === "features" ? (
                      <>
                        <label style={{ fontSize: "30px", marginLeft: "35%" }}>
                          Feature
                        </label>
                        {selectedItems.map((item) => (
                          <div key={item.propertyId}>
                            <h3>Property ID: {item.propertyId}</h3>
                            <label
                              htmlFor={`numberOfFeatures-${item.propertyId}`}
                            >
                              Number of features to add:
                            </label>
                            <input
                              type="number"
                              id={`numberOfFeatures-${item.propertyId}`}
                              onChange={(e) =>
                                handleNumberOfFeaturesChange(item.propertyId, e)
                              }
                              min="0"
                            />
                            {featureInputs
                              .filter(
                                (input) => input.propertyId === item.propertyId
                              )
                              .map((inputData) =>
                                renderFeatureInputs(
                                  item.propertyId,
                                  inputData.inputs
                                )
                              )}
                          </div>
                        ))}
                      </>
                    ) : selectedItems.length === 0 &&
                      viewType === "features" ? (
                      <>
                        <label style={{ fontSize: "30px", marginLeft: "35%" }}>
                          Feature
                        </label>
                        <div>
                          <label htmlFor="propertyIdInput">Property ID:</label>
                          <input
                            type="text"
                            id="propertyIdInput"
                            placeholder="Enter Property ID"
                            onChange={(e) => {
                              const newPropertyId = e.target.value.trim();
                              if (newPropertyId) {
                                setPropertyId(newPropertyId);
                                handlePropertyIdChange("", newPropertyId);
                                setFeatureInputs([
                                  { propertyId: newPropertyId, inputs: [] },
                                ]);
                              }
                            }}
                          />

                          <label htmlFor="numberOfFeatures">
                            Number of features to add:
                          </label>
                          <input
                            type="number"
                            id="numberOfFeatures"
                            onChange={(e) =>
                              handleNumberOfFeaturesChange(null, e)
                            }
                            min="0"
                          />

                          {featureInputs.map((inputData, propertyIndex) =>
                            renderFeatureInputs(null, inputData.inputs)
                          )}
                        </div>
                      </>
                    ) : (
                      <p>No facilities to display.</p> // Display when selectedItems is not available
                    )}
                    <button onClick={handleAddSubmit}>Add</button>{" "}
                    {/* Button to capture data */}
                    <button onClick={() => setPopupVisible1(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="report-container">
            <div className="report-header">
              <h1 className="recent-Articles">PROPERTIES</h1>
              <div className="buttons">
                <button className="add" onClick={handleAdd}>
                  Add
                </button>
                <button className="update" onClick={handleUpdate}>
                  Update
                </button>
                <button className="delete" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>

            <div className="report-body">
              <table className="property-table">
                <thead>
                  <tr className="report-topic-heading">
                    {/* Dynamic headers based on viewType */}
                    {(viewType === "properties"
                      ? propertyHeaders
                      : viewType === "buildings"
                      ? buildingHeaders
                      : viewType === "features"
                      ? FeaturesHeaders
                      : viewType === "location"
                      ? locationHeaders
                      : facilityHeaders
                    ).map((header, index) => (
                      <th key={index} className="t-op">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.id || index}>
                      {viewType === "location" ? (
                        <>
                          <td className="t-op-nextlvl">{item.name ?? "N/A"}</td>
                          <td className="t-op-nextlvl">
                            {item.location ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            {item.specific_location ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">{item.lat ?? "N/A"}</td>
                          <td className="t-op-nextlvl">{item.lng ?? "N/A"}</td>
                          <td className="t-op-nextlvl">
                            <input
                              type="checkbox"
                              onChange={() =>
                                handleCRUD(item.id, viewType, item)
                              }
                              checked={isSelected(item.id)} // Check if the item is selected
                              style={{
                                position: "relative",
                                marginLeft: "20px",
                              }}
                            />
                          </td>
                        </>
                      ) : viewType === "properties" ? (
                        <>
                          <td className="t-op-nextlvl">{item.id ?? "N/A"}</td>
                          <td className="t-op-nextlvl">{item.name ?? "N/A"}</td>
                          <td className="t-op-nextlvl">
                            {item.status ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            {item.development_type ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            {item.price_range ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            {item.architectural_theme ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            <input
                              type="checkbox"
                              onChange={() =>
                                handleCRUD(item.id, viewType, item)
                              }
                              checked={isSelected(item.id)} // Check if the item is selected
                              style={{
                                position: "relative",
                                marginLeft: "20px",
                              }}
                            />
                          </td>
                        </>
                      ) : viewType === "buildings" ? (
                        <>
                          <td className="t-op-nextlvl">
                            {item.property_id ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">{item.name ?? "N/A"}</td>
                          <td className="t-op-nextlvl">
                            {item.development_type ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            {item.residential_levels ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            {item.basement_parking_levels ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            {item.podium_parking_levels ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            {item.commercial_units ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            <input
                              type="checkbox"
                              onChange={(event) =>
                                handleCRUD(item.property_id, viewType, item)
                              } // Replace 'viewType' with actual viewType if needed
                              checked={isSelected(item.property_id)}
                            />
                          </td>
                        </>
                      ) : viewType === "features" ? (
                        <>
                          <td className="t-op-nextlvl">{item.id ?? "N/A"}</td>
                          {/* Parse the features string and join the names */}
                          <td className="t-op-nextlvl">
                            {item.features
                              ? JSON.parse(item.features)
                                  .map((feature) => feature.name)
                                  .join(", ")
                              : "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            <input
                              type="checkbox"
                              onChange={() =>
                                handleCRUD(item.id, viewType, item.features)
                              }
                              // Optional: Add logic to check if this item is selected
                              checked={isSelected(item.id)}
                            />
                          </td>
                        </>
                      ) : viewType === "facilities" ? ( // New condition for facilities
                        <>
                          <td className="t-op-nextlvl">
                            {item.property_id ?? "N/A"}
                          </td>
                          {/* Assuming item.facilities is an array */}
                          <td className="t-op-nextlvl">
                            {item.facilities.join(", ") ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            <input
                              type="checkbox"
                              onChange={() =>
                                handleCRUD(
                                  item.property_id,
                                  viewType,
                                  item.facilities
                                )
                              }
                              // Optional: Add logic to check if this item is selected
                              checked={isSelected(item.property_id)}
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="t-op-nextlvl">
                            {item.property_id ?? "N/A"}
                          </td>
                          {/* Combine all facilities into one string */}
                          <td className="t-op-nextlvl">
                            {item.facilities.join(", ") ?? "N/A"}
                          </td>
                          <td className="t-op-nextlvl">
                            <input
                              type="checkbox"
                              onChange={() =>
                                handleCRUD(
                                  item.propertyId,
                                  viewType,
                                  item,
                                  facilitiesData,
                                  featuresData
                                )
                              }
                              //checked={isSelected(item.propertyId)}
                              // This will uncheck the box when the selectedItems array is empty
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Popup overlay */

        .topic {
          font-size: 18px !important;
          margin-left: -10px;
        }

        .box-container img {
          margin-top: -30px !important;
        }
        .popup-overlay2 {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(
            0,
            0,
            0,
            0.5
          ); /* Transparent background to darken the overlay */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999; /* Ensure it's on top of other elements */
        }

        /* Popup content container */
        .popup-content2 {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
          overflow-y: auto;
        }

        /* Selected items container */
        .selected-items-container {
          margin-bottom: 20px;
        }

        /* Input labels */
        label {
          font-weight: bold;
          margin-top: 10px;
          display: block;
          margin-bottom: 5px;
        }

        /* Input fields */
        input[type="text"],
        input[type="number"],
        input[type="file"] {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        /* Adjust the file input */
        input[type="file"] {
          padding: 5px;
        }

        /* Add button styling */
        button {
          background-color: #4caf50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 10px;
        }

        button:hover {
          background-color: #45a049;
        }

        /* Styling for the "close" button */
        button.close {
          background-color: #f44336;
        }

        button.close:hover {
          background-color: #e53935;
        }

        /* Grid for input fields */

        /* Enhance the visibility of sections */
        h2,
        h3 {
          margin-top: 20px;
          font-size: 18px;
          font-weight: bold;
        }

        /* Add a margin around the buttons */
        button {
          margin-top: 15px;
        }

        /* Responsive design for smaller screens */
        @media (max-width: 600px) {
          .input-grid {
            grid-template-columns: 1fr;
          }
        }

        /* General Styles for Forms */
        .input-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .input-grid label {
          font-size: 14px;
          color: #333;
          margin-bottom: 5px;
        }

        .input-grid input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
          background-color: #f9f9f9;
          transition: border-color 0.3s ease;
        }

        .input-grid input:focus {
          border-color: #007bff;
          outline: none;
        }

        .input-grid input[type="file"] {
          padding: 5px;
          border: none;
          background-color: #f0f0f0;
        }

        .input-grid input[type="file"]:hover {
          cursor: pointer;
        }

        .location-input,
        .property-input {
          margin-bottom: 20px;
          font-weight: bold;
          font-size: 30px !important;
        }

        .location-input:last-child,
        .property-input:last-child {
          margin-bottom: 0;
          font-weight: bold;
          font-size: 30px !important;
        }

        /* Button Styling */
        .action-button {
          padding: 12px 25px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }

        .action-button:hover {
          background-color: #0056b3;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .input-grid {
            grid-template-columns: 1fr;
          }

          .input-grid label {
            font-size: 16px;
          }

          .input-grid input {
            font-size: 14px;
          }

          .action-button {
            width: 100%;
          }
        }

        h2 {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: #333;
        }

        /* Form Elements */
        label {
          font-size: 1rem;
          margin-bottom: 8px;
          color: #555;
        }

        input[type="number"],
        input[type="text"] {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 1rem;
          color: #333;
          box-sizing: border-box;
        }

        input[type="number"]:focus,
        input[type="text"]:focus {
          outline: none;
          border-color: #007bff;
        }

        /* Button Styling */
        button {
          background-color: #007bff;
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #0056b3;
        }

        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        /* Add spacing between sections */
        .selected-items-container2 {
          margin-bottom: 20px;
        }

        /* Scrollable container for inputs */
        .selected-items-container {
          max-height: 400px; /* Set max height for scrolling */
          overflow-y: auto; /* Enable scrolling if content overflows */
        }

        /* Close Button Styling */
        button.close-popup {
          background-color: #dc3545; /* Red color */
          margin-top: 20px;
        }

        button.close-popup:hover {
          background-color: #c82333;
        }
        /* Add to styles.css or your relevant stylesheet */
        .alert-container {
          position: fixed;
          top: 310px;
          right: 20px;
          z-index: 1010;
          max-width: 200px;
        }

        .custom-alert {
          color: white;
          border-radius: 8px;
          padding: 10px 20px;
        }

        .custom-alert.success {
          background-color: #28a745; /* Green for success */
        }

        .custom-alert.error {
          background-color: #dc3545; /* Red for error */
        }

        .alert-container .alert {
          margin-bottom: 10px;
          z-index: 9999;
        }

        /* Optional: Animation for smooth appearance */
        .alert-container {
          z-index: 9999;
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .building-form {
          font-family: "Arial", sans-serif;
          background-color: #f4f4f4; /* Light background for contrast */
          margin: 0;
          padding: 20px; /* Padding for body to avoid edge contact */
        }

        .building-form h2 {
          text-align: center;
          color: #333; /* Darker color for the main heading */
        }

        .building-form h3 {
          color: #555; /* Slightly lighter for property headings */
          margin-top: 20px; /* Space above each property heading */
        }

        .building-input {
          background-color: #fff; /* White background for input containers */
          border-radius: 8px; /* Rounded corners */
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
          padding: 20px; /* Padding inside the input container */
          margin-bottom: 20px; /* Space between each building input */
        }

        .label {
          display: block; /* Labels take full width */
          margin-bottom: 8px; /* Space between label and input */
          font-weight: bold; /* Bold for better readability */
          color: #333; /* Darker color for labels */
        }

        input[type="text"],
        input[type="number"] {
          padding: 12px; /* Padding for inputs */
          border: 1px solid #ccc; /* Light border */
          border-radius: 4px; /* Slight rounding of corners */
          transition: border-color 0.3s; /* Smooth transition for border color */
          width: 100%; /* Full width of the container */
          box-sizing: border-box; /* Include padding and border in the element's total width and height */
        }

        input[type="text"]:focus,
        input[type="number"]:focus {
          border-color: #007bff; /* Highlight border color on focus */
          outline: none; /* Remove default outline */
        }

        input[type="number"] {
          -moz-appearance: textfield; /* Style for Firefox */
        }

        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none; /* Remove spin buttons */
        }

        button {
          background-color: #007bff; /* Primary button color */
          color: #fff; /* Text color for buttons */
          border: none; /* Remove border */
          border-radius: 4px; /* Rounded corners */
          padding: 10px 15px; /* Padding for button */
          cursor: pointer; /* Pointer cursor for buttons */
          transition: background-color 0.3s; /* Smooth transition for background color */
        }

        button:hover {
          background-color: #0056b3; /* Darker shade on hover */
        }

        .image-preview {
          margin-top: 10px; /* Space above image preview */
        }

        .image-preview img {
          max-width: 100%; /* Responsive image */
          border-radius: 4px; /* Rounded corners for image preview */
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Light shadow for image preview */
        }

        /* Popup Overlay Styles */
        .popup-overlay2 {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(
            0,
            0,
            0,
            0.7
          ); /* Semi-transparent background */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000; /* High z-index to appear above other content */
        }

        /* Popup Content Styles */
        .popup-content2 {
          background-color: #ffffff; /* White background for the popup */
          border-radius: 8px;
          padding: 20px;
          max-width: 500px; /* Limit the width of the popup */
          width: 100%; /* Make it responsive */
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
        }
        .selected-items-container2 {
          max-height: 400px; /* Set max height for scrolling */
          overflow-y: auto; /* Enable scrolling if content overflows */
          margin-bottom: 20px; /* Space below the items */
        }
        /* Popup Overlay Styles */
        .popup-overlay1 {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(
            0,
            0,
            0,
            0.7
          ); /* Semi-transparent background */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000; /* High z-index to appear above other content */
        }

        /* Popup Content Styles */
        .popup-content1 {
          background-color: #ffffff; /* White background for the popup */
          border-radius: 8px;
          padding: 20px;
          max-width: 500px; /* Limit the width of the popup */
          width: 100%; /* Make it responsive */
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
        }

        /* Selected Items Container Styles */
        .selected-items-container {
          max-height: 400px; /* Set max height for scrolling */
          overflow-y: auto; /* Enable scrolling if content overflows */
          margin-bottom: 20px; /* Space below the items */
        }

        /* Selected Item Styles */
        .selected-item {
          margin-bottom: 15px; /* Space between selected items */
          padding: 10px;
          border: 1px solid #e0e0e0; /* Light border */
          border-radius: 4px; /* Slightly rounded corners */
          background-color: #f9f9f9; /* Light grey background */
        }

        /* Label Styles */
        label {
          display: block; /* Make labels block-level for better spacing */
          margin: 8px 0; /* Vertical spacing */
        }

        /* Input Styles */
        input[type="text"] {
          width: calc(95% - 20px); /* Full width minus padding */
          padding: 10px; /* Padding inside the input */
          border: 1px solid #ccc; /* Border color */
          border-radius: 4px; /* Rounded corners */
          font-size: 16px; /* Increase font size for readability */
        }

        /* Button Styles */
        .close-button1 {
          margin-left: 22%;
          background-color: #007bff; /* Blue background for buttons */
          color: white; /* White text */
          border: none; /* Remove border */
          border-radius: 4px; /* Rounded corners */
          padding: 10px 15px; /* Padding inside the button */
          font-size: 16px; /* Font size for the button text */
          cursor: pointer; /* Pointer cursor on hover */
          margin-top: 10px; /* Space above the button */
          transition: background-color 0.3s ease; /* Smooth background transition */
        }

        /* Button Hover Effect */
        .close-button1:hover {
          background-color: #0056b3; /* Darker blue on hover */
        }

        /* Headings */
        h2 {
          font-size: 24px; /* Font size for the title */
          margin-bottom: 20px; /* Space below the title */
          color: #333; /* Darker text color for headings */
          margin-left: 30%;
        }

        .popup-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1001;
          width: 20%;
        }
        .popup-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .submit-button,
        .close-button {
          margin-right: 10px;
        }
        @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Poppins", sans-serif;
        }
        :root {
          --background-color1: #fafaff;
          --background-color2: #ffffff;
          --background-color3: #ededed;
          --background-color4: #cad7fda4;
          --primary-color: #4b49ac;
          --secondary-color: #0c007d;
          --Border-color: #3f0097;
          --one-use-color: #3f0097;
          --two-use-color: #5500cb;
        }
        body {
          background-color: var(--background-color4);
          max-width: 100%;
          overflow-x: hidden;
        }

        header {
          height: 70px;
          width: 100vw;
          padding: 0 30px;
          background-color: var(--background-color1);
          position: fixed;
          z-index: 100;
          box-shadow: 1px 1px 15px rgba(161, 182, 253, 0.825);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 27px;
          font-weight: 600;
          color: rgb(47, 141, 70);
        }

        .icn {
          height: 30px;
        }
        .menuicn {
          cursor: pointer;
        }

        .searchbar,
        .message,
        .logosec {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .searchbar2 {
          display: none;
        }

        .logosec {
          gap: 60px;
        }

        .searchbar input {
          width: 250px;
          height: 42px;
          border-radius: 50px 0 0 50px;
          background-color: var(--background-color3);
          padding: 0 20px;
          font-size: 15px;
          outline: none;
          border: none;
        }
        .searchbtn {
          width: 50px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0px 50px 50px 0px;
          background-color: var(--secondary-color);
          cursor: pointer;
        }

        .message {
          gap: 40px;
          position: relative;
          cursor: pointer;
        }
        .circle {
          height: 7px;
          width: 7px;
          position: absolute;
          background-color: #fa7bb4;
          border-radius: 50%;
          left: 19px;
          top: 8px;
        }
        .dp {
          height: 40px;
          width: 40px;
          background-color: #626262;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .main-container {
          display: flex;
          width: 100vw;

          margin-top: 50px !important;
          z-index: 1;
        }
        .dpicn {
          height: 42px;
        }

        .main {
          height: calc(100vh - 70px);
          width: 100%;

          padding: 40px 30px 30px 30px;
        }

        .main::-webkit-scrollbar-thumb {
          background-image: linear-gradient(
            to bottom,
            rgb(0, 0, 85),
            rgb(0, 0, 50)
          );
        }
        .main::-webkit-scrollbar {
          width: 5px;
        }
        .main::-webkit-scrollbar-track {
          background-color: #9e9e9eb2;
        }

        .box-container {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          flex-wrap: wrap;
          gap: 50px;
        }
        .nav {
          min-height: 91vh;
          width: 250px;
          background-color: var(--background-color2);
          position: absolute;
          top: 0px;
          left: 00;
          box-shadow: 1px 1px 10px rgba(198, 189, 248, 0.825);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          padding: 30px 0 20px 10px;
        }
        .navcontainer {
          height: calc(100vh - 70px);
          width: 250px;
          position: relative;
          overflow-y: scroll;
          overflow-x: hidden;
          transition: all 0.5s ease-in-out;
        }
        .navcontainer::-webkit-scrollbar {
          display: none;
        }
        .navclose {
          width: 80px;
        }
        .nav-option {
          width: 250px;
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 30px 0 20px;
          gap: 20px;
          transition: all 0.1s ease-in-out;
        }
        .nav-option:hover {
          border-left: 5px solid #a2a2a2;
          background-color: #dadada;
          cursor: pointer;
        }
        .nav-img {
          height: 30px;
        }

        .nav-upper-options {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }

        .option1 {
          border-left: 5px solid #010058af;
          background-color: var(--Border-color);
          color: black;
          cursor: pointer;
        }
        .option1:hover {
          border-left: 5px solid #010058af;
          background-color: var(--Border-color);
        }
        .box {
          height: 130px;
          width: 230px;
          border-radius: 20px;
          box-shadow: 3px 3px 10px rgba(0, 30, 87, 0.751);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          cursor: pointer;
          transition: transform 0.3s ease-in-out;
        }
        .box:hover {
          transform: scale(1.08);
        }

        .box:nth-child(1) {
          background-color: var(--one-use-color);
        }
        .box:nth-child(2) {
          background-color: var(--two-use-color);
        }
        .box:nth-child(3) {
          background-color: var(--one-use-color);
        }
        .box:nth-child(4) {
          background-color: var(--two-use-color);
        }

        .box img {
          height: 50px;
        }
        .box .text {
          color: black;
        }
        .topic {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 1px;
        }

        .topic-heading {
          font-size: 30px;
          letter-spacing: 3px;
        }
        .report-container {
          max-height: 600px;
          max-width: 1200px;
          margin: 70px auto 0px auto;
          background-color: #ffffff; /* White background for the container */
          border-radius: 30px; /* Rounded corners */
          box-shadow: 3px 3px 10px rgb(188, 188, 188); /* Light shadow for depth */
          padding: 20px; /* Padding for the container */
        }

        /* Header styles */
        .report-header {
          height: 80px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 2px solid rgba(0, 20, 151, 0.59); /* Bottom border for header */
        }

        .recent-Articles {
          font-size: 30px; /* Font size for title */
          font-weight: 600; /* Bold title */
          color: #5500cb; /* Purple color */
        }
        .buttons {
          margin-left: 54%;
        }
        /* Updated button styles for better alignment */
        .add,
        .delete,
        .update {
          height: 35px; /* Consistent height */
          width: 90px; /* Consistent width */
          border-radius: 8px; /* Rounded corners */
          background-color: #5500cb; /* Purple background */
          color: white; /* White text */
          font-size: 15px; /* Font size */
          border: none; /* No border */
          cursor: pointer; /* Pointer cursor */
          transition: background-color 0.3s; /* Transition effect for hover */
          margin-right: 10px; /* Space between buttons */
        }

        .add:hover,
        .delete:hover,
        .update:hover {
          background-color: #7a2bc9; /* Lighter purple on hover */
        }

        /* Header styles */
        .report-header {
          height: 80px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start; /* Align buttons to the start */
          padding: 20px;
          border-bottom: 2px solid rgba(0, 20, 151, 0.59); /* Bottom border for header */
        }

        .recent-Articles {
          font-size: 30px; /* Font size for title */
          font-weight: 600; /* Bold title */
          color: #5500cb; /* Purple color */
          margin-right: 20px; /* Space between title and buttons */
        }

        /* Button styles */
        .update {
          height: 35px;
          width: 90px;
          border-radius: 8px; /* Rounded corners */
          background-color: #5500cb; /* Purple background */
          color: white; /* White text */
          font-size: 15px; /* Font size */
          border: none; /* No border */
          cursor: pointer; /* Pointer cursor */
          transition: background-color 0.3s; /* Transition effect for hover */
        }

        .update:hover {
          background-color: #7a2bc9; /* Lighter purple on hover */
        }

        /* Report body styles */
        .report-body {
          height: 500px;
          max-width: 1160px;
          overflow-x: auto; /* Horizontal scroll if needed */
          padding: 20px;
        }

        /* Table styles */
        .property-table {
          width: 100%; /* Full width */
          border-collapse: collapse; /* Collapse borders */
          height: 300px;
        }

        .property-table th,
        .property-table td {
          padding: 12px; /* Padding for cells */
          text-align: left; /* Left align text */
          border-bottom: 1px solid #ddd; /* Light border below each row */
        }

        .property-table th {
          background-color: #5500cb; /* Header background color */
          color: white; /* Header text color */
          font-size: 18px; /* Header font size */
        }

        .property-table tr:nth-child(even) {
          background-color: #f2f2f2; /* Light gray for even rows */
        }

        .property-table tr:hover {
          background-color: #e6f7ff; /* Light blue on row hover */
        }

        .items {
          width: 1120px;
          margin-top: 15px;
        }
        .t-op {
          font-size: 18px; /* Font size for headings */
          letter-spacing: 0px;
        }

        .t-op-nextlvl {
          font-size: 16px; /* Font size for table data */
          letter-spacing: 0px;
          font-weight: 600; /* Bold data text */
        }
        .item1 {
          margin-top: 20px;
        }

        .label-tag {
          width: 100px;
          text-align: center;
          background-color: rgb(0, 177, 0);
          color: white;
          border-radius: 4px;
        }
        @media screen and (max-width: 950px) {
          .nav-img {
            height: 25px;
          }
          .nav-option {
            gap: 30px;
          }
          .nav-option h3 {
            font-size: 15px;
          }
          .report-topic-heading,
          .item1,
          .items {
            width: 800px;
          }
        }

        @media screen and (max-width: 850px) {
          .nav-img {
            height: 30px;
          }
          .nav-option {
            gap: 30px;
          }
          .nav-option h3 {
            font-size: 20px;
          }
          .report-topic-heading,
          .item1,
          .items {
            width: 700px;
          }
          .navcontainer {
            width: 100vw;
            position: absolute;
            transition: all 0.6s ease-in-out;
            top: 0;
            left: -100vw;
          }
          .nav {
            width: 100%;
            position: absolute;
          }
          .navclose {
            left: 00px;
          }
          .searchbar {
            display: none;
          }
          .main {
            padding: 40px 30px 30px 30px;
          }
          .searchbar2 {
            width: 100%;
            display: flex;
            margin: 0 0 40px 0;
            justify-content: center;
          }
          .searchbar2 input {
            width: 250px;
            height: 42px;
            border-radius: 50px 0 0 50px;
            background-color: var(--background-color3);
            padding: 0 20px;
            font-size: 15px;
            border: 2px solid var(--secondary-color);
          }
        }

        @media screen and (max-width: 490px) {
          .message {
            display: none;
          }
          .logosec {
            width: 100%;
            justify-content: space-between;
          }
          .logo {
            font-size: 20px;
          }
          .menuicn {
            height: 25px;
          }
          .nav-img {
            height: 25px;
          }
          .nav-option {
            gap: 25px;
          }
          .nav-option h3 {
            font-size: 12px;
          }
          .nav-upper-options {
            gap: 15px;
          }
          .recent-Articles {
            font-size: 20px;
          }
          .report-topic-heading,
          .item1,
          .items {
            width: 550px;
          }
        }

        @media screen and (max-width: 400px) {
          .recent-Articles {
            font-size: 17px;
          }
          .update {
            width: 60px;
            font-size: 10px;
            height: 27px;
          }
          .report-header {
            height: 60px;
            padding: 10px 10px 5px 10px;
          }
          .searchbtn img {
            height: 20px;
          }
        }

        @media screen and (max-width: 320px) {
          .recent-Articles {
            font-size: 12px;
          }
          .update {
            width: 50px;
            font-size: 8px;
            height: 27px;
          }
          .report-header {
            height: 60px;
            padding: 10px 5px 5px 5px;
          }
          .t-op {
            font-size: 12px;
          }
          .t-op-nextlvl {
            font-size: 10px;
          }
          .report-topic-heading,
          .item1,
          .items {
            width: 300px;
          }
          .report-body {
            padding: 10px;
          }
          .label-tag {
            width: 70px;
          }
          .searchbtn {
            width: 40px;
          }
          .searchbar2 input {
            width: 180px;
          }
        }
      `}</style>
    </>
  );
}
