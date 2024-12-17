"use client"; // Marks this component as client-side

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image"; // Assuming you're using Next.js' Image component
import { useRouter } from "next/navigation"; // Hook for navigation
import Link from 'next/link';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import ClipLoader from "react-spinners/ClipLoader";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SEO from "./../seo/page"
import Header from "./header";
import Footer from "./footer";
const containerStyle = {
  width: "100%",
  height: "200px",
};

const center = {
  lat: 13.736,
  lng: 121.0583, // Set your longitude
};
const styles = {
  slide: {
    padding: "20px",
    textAlign: "center",
    borderRadius: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "10px",
    transition: "transform 0.3s ease",
  },
  title: {
    marginTop: "10px",
    fontSize: "18px", // Adjust size as needed
    color: "#333",
    fontWeight: "bold",
    padding: "0 5px",
    transition: "color 0.3s ease",
  },
};
const Carousel = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // State to hold selected image info

  const router = useRouter(); // Correct usage inside a component

  const settings = {
    speed: 500, // Adjust this value for the slide transition speed
    slidesToShow: 4, // Number of slides visible at once
    slidesToScroll: 2, // Only scroll one slide at a time for smoothness
    autoplay: true, // Enable autoplay for automatic slide transition
    autoplaySpeed: 3000, // Slide changes every 3 seconds
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1200, // For smaller screens
        settings: {
          slidesToShow: 2, // Show 3 slides
        },
      },
      {
        breakpoint: 992, // Medium-sized screens
        settings: {
          slidesToShow: 2, // Show 2 slides
        },
      },
      {
        breakpoint: 768, // Small screens
        settings: {
          slidesToShow: 2, // Show 1 slide
        },
      },
      {
        breakpoint: 650, // Small screens
        settings: {
          slidesToShow: 1, // Show 1 slide
        },
      },
    ],
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/allproperty"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLocations(data); // Assuming data is an array of location objects
  
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);



  return (
    <>
      <div className="w-full mx-auto overflow-hidden mt-3 p-1 text-center h-full ">
        <h1 className="text-2xl font-bold mb-4">FEATURED PROPERTIES</h1>
        <Slider {...settings} arrows={false}>
          {" "}
          {/* Set arrows to false */}
{locations.map((location, index) => (
  <div
    key={index}
    className="flex flex-col items-center text-center p-4 border border-gray-300 rounded-lg bg-gray-100 shadow-md hover:-translate-y-1 transition-transform duration-300"
  >
<Link href={`/pages/buildings/${location.id}`} passHref className="no-underline">
  <div className="cursor-pointer">
    <img
      src={`/${location.path}`}
      alt={location.name}
      className="w-full h-60 object-cover rounded-lg mb-4"
    />
    <div className="text-center">
      <h3 className="text-lg font-bold my-1">{location.name}</h3>
      <p className="text-sm text-gray-600 my-1">
        {location.development_type}
      </p>
      <p className="text-sm text-gray-600 my-1">
        {location.location}
      </p>
      <p className="text-sm text-gray-600 my-1">
        {location.price_range}
      </p>
    </div>
  </div>
</Link>


  </div>
))}
        </Slider>

        {selectedLocation && (
          <div className="mt-5 text-left border border-gray-300 p-4 rounded-lg bg-white">
            <h2 className="text-lg font-bold mb-2">Selected Property:</h2>
            <img
              src={selectedLocation.path}
              alt={selectedLocation.name}
              className="w-full h-auto rounded-lg mb-4"
            />
            <h3 className="text-lg font-bold">{selectedLocation.name}</h3>
            <p className="text-sm text-gray-600">
              {selectedLocation.development_type}
            </p>
            <p className="text-sm text-gray-600">{selectedLocation.location}</p>
            <p className="text-sm text-gray-600">
              {selectedLocation.price_range}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
const Map = () => {
  const [locations, setLocations] = useState([]); // State for locations
  const [selectedLocation, setSelectedLocation] = useState(null); // State for the selected location
  const [isFullscreen, setIsFullscreen] = useState(false); // State for fullscreen mode
  
  useEffect(() => {
    // Fetch locations from the Laravel API
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/locations");
        const data = await response.json();
        setLocations(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleMarkerClick = (location) => {
    setSelectedLocation(location); // Set the selected location when marker is clicked
  };

  const containerStyle = {
    width: "100%",
    height: isFullscreen ? "100vh" : "400px", // Adjust height for fullscreen
  };

  const closeInfoContainer = () => {
    setSelectedLocation(null); // Clear the selected location
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAS_yg3EUDpuONWhT1dJQjc5JETJf5uITI">
      <div className="flex flex-col w-full p-0 bg-gray-100 h-auto ">
        {/* Parent container */}
        <div className="relative w-full h-80">
          {/* Map container */}
          <h1 className="text-center text-3xl font-bold mt-5 mb-3">
            PROPERTIES LOCATION
          </h1>
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={{ lat: 14.5995, lng: 120.9842 }} // Default center (Manila)
            zoom={10}
          >
            {locations.map((location) => (
              <Marker
                key={location.name}
                position={{
                  lat: parseFloat(location.lat), // Ensure lat is a valid number
                  lng: parseFloat(location.lng), // Ensure lng is a valid number
                }}
                title={location.name}
                onClick={() => handleMarkerClick(location)}
              />
            ))}

           {selectedLocation && (
  <div className="absolute top-2.5 left-2.5 p-4 bg-white/90 shadow-lg rounded-lg z-50">
    <span
      className="text-lg cursor-pointer mr-2"
      onClick={closeInfoContainer}
    >
      &times;
    </span>
    <h1 className="text-lg ml-2">{selectedLocation.name}</h1>
    <img
      className="max-w-52 max-h-36 ml-2 rounded"
      src={`${selectedLocation.location_image}`}
      alt={selectedLocation.name}
    />
<Link href={`/pages/buildings/${selectedLocation.id}`} passHref className="no-underline">
  <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        // Console log the selectedLocation.id
      >
        View Property Details
      </button>
</Link>
    

  </div>
)}

          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
};

const AboutAlveo = () => {
  return (
    <>
      <div className="relative mt-0 p-4  bg-gray-100 rounded-lg shadow-md text-justify w-full lg:mt-0 2xl:h-full ">
        <h1 className="text-3xl font-bold text-center text-gray-800 my-2 lg:text-5xl xl:text-4xl 2xl:pt-5">
          ABOUT ALVEO LAND
        </h1>
        <p className="text-lg leading-relaxed text-gray-700 indent-14 lg:text-3xl lg:p-5 xl:text-2xl">
          As Ayala Lands upscale residential arm, Alveo offers a vibrant
          portfolio of groundbreaking real estate developments that provides
          upscale living and working spaces within various thriving and emerging
          growth centers around the country.
        </p>
        <p className="text-lg leading-relaxed text-gray-700 mt-2 indent-14 lg:text-3xl lg:p-5 xl:text-2xl 2xl:pb-10">
          Armed with sharper foresight, unparalleled excellence, and total
          commitment, the company is committed to providing
          thoughtfully-designed and master-planned living environments for the
          unique needs of its discerning market.
        </p>
        <div id="map" className="my-4"></div>
      </div>
    </>
  );
};
const ImageSlider = () => {
  const [locations, setLocations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Function to fetch locations data from the backend
  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/locations");
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Call fetchLocations when the component mounts
  useEffect(() => {
    fetchLocations();
  }, []);

  // Update the image every 3 seconds
  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % locations.length);
  }, [locations.length]);

  useEffect(() => {
    if (locations.length > 0) {
      const interval = setInterval(nextImage, 3000);
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [locations, nextImage]);

  // Handle image load
  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <>
      <div className="relative flex items-center justify-center w-auto h-auto p-0 m-0 max-sm:w-auto sm:w-1/3 md:w-auto lg:w-5/12">
        {/* Check for loading state */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <span className="text-white">Loading...</span>
          </div>
        )}

        {/* Only show the location image if there are locations */}
        {locations.length > 0 && (
          <div className="relative w-full h-auto rounded-lg overflow-hidden cursor-pointer z-10">
            <Link
              href={`/pages/buildings/${encodeURIComponent(locations[currentIndex].id)}`}
              passHref
            >
              
                <Image
                  src={`${locations[currentIndex].location_image}`}
                  alt={locations[currentIndex].name}
                  layout="responsive"
                  width={600}
                  height={400}
                  className={`object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"} w-80 xl:w-full 2xl:w-full h-full`} // Ensure the image takes the full container space
                  onLoad={handleImageLoad}
                  priority
                />
              
            </Link>

            {/* Location info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center p-3 text-sm z-30">
              <h5 className="m-0 text-xs sm:text-sm md:text-base truncate">{locations[currentIndex].name}</h5>
              <p className="m-0 text-xs sm:text-sm md:text-base truncate">{locations[currentIndex].location}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
let dropdownValue;
let searchValue;
const AlveoBanner = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [propertyData, setPropertyData] = useState(null); // State for fetched data
  const [buildingData, setBuildingData] = useState([]); // State for building data
  const [propertiesWithBuildings, setPropertiesWithBuildings] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const router = useRouter();
  // Image enlargement handler
  const handleImageClick = (imgPath) => {
    setEnlargedImage(imgPath); // Set the clicked image to enlarge
  };

  // Close enlarged image
  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };
  // Function to hide the suggestions container
  const hideSuggestions = () => {
    setIsSuggestionsVisible(false); // Set the state to hide the suggestions
  };
  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    closeEnlargedImage();
    setPopupVisible(false);
  };
  const handleSelectChange = (event) => {
    const dropdownValue = event.target.value;
    setSelectedValue(dropdownValue);
    setSearchInput(""); // Clear search input when dropdown changes
    setSuggestions([]); // Clear suggestions when dropdown changes
    setShowSuggestions(false);
  };

  const handleSearchInputChange = (event) => {
    const searchValue = event.target.value;
    setSearchInput(searchValue);
    // Trigger fetch only if both dropdown and input have values
    if (selectedValue && searchValue) {
      fetchSuggestions(selectedValue, searchValue);
      setShowSuggestions(true); // Make sure this is true when suggestions are ready
      setIsSuggestionsVisible(true); // Ensure suggestions are visible
    } else {
      setSuggestions([]); // Clear suggestions if either value is missing
      setIsSuggestionsVisible(false); // Hide suggestions if no valid search
    }
  };

  const fetchSuggestions = async (filter, searchValue) => {
    try {
      // Corrected URL to pass filter and search as query parameters
      const response = await fetch(
        `http://localhost:8000/api/properties?filter=${filter}&search=${searchValue}`
      );

      const data = await response.json();

      const uniqueSuggestions = data.reduce((accumulator, currentItem) => {
        const currentValue = currentItem[filter];
        if (!accumulator.some((item) => item[filter] === currentValue)) {
          accumulator.push(currentItem);
        }
        return accumulator;
      }, []);

      setSuggestions(uniqueSuggestions); // Update suggestions state
      setShowSuggestions(true); // Show suggestions
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const renderSuggestion = (item) => {
    // Determine which property to display based on the selected dropdown value
    switch (selectedValue) {
      case "name":
        return item.name; // Display residence name
      case "status":
        return item.status; // Display status
      case "location":
        return item.location; // Display location
      case "specific_location":
        return item.specific_location; // Display specific location
      case "price_range":
        return item.price_range; // Display price range
      case "units":
        return item.units; // Display units
      case "land_area":
        return item.land_area; // Display land area
      case "development_type":
        return item.development_type; // Display development type
      case "architectural_theme":
        return item.architectural_theme; // Display architectural theme
      default:
        return null; // Fallback if no valid property is found
    }
  };
  const fetchBuildingFeatures = async (propertyId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/buildingfeatures?property_id=${propertyId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const features = await response.json();

      return features;
    } catch (error) {
      console.error("Error fetching building features:", error);
    }
  };

  const fetchBuildings = async (propertyId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/buildings?property_id=${propertyId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const buildings = await response.json();
      return buildings; // Return buildings data
    } catch (error) {
      console.error("Error fetching buildings:", error);
      return []; // Return an empty array on error
    }
  };

  const fetchData = async (filter, searchValue, callback) => {

    try {
      const response = await fetch(
        `http://localhost:8000/api/properties?filter=${filter}&search=${searchValue}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();

      // Fetch buildings for each property
      const propertiesWithBuildings = await Promise.all(
        data.map(async (property) => {
          const buildings = await fetchBuildings(property.id);
          const buildingfeatures = await fetchBuildingFeatures(property.id); // Fetch buildings using property ID
          return { ...property, buildings, buildingfeatures }; // Attach buildings to the property
        })
      );

      setFetchedData(propertiesWithBuildings); // Update state with properties and buildings

      const uniqueSuggestions = [
        ...new Set(propertiesWithBuildings.map((item) => item[filter])),
      ];
      setSuggestions(uniqueSuggestions);

      if (callback) callback(propertiesWithBuildings);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSuggestions([]); // Clear suggestions on error
    }
  };
const handleClick1 = () => {
  // Check if the viewport width is 1366 or more
  if (window.innerWidth >= 1366) {
    // Append a random query parameter to the URL to avoid cache
    const randomParam = `?cacheBuster=${new Date().getTime()}`;
    window.location.href = `/pages/roomplanner${randomParam}`; // Refresh the page after navigation
  } else {
    alert("This feature is only available on larger screens (1366px or wider).");
  }
};



  const arrowFetch = () => {
    hideSuggestions();
    setShowSuggestions(false);
    openPopup();
    setLoading(true);

    if (selectedValue && searchInput) {
      // Fetch the property data based on selected value and search input
      fetchData(selectedValue, searchInput, async (properties) => {

        if (properties.length > 0) {
          // Create an array to store properties with buildings
          const propertiesWithBuildings = await Promise.all(
            properties.map(async (property) => {
              // Fetch buildings for each property and only associate them with that property
              const buildings = await fetchBuildings(property.id);
              return {
                ...property,
                buildings, // Attach the fetched buildings to the property
              };
            })
          );

          // Store in state or pass to UI (depending on how you want to handle it)
          setFetchedData(propertiesWithBuildings);

        } else {
        
        }
        setLoading(false);
        setShowSuggestions(false);
      });
    } else {
  
    }
  };

  return (
    <>
    <div className="relative w-full h-screen">
      
  <div className="absolute inset-0 bg-cover bg-center bg-[url('/assets/Alveo.png')]">

        <div className="absolute md:top-10 max-sm:-top-4 sm:-top-4  right-3 m-4 mb-10 ">
  <div className="bg-white border-2 rounded-3xl w-10 h-10 sm:w-12 sm:h-12 xl:w-11 xl:h-11 lg:w-14 lg:h-14 flex items-center justify-center md:-mt-10 border-blue-700">
  <div
    className="cursor-pointer"
    onClick={handleClick1} // Add the click handler for routing
  >
    <img
      className="w-7 h-7 sm:w-9 sm:h-9 md:w-7 md:h-7 lg:w-9 lg:h-9 xl:w-7 xl:h-7"
      src="/assets/RoomPlanner/bed.png"
      alt="Room Planner"
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
  </div>
</div>
        </div>
 <div className="absolute  md:top-10 max-sm:-top-4  sm:-top-4 right-16 m-4 mb-10 ">
          <div className="bg-white border-2 rounded-3xl w-10 h-10 sm:w-12 sm:h-12 xl:w-11 xl:h-11 lg:w-14 lg:h-14 flex items-center justify-center md:-mt-10 border-blue-700">
          <Link href="/pages/loancalculator" passHref>

            <img
              className="w-7 h-7 sm:w-9 md:w-7 md:h-7 sm:h-9 lg:w-9 lg:h-9 xl:w-7 xl:h-7"
              src="/calculator.png"
              alt="Room Planner"
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

        </Link>
          </div>
        </div>
        <div className="content sm:mt-10  xl:mt-40 2xl:mt-48 flex flex-col items-center xl:items-start justify-center text-center mt-10">
          <div className="w-full max-w-7xl xl:max-w-full xl:pl-20 xl:text-left ">
            <h1 className="mt-2 text-4xl font-semibold sm:text-6xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-8xl 2xl:font-medium">
              ALVEO LAND
            </h1>
            <h4 className="text-lg font-medium sm:text-2xl md:text-xl lg:text-xl xl:text-3xl 2xl:text-5xl">
              LIVE WELL ACROSS THE PHILIPPINES
            </h4>
          </div>
        </div>

   <div className="my-6 h-auto grid grid-cols-1 gap-6 relative">
  {/* Left Column: Search Inputs */}
  <div className="space-y-4 lg:-mt-3 xl:-ml-40 xl:-mt-4 2xl:-ml-1 relative">
    {/* Search Inputs */}
    <div className="flex flex-col xl:flex-row xl:gap-4 items-center xl:items-start">
      <select
        id="locationDropdown"
        value={selectedValue}
        onChange={handleSelectChange}
        className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 xl:ml-60 md:text-md md:h-9 md:w-72 focus:ring-blue-500 w-60 sm:w-96 lg:h-10 lg:w-4/12 xl:w-40 xl:p-0 xl:h-10 xl:text-sm"
      >
        <option value="" disabled>Select</option>
        <option value="name">Residence Name</option>
        <option value="status">Status</option>
        <option value="location">Location</option>
        <option value="specific_location">Specific Location</option>
        <option value="price_range">Price Range</option>
        <option value="units">Units</option>
        <option value="land_area">Land Area</option>
        <option value="development_type">Development Type</option>
        <option value="architectural_theme">Architectural Theme</option>
      </select>
      <input
        type="text"
        placeholder="Search any location/residence"
        aria-label="Search"
        id="searchInput"
        className="max-sm:mt-2 sm:mt-2 md:mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 md:text-md md:h-9 md:w-72 focus:ring-blue-500 w-60 sm:w-96 lg:h-10 lg:w-4/12 xl:w-3/12 xl:h-10 xl:ml-1 xl:mt-0"
        value={searchInput || ""}
        onChange={handleSearchInputChange}
      />
    </div>
    <div>
      {isSuggestionsVisible && searchInput.trim() && (
        <div className="absolute max-h-60 overflow-y-auto w-full sm:w-2/4 md:w-2/4 lg:w-1/2 xl:w-1/5 mx-auto top-full mt-1 z-20 bg-white shadow-md border rounded-md space-y-1 sm:ml-0 sm:left-36 md:left-44 lg:mt-4 xl:mt-6 lg:left-54 xl:right-96 2xl:-left-20">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded max-h-40"
              onClick={() => {
          
                setSearchInput(renderSuggestion(item));
                setSuggestions([]);
                setShowSuggestions(false);
              }}
            >
              {renderSuggestion(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Right Column: Image Slider */}
{/* Search Button */}
<div className="flex items-center justify-center xl:mt-8 xl:w-32 xl:absolute xl:left-1/3 xl:ml-32 xl:transform xl:-translate-x-1/2 2xl:left-1/3">
  <button
    onClick={arrowFetch} // Move the onClick here to ensure it only triggers when clicking the button
    className="bg-blue-500 text-white py-2 px-4 mt-0 w-28 h-10 rounded-lg hover:bg-blue-600 transition duration-200 xl:text-xs sm:text-base lg:text-lg"
  >
    Search
  </button>
</div>

  <div className="relative flex justify-center items-center w-4/5 max-sm:left-8 sm:left-1/3 sm:top-20 md:left-40 xl:-mt-10 max-sm:h-40 md:w-1/2 md:top-20  md:ml-16 lg:left-1/3 lg:ml-1 lg:w-1/3 xl:w-5/12 xl:left-1/2 xl:ml-10 xl:absolute xl:-translate-y-1/3 xl:flex xl:justify-start xl:items-center">
    <div className="absolute inset-0 w-full flex">
      <ImageSlider /> {/* Ensuring this takes full width of its parent container */}
    </div>
  </div>
  
</div>





        <div className="social-media-icons max-sm:hidden sm:hidden xl:block xl:items-end xl:absolute xl:mt-48 xl:top-0 xl:right-0 xl:p-4 2xl:mt-72">
          <a href="https://www.facebook.com" target="_blank">
            <img
              className="w-10 h-10"
              src="/assets/socialmedia/facebook.png"
              alt="Facebook"
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </a>
          <a href="https://www.messenger.com" target="_blank">
            <img
              className="w-10 h-10 mt-3"
              src="/assets/socialmedia/messenger.png"
              alt="Messenger"
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </a>
          <a href="https://t.me/+6309175480999" target="_blank">
            <img
              className="w-10 h-10 mt-3"
              src="/assets/socialmedia/telegram.png"
              alt="Telegram"
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </a>
          <a
            href="https://api.whatsapp.com/send/?phone=639175480999&text&type=phone_number&app_absent=0"
            target="_blank"
          >
            <img
              className="w-10 h-10 mt-3"
              src="/assets/socialmedia/whatsapp.png"
              alt="WhatsApp"
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </a>
          <a href="https://www.viber.com/en/" target="_blank">
            <img
              className="w-10 h-10 mt-3"
              src="/assets/socialmedia/viber.png"
              alt="Viber"
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </a>
        </div>

       
        {enlargedImage && (
          <div
            className="absolute top-1 w-screen  h-1/2 md:w-1/2 md:h-screen z-40"
            onClick={closeEnlargedImage}
          >
            <img
              src={enlargedImage}
              alt="Enlarged"
              className="w-full h-full"// Adjust as necessary
            />
          </div>
        )}
        {isPopupVisible && (
          <div className="popup-container absolute inset-0  flex justify-center items-center h-screen overflow-auto top-1/2 z-50 md:w-1/2 md:left-1/2 lg:right-0 xl:right-0 2xl:ml-36  md:top-0">
            <div className="bg-blue-600 p-6  w-full max-w-2xl h-full  overflow-y-auto relative shadow-lg">
              <span
                className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-600 hover:text-red-600 transition-colors duration-300"
                onClick={closePopup}
              >
                &times;
              </span>

              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <ClipLoader color="#ffffff" loading={loading} size={100} />
                </div>
              ) : fetchedData && fetchedData.length > 0 ? (
                fetchedData.map((property, index) => (
                  <div
                    key={index}
                    className="property-card mb-8 space-y-8 bg-white rounded-lg shadow-lg p-6"
                  >
                    <h2 className="text-2xl font-semibold text-gray-800 text-center">
                      Property Details
                    </h2>
                    <div className="property-card-header flex items-center justify-between gap-5">
                      <h3 className="text-xl font-semibold text-gray-700">
                        {property.name}
                      </h3>
                      <p className="text-gray-600 mt-2">{property.location}</p>
                    </div>

                    {/* Image Gallery */}
   {[property.path, property.view].map((imgPath, imgIndex) => {
  // Check if the image path is a relative path (local asset) or an absolute URL
  const imageSrc =
    imgPath.startsWith('http') || imgPath.startsWith('https')
      ? imgPath // If it's a URL, use it directly
      : `http://localhost:8000/${imgPath.replace(/\\/g, '/')}`; // If it's a local asset, prepend the local server URL

  return (
    <div className="" key={imgIndex}>
      <img
        src={imageSrc}
        alt={`${property.name} view ${imgIndex + 1}`}
        onMouseEnter={() => setHoveredImage(imageSrc)}
        onMouseLeave={() => setHoveredImage(null)}
        onClick={() => handleImageClick(imageSrc)}
        className="w-full h-auto rounded-lg shadow-md group-hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105 object-cover"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 ease-in-out rounded-lg"></div>
    </div>
  );
})}



                    {/* Property Info */}
                    <div className="property-info bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                      <div className="property-detail-item flex items-center justify-between border-b pb-4 mb-4">
                        <span className="text-gray-800 font-semibold w-1/2 text-left">
                          Status:
                        </span>
                        <span className="text-gray-600 w-1/2 text-left">
                          {property.status}
                        </span>
                      </div>
                      <div className="property-detail-item flex items-center justify-between border-b pb-4 mb-4">
                        <span className="text-gray-800 font-semibold w-1/2 text-left">
                          Price Range:
                        </span>
                        <span className="text-gray-600 w-1/2 text-left">
                          {property.price_range}
                        </span>
                      </div>
                      <div className="property-detail-item flex items-center justify-between border-b pb-4 mb-4">
                        <span className="text-gray-800 font-semibold w-1/2 text-left">
                          Land Area:
                        </span>
                        <span className="text-gray-600 w-1/2 text-left">
                          {property.land_area}
                        </span>
                      </div>
                      <div className="property-detail-item flex items-center justify-between border-b pb-4 mb-4">
                        <span className="text-gray-800 font-semibold w-1/2 text-left">
                          Architectural Theme:
                        </span>
                        <span className="text-gray-600 w-1/2 text-left">
                          {property.architectural_theme}
                        </span>
                      </div>
                      <div className="property-detail-item flex items-center justify-between border-b pb-4 mb-4">
                        <span className="text-gray-800 font-semibold w-1/2 text-left">
                          Development Type:
                        </span>
                        <span className="text-gray-600 w-1/2 text-left">
                          {property.development_type}
                        </span>
                      </div>
                      <div className="property-detail-item flex items-center justify-between border-b pb-4 mb-4">
                        <span className="text-gray-800 font-semibold w-1/2 text-left">
                          Specific Location:
                        </span>
                        <span className="text-gray-600 w-1/2 text-left">
                          {property.specific_location}
                        </span>
                      </div>
                      <div className="property-detail-item flex items-center justify-between">
                        <span className="text-gray-800 font-semibold w-1/2 text-left">
                          Units:
                        </span>
                        <span className="text-gray-600 w-1/2 text-left">
                          {property.units}
                        </span>
                      </div>
                    </div>

                    {/* Key Features Section */}
               <div className="features-section space-y-8 flex flex-col items-center justify-center">
  <span className="section-title text-3xl font-extrabold text-gray-900 tracking-tight text-center">
    Key Features
  </span>
  <ul className="features-list space-y-8 flex flex-col items-center justify-center w-full max-w-4xl -ml-10">
    {JSON.parse(property.features).map((feature, featureIndex) => {
      // Ensure feature.image is not null or undefined before using it
      const imageSrc =
        feature.image && (feature.image.startsWith('http') || feature.image.startsWith('https'))
          ? feature.image // If it's a URL, use it directly
          : feature.image
          ? `http://localhost:8000/${feature.image.replace(/\\/g, '/')}` // If it's a local asset, prepend the local server URL
          : ''; // If feature.image is null or undefined, fallback to an empty string or placeholder

      return (
        <li
          key={featureIndex}
          className="feature-item flex items-center gap-6 p-6 rounded-2xl bg-white shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-50 w-full max-w-md"
        >
          <img
            src={imageSrc} // Use the dynamic image source here
            alt={feature.name}
            className="feature-icon w-16 h-16 border-4 border-gray-300 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-125 hover:shadow-xl"
            onMouseEnter={() => setHoveredImage(imageSrc)}
            onMouseLeave={() => setHoveredImage(null)}
            onClick={() => handleImageClick(imageSrc)}
            style={{ cursor: "pointer" }}
          />
          <span className="text-xl font-semibold text-gray-800 tracking-tight">
            {feature.name}
          </span>
        </li>
      );
    })}
  </ul>
</div>


                    {/* Building Features Section */}
                    <div className="">
                      {/* Section Title */}
                      <span className="section-title flex justify-center text-center text-2xl font-bold  text-gray-800 tracking-wide uppercase">
                        Building Features
                      </span>

                      {/* Building Features List */}
                    <ul className="building-features-list  list-none text-center justify-center">
  {property.buildingfeatures && property.buildingfeatures.length > 0 ? (
    property.buildingfeatures.map((feature, featureIndex) => (
      <li
        key={featureIndex}
        className="building-feature-item flex items-center text-center justify-center  text-lg text-gray-800"
      >
        {/* Add an icon for each feature */}
        <span className="icon text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <span className="text-black font-semibold">{feature.name}</span>
      </li>
    ))
  ) : (
    <li className="text-gray-500 text-lg">
      {/* Add a subtle placeholder icon */}
      <span className="icon text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m-6-8h6m2-4H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2z"
          />
        </svg>
      </span>
      No building features available.
    </li>
  )}
</ul>


                      {/* Building Layout Section */}
                    {property.buildings && property.buildings.length > 0 && (
  <div className="mt-6 w-auto flex justify-center">
    <div className="w-auto max-w-4xl">
      {/* Container with max width */}
      <span className="section-title text-2xl font-bold text-gray-800 tracking-wide uppercase">
        Building Layout
      </span>
      <ul className="mt-3 flex -ml-9 flex-wrap w-80 gap-5">
        {/* Grid layout */}
        {property.buildings.map((building, buildingIndex) => (
          <li
            key={buildingIndex}
            className="space-y-4 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 p-4"
          >
            {/* Building Name */}
            <h5 className="text-xl font-semibold text-gray-800">
              {building.name}
            </h5>

            {/* Image Container */}
            <div className="relative">
              <img
                src={
                  building.path &&
                  (building.path.startsWith('http') || building.path.startsWith('https'))
                    ? building.path // If it's a URL, use it directly
                    : building.path
                    ? `http://localhost:8000/${building.path.replace(/\\/g, '/')}` // If it's a local asset, prepend the local server URL
                    : '' // Fallback in case building.path is null or undefined
                }
                alt={building.name}
                onMouseEnter={() => setHoveredImage(building.path)}
                onMouseLeave={() => setHoveredImage(null)}
                onClick={() => handleImageClick(building.path)}
                className="w-full h-64 object-cover rounded-lg transition-all duration-300 transform hover:scale-105"
              />
              {/* Hover Effect: Show image details on hover */}
            </div>

            {/* Building Info List */}
            <ul className="mt-4 text-gray-700 space-y-2 list-none pl-0">
              <li>
                <strong className="text-gray-800">Development Type:</strong> {building.development_type}
              </li>
              <li>
                <strong className="text-gray-800">Residential Levels:</strong> {building.residential_levels}
              </li>
              <li>
                <strong className="text-gray-800">Basement Parking Levels:</strong> {building.basement_parking_levels}
              </li>
              <li>
                <strong className="text-gray-800">Podium Parking Levels:</strong> {building.podium_parking_levels}
              </li>
              <li>
                <strong className="text-gray-800">Commercial Units:</strong> {building.commercial_units}
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}

                    </div>
                  </div>
                ))
              ) : (
                <p>No properties found.</p>
              )}
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

const DashboardComponent = () => {
  return (
    <>
    <SEO
  title="REAL ESTATE"
  description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
  keywords="alveo, real estate, luxury living, property, condominiums, luxury homes, investment, residential properties,sale"
  canonical="http://localhost:3000"
/>

      <Header />


    <AlveoBanner />






      <Carousel />
      <div className="xl:flex w-screen xl:-z-10">
        <div className="xl:w-1/2 xl:-z-10">
          <AboutAlveo />
        </div>
        <div className="xl:w-1/2 ">
          <Map />
        </div>
      </div>
<div className="max-sm:mt-32 sm:mt-32 xl:mt-0 xl:z-50">
  <Footer />
</div>


    
      {/**    
        
      */}

      <div></div>
    </>
  );
};

export default DashboardComponent;
