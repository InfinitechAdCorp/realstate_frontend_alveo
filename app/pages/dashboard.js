"use client"; // Marks this component as client-side

import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image"; // Assuming you're using Next.js' Image component
import { useRouter } from "next/navigation"; // Hook for navigation
import Link from "next/link";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import ClipLoader from "react-spinners/ClipLoader";
import { showToast } from "../../components/alert/page"; // Adjust the import path if necessary
import { IoBed, IoManSharp } from "react-icons/io5";
import { FaCalculator, FaHouseCircleCheck } from "react-icons/fa6";
import {
  FaCalendarAlt,
  FaArrowRight,
  FaSearch,
  FaChevronCircleDown,
} from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SEO from "./../seo/page";
import Header from "./header";
import Footer from "./footer";
import MyBot from "../../components/Chatbot/page";
import SocialMediaFloating from "./socialmedia-icons/page";
import { usePathname } from "next/navigation";

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
const handleShowSuccessToast = (message) => {
  showToast(message, "success");
};

const handleShowErrorToast = (message) => {
  showToast(message, "error"); // Error toast
};

const handleShowWarningToast = (message) => {
  showToast(message, "warning"); // Warning toast
};
const Carousel = () => {
  const [locations, setLocations] = useState([]);
  const sliderRef = useRef(null); // Create a reference for the Slider component

  const [isLoading, setIsLoading] = useState(true);

  // Handle when the image has loaded
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/allproperty`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        const formatNumber = (num) => {
          // Prepend "PHP" and then format the number
          return "PHP " + new Intl.NumberFormat("en-US").format(num);
        };

        // Loop through the locations and format their price_range
        const updatedData = data.map((location) => {
          if (location.price_range) {
            const formattedPriceRange = location.price_range
              .split(" - ")
              .map((price) => formatNumber(price))
              .join(" - ");
            location.price_range = formattedPriceRange;
          }
          return location;
        });

        // Set the locations with the updated data
        setLocations(updatedData);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const settings = {
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 650,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full mx-auto overflow-hidden mt-3 text-center h-full relative pb-10 px-4 sm:px-6 lg:px-8">
      <h1
        className="font-thin items-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-customBlue 
      border-t-2 w-fit mx-auto border-customBlue whitespace-nowrap mt-4"
      >
        FEATURED PROPERTIES
      </h1>
      <Slider ref={sliderRef} {...settings}>
        {locations.map((location, index) => (
          <a
            key={location.id} // Add the key prop here, using a unique identifier
            href={`/pages/buildings/${location.id}`}
            className="no-underline"
          >
            <div className="flex flex-col items-center text-center p-4 border border-blue-950 h-fit mb-2 pb-2 relative">
              <ImageWithLoader
                src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${location.path}`}
                alt={location.name}
              />

              <div className="text-center h-full">
                <h3 className="text-lg font-bold my-1 text-customBlue">
                  {location.name}
                </h3>
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
          </a>
        ))}
      </Slider>

      {/* Navigation buttons at the side of the carousel */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-customBlue text-white p-3 rounded-full shadow-lg hover:bg-customBlue transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 transform rotate-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-customBlue text-white p-3 rounded-full shadow-lg hover:bg-customBlue transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

const ImageWithLoader = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false); // Image has loaded
  };

  return (
    <div className="relative w-full h-60">
      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-5xl font-thin text-opacity-40 text-cyan-700 animate-pulse">
            Λ L V E O
          </div>
        </div>
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad} // Stop showing loader when image has loaded
        className="w-full h-full object-cover mb-4 transition-all duration-300 ease-in-out transform hover:scale-105"
      />
    </div>
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/locations`
        );
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
    <>
      {/* Embed Google Map iframe */}

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.6866183300262!2d121.01093307577298!3d14.559904978070358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90b830e5f29%3A0x89fe307dfecd3c0d!2sCampos%20Rueda%20Building!5e0!3m2!1sen!2sph!4v1736238470025!5m2!1sen!2sph"
        width="100%" // Make iframe responsive
        height="450"
        style={{ border: "0" }} // Use object notation for styles
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade p-2 ms-5"
      ></iframe>
    </>
  );
};

const AboutAlveo = () => {
  return (
    <>
      <div
        className="relative p-4 bg-customBlue  bg-cover bg-center shadow-md text-justify w-full bg-opacity-100 "
        style={{ backgroundImage: "url('/assets/alveoland2.jpg')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-customBlue bg-opacity-90"></div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-thin text-white tracking-widest mb-10 flex flex-col sm:flex-row sm:justify-center sm:items-center">
              About
              <span className="ms-3 me-3 sm:ms-0 sm:me-0 sm:mt-0 mt-2">
                Λ L V E O
              </span>
            </h1>
          </div>

          <div className="text-gray-100 pb-10 items-center font-thin">
            <p className="text-lg leading-relaxed indent-10 lg:text-xl ">
              As Ayala Land's upscale residential arm, Alveo offers a vibrant
              portfolio of groundbreaking real estate developments that provide
              upscale living and working spaces within various thriving and
              emerging growth centers around the country.
            </p>

            <p className="text-lg leading-relaxed indent-10 lg:text-xl">
              Armed with sharper foresight, unparalleled excellence, and total
              commitment, the company is dedicated to providing thoughtfully
              designed and master-planned living environments for the unique
              needs of its discerning market.
            </p>
            <p className="text-end">
              <Link
                href="/pages/aboutalveo/aboutalveo"
                className="text-white flex items-center space-x-2 justify-end"
              >
                <span>READ MORE ABOUT ALVEO</span>
                <FaArrowRight className="cursor-pointer" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
const ImageSlider = () => {
  const [locations, setLocations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/properties`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      const data = await response.json();

      // Log the response to see its structure
      console.log(data);

      // Process the data to only extract id, name, and location
      if (Array.isArray(data)) {
        const simplifiedProperties = data.map((property) => {
          return {
            id: property.id,
            name: property.name,
            location: property.location,
            path: property.path,
          };
        });

        setLocations(simplifiedProperties); // Assuming setLocations sets the state
      } else {
        console.error("Invalid properties data structure", data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Update the image every 3 seconds
  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % locations.length);
  }, [locations]);

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
    <div className="relative flex items-center justify-center w-auto h-auto p-0 m-0 max-sm:w-auto sm:w-1/3 md:w-auto lg:w-5/12">
      {/* Check for loading state */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <span className="text-white">Loading...</span>
        </div>
      )}

      {/* Only show the location image if there are locations */}
      {locations && locations.length > 0 && (
        <div className="relative w-full h-auto rounded-lg overflow-hidden cursor-pointer z-10">
          <a
            href={`/pages/buildings/${encodeURIComponent(
              locations[currentIndex].id
            )}`}
            passHref
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${locations[
                currentIndex
              ]?.path?.replace(/\\/g, "/")}`}
              alt={locations[currentIndex]?.name}
              layout="responsive"
              width={600}
              height={400}
              className={`object-cover transition-opacity duration-300 ${
                loading ? "opacity-0" : "opacity-100"
              } w-80 xl:w-full 2xl:w-full h-full`}
              onLoad={handleImageLoad}
              priority
            />
          </a>

          {/* Location info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center p-3 text-sm z-30">
            <h5 className="m-0 text-xs sm:text-sm md:text-base truncate">
              {locations[currentIndex].name}
            </h5>
            <p className="m-0 text-xs sm:text-sm md:text-base truncate">
              {locations[currentIndex].location}
            </p>
          </div>
        </div>
      )}
    </div>
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
  const dashboardClips = [
    "/assets/dashboard/854325-hd_1280_720_25fps.mp4",
    "/assets/dashboard/2282013-uhd_3840_2024_24fps.mp4",
    "/assets/dashboard/3648257-uhd_3840_2160_30fps.mp4",
    "/assets/dashboard/3773486-hd_1920_1080_30fps.mp4",
    "/assets/dashboard/3773488-hd_1920_1080_30fps.mp4",
    "/assets/dashboard/4193140-uhd_2562_1440_24fps.mp4",
    "/assets/dashboard/8996835-uhd_3840_2160_30fps.mp4",
    "/assets/dashboard/alveo_cut.mp4",
  ];

  const [currentClip, setCurrentClip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentClip((prev) => (prev + 1) % dashboardClips.length);
    }, 10000); // Change video every 10 seconds
    return () => clearInterval(interval);
  }, []);

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
    console.log(dropdownValue);
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
      setIsSuggestionsVisible(true); // Show suggestions
    } else {
      setSuggestions([]); // Clear suggestions if either value is missing
      setIsSuggestionsVisible(false); // Hide suggestions if no valid search
    }
  };
  const fetchSuggestions = async (filter, searchValue) => {
    console.log(`Filter: ${filter}, Search Value: ${searchValue}`);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/properties`
      );
      const data = await response.json();

      console.log("API response data:", data);

      // Filter the data based on the search value
      const filteredSuggestions = data.filter((item) =>
        item[filter]?.toLowerCase().includes(searchValue.toLowerCase())
      );

      // Remove duplicates based on the selected filter value
      const seen = new Set();
      const uniqueSuggestions = filteredSuggestions.filter((item) => {
        const value = item[filter];
        if (seen.has(value)) {
          return false; // If the value is already seen, filter it out
        } else {
          seen.add(value);
          return true; // Otherwise, keep it
        }
      });

      setSuggestions(uniqueSuggestions); // Set unique filtered suggestions
    } catch (error) {
      console.error("Error fetching suggestions:", error);
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
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/buildingfeatures?property_id=${propertyId}`,
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
      console.log(features);
      return features;
    } catch (error) {
      console.error("Error fetching building features:", error);
    }
  };

  const fetchBuildings = async (propertyId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/buildings?property_id=${propertyId}`,
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
    if (!filter) {
      filter = "All";
    }
    console.log(filter);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/searchProperty?filter=${filter}&search=${searchValue}`,
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
      console.log(data);
      // Fetch buildings for each property
      const propertiesWithBuildings = await Promise.all(
        data.properties.map(async (property) => {
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
      handleShowErrorToast(
        "This feature is only available on larger screens (1366px or wider)."
      );
    }
  };

  const arrowFetch = () => {
    if (!selectedValue || selectedValue === "All") {
      console.log("No value selected in dropdown");
    } else {
      console.log("Selected Value:", selectedValue);
    }

    // Log search input with a check for emptiness
    if (!searchInput) {
      console.log("No input in search field");
    } else {
      console.log("Search Input:", searchInput);
    }
    hideSuggestions();
    setShowSuggestions(false);
    openPopup();
    setLoading(true);

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
  };

  return (
    <>
      <div className="relative w-full h-screen">
        <div className="absolute inset-0 bg-cover bg-center ">
          <div className="relative flex h-screen w-full">
            {/* Video Background */}
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="https://media-hosting.imagekit.io//38b93b6acb734596/2282013-uhd_3840_2024_24fps.mp4?Expires=1831509595&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=KLVgRw2~SphMTJt1oS~bhEjmQwWPjG3FTU~WGzMMBRBYgKoN0UCoOm7o4Zgrnr6ugewVBQ3n56D9bez~IuFNGaoUo22r2LHooVo0HAqmix6zXpj6X4Pny0vJcNitDTIOtddda9sAZDUymTCgg6AoAc0jAaG2yRIZ1QRCQ9RQf4BuB-N2lrl8OSo1eEpA-AV9s6p7FA4p0V6l3po19Ok6sgZgnMdxkgghGsck1ucAAwdrjed9EeDLLJLVW7MrMMBbrDBi90tLyVwNhJ8aoF9nyPt3iOwZNH02PMgo1Q9peMeoTFihab9m8UoDVu31Kil54q~VBlVm6XYo0m~u48YYxw__"
              autoPlay
              loop
              muted
              playsInline
            ></video>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-customBlue"></div>

            {/* Content Section */}
            <div className="relative z-10 content sm:mt-10 xl:mt-40 2xl:mt-48 flex flex-col items-center xl:items-start justify-center text-center mt-10">
              <div className="w-full max-w-7xl xl:max-w-full xl:pl-20 xl:text-left">
                {/* Title */}
                <h1 className="mt-2 p-2 text-6xl lg:text-9xl font-medium text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                  Λ L V E O LAND
                </h1>

                {/* Subtitle */}
                <h4 className="text-1xl font-thin sm:text-3xl md:text-xl lg:text-xl xl:text-3xl 2xl:text-5xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                  LIVE WELL ACROSS THE PHILIPPINES
                </h4>
                <div className="my-6 h-auto grid grid-cols-1 gap-6 relative p-2">
                  {/* Left Column: Search Inputs */}
                  <div className="space-y-6 relative text-sm">
                    {/* Search Bar */}
                    <div className="flex items-center border p-3 max-w-4xl bg-transparent">
                      {/* Dropdown Selection */}
                      <div className="relative">
                        <select
                          id="locationDropdown"
                          value={selectedValue}
                          onChange={handleSelectChange}
                          className="bg-transparent w-full text-white placeholder-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 
                          "
                          aria-label="Select search category"
                        >
                          <option
                            value=""
                            disabled
                            selected
                            className="bg-[#002B47] text-white"
                          >
                            Filter
                          </option>
                          <option
                            value="all"
                            className="bg-[#002B47] text-white"
                          >
                            All
                          </option>
                          <option
                            value="name"
                            className="bg-[#002B47] text-white"
                          >
                            Residence Name
                          </option>
                          <option
                            value="location"
                            className="bg-[#002B47] text-white"
                          >
                            Location
                          </option>
                          <option
                            value="status"
                            className="bg-[#002B47] text-white"
                          >
                            Status
                          </option>
                          <option
                            value="specific_location"
                            className="bg-[#002B47] text-white"
                          >
                            Specific Location
                          </option>
                          <option
                            value="price_range"
                            className="bg-[#002B47] text-white"
                          >
                            Price Range
                          </option>
                          <option
                            value="units"
                            className="bg-[#002B47] text-white"
                          >
                            Units
                          </option>
                          <option
                            value="land_area"
                            className="bg-[#002B47] text-white"
                          >
                            Land Area
                          </option>
                          <option
                            value="development_type"
                            className="bg-[#002B47] text-white"
                          >
                            Development Type
                          </option>
                          <option
                            value="architectural_theme"
                            className="bg-[#002B47] text-white"
                          >
                            Architectural Theme
                          </option>
                        </select>
                      </div>

                      {/* Input Field */}
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Enter your search"
                          aria-label="Search"
                          id="searchInput"
                          className="w-full bg-transparent text-white placeholder-white px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#1F62B4] focus:border-[#1F62B4]"
                          value={searchInput || ""}
                          onChange={handleSearchInputChange}
                        />
                      </div>

                      {/* Search Button */}
                      <button
                        onClick={arrowFetch}
                        className="bg-transparent text-white font-semibold px-4 py-2 border-l border-white hover:text-[#1F62B4] focus:outline-none"
                      >
                        <FaSearch className="text-xl" />
                      </button>
                    </div>

                    {/* Suggestions Dropdown */}
                    {isSuggestionsVisible && searchInput.trim() && (
                      <div className="absolute max-h-60 overflow-y-auto w-full sm:w-2/4 md:w-2/4 lg:w-1/3 xl:w-1/4 mx-auto top-full mt-2 z-20 bg-white shadow-lg rounded-md space-y-1">
                        {suggestions.length > 0 && selectedValue !== "All" ? (
                          suggestions.map((item, index) => (
                            <div
                              key={index}
                              className="cursor-pointer hover:bg-[#f1f1f1] p-3 rounded-md transition duration-200"
                              onClick={() => {
                                setSearchInput(item[selectedValue]); // Dynamically set search input
                                setSuggestions([]);
                                setIsSuggestionsVisible(false);
                              }}
                            >
                              {item[selectedValue]}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-center py-3">
                            No Data Available
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="fixed top-20 right-1 z-50 lg:top-13 lg:right-2 flex space-x-2">
            {/* Room Planner Icon */}
            <div className="flex justify-center items-center">
              <div className="bg-white border-2 rounded-3xl w-12 h-12 flex items-center justify-center border-customBlue transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
                <a href="/pages/roomplanner" target="_blank">
                  <div className="cursor-pointer relative group">
                    <IoBed
                      className="w-8 h-8 transform transition-transform duration-200 ease-in-out text-customBlue"
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform =
                          "scale(1.1) translateY(-5px)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform =
                          "scale(1) translateY(0)")
                      }
                    />
                    <span className="tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Room Planner
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Loan Calculator Icon */}
            <div className="flex justify-center items-center">
              <div className="bg-white border-2 rounded-3xl w-12 h-12 flex items-center justify-center border-customBlue transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
                <a href="/pages/loancalculator" passHref>
                  <div className="relative group">
                    <FaCalculator
                      className="w-8 h-8 transform transition-transform duration-200 ease-in-out text-customBlue"
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform =
                          "scale(1.1) translateY(-5px)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform =
                          "scale(1) translateY(0)")
                      }
                    />
                    <span className="tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Loan Calculator
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Set Appointment Icon */}
            <div className="flex justify-center items-center">
              <div className="bg-white border-2 rounded-3xl w-12 h-12 flex items-center justify-center border-customBlue transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
                <a href="/pages/set-appointment" passHref>
                  <div className="relative group">
                    <FaCalendarAlt
                      className="w-8 h-8 transform transition-transform duration-200 ease-in-out text-customBlue"
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform =
                          "scale(1.1) translateY(-5px)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform =
                          "scale(1) translateY(0)")
                      }
                    />
                    <span className="tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Set Appointment
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Submit Property Icon */}
            <div className="flex justify-center items-center">
              <div className="bg-white border-2 rounded-3xl w-12 h-12 flex items-center justify-center border-customBlue transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
                <a href="/pages/add-property" passHref>
                  <div className="relative group">
                    <FaHouseCircleCheck
                      className="w-8 h-8 transform transition-transform duration-200 ease-in-out text-customBlue"
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform =
                          "scale(1.1) translateY(-5px)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform =
                          "scale(1) translateY(0)")
                      }
                    />
                    <span className="tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Submit Property
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Agent Icon */}
            <div className="flex justify-center items-center">
              <div className="bg-white border-2 rounded-3xl w-12 h-12 flex items-center justify-center border-customBlue transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">
                <a href="/pages/agent" passHref>
                  <div className="relative group">
                    <IoManSharp
                      className="w-8 h-8 transform transition-transform duration-200 ease-in-out text-customBlue"
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform =
                          "scale(1.1) translateY(-5px)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform =
                          "scale(1) translateY(0)")
                      }
                    />
                    <span className="tooltip absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white bg-black rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Agent
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {enlargedImage && (
            <div
              className="absolute top-1 w-screen  h-1/2 md:w-1/2 md:h-screen z-40"
              onClick={closeEnlargedImage}
            >
              <img
                src={enlargedImage}
                alt="Enlarged"
                className="w-full h-full" // Adjust as necessary
              />
            </div>
          )}
          {isPopupVisible && (
            <div
              className="popup-container absolute inset-0  flex justify-center
             items-center h-screen overflow-auto top-1/2 z-50 md:w-1/2 md:left-1/2 lg:right-0 xl:right-0 2xl:ml-36  md:top-0"
            >
              <div
                className="bg-customBlue p-6  w-full max-w-2xl h-full  
              overflow-y-auto relative shadow-lg"
              >
                <span
                  className="absolute top-4 right-4 text-2xl cursor-pointer
                   text-white hover:text-red-600 transition-colors duration-300"
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
                      className="property-card mb-8 space-y-8 p-6"
                    >
                      <div className="flex flex-col items-center text-center">
                        <h2 className="text-4xl font-thin text-white">
                          {property.name} at {property.location}
                        </h2>
                        <a href={`/pages/buildings/${property.id}`}>
                          <h2
                            className="font-semibold text-white underline  px-4 
      rounded-lg cursor-pointer text-sm "
                          >
                            Interested? Click Here
                          </h2>
                        </a>
                      </div>

                      {[property.path].map((imgPath, imgIndex) => {
                        console.log();
                        return (
                          <div className="relative" key={imgIndex}>
                            <img
                              src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${imgPath}`}
                              alt={`${property.name} view ${imgIndex + 1}`}
                              onMouseEnter={() => setHoveredImage(imageSrc)}
                              onMouseLeave={() => setHoveredImage(null)}
                              onClick={() => handleImageClick(imageSrc)}
                              className="w-full h-auto shadow-lg
                              group-hover:shadow-xl transform transition-all 
                              duration-300 ease-in-out hover:scale-105 object-cover"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 ease-in-out rounded-lg"></div>
                          </div>
                        );
                      })}

                      <div
                        className="property-info  p-6 rounded-lg shadow-lg 
                      hover:shadow-xl transition-shadow duration-300 ease-in-out text-white"
                      >
                        <div
                          className="property-detail-item flex items-center 
                        justify-between border-b pb-4 mb-4 text-white"
                        >
                          <span className="text-white font-semibold w-1/2 text-left">
                            Status:
                          </span>
                          <span className="text-gray-200 w-1/2 text-left">
                            {property.status}
                          </span>
                        </div>
                        <div className="property-detail-item flex items-center justify-between border-b pb-4 mb-4">
                          <span className="text-white font-semibold w-1/2 text-left">
                            Price Range:
                          </span>
                          <span className="text-gray-200 w-1/2 text-left">
                            {`PHP ${new Intl.NumberFormat("en-PH").format(
                              property.price_range.split(" - ")[0]
                            )} - PHP ${new Intl.NumberFormat("en-PH").format(
                              property.price_range.split(" - ")[1]
                            )}`}
                          </span>
                        </div>
                        <div className="property-detail-item flex items-center justify-between border-b pb-4 mb-4">
                          <span className="text-white font-semibold w-1/2 text-left">
                            Land Area:
                          </span>
                          <span className="text-gray-200 w-1/2 text-left">
                            {property.land_area}
                          </span>
                        </div>
                        <div className="property-detail-item flex items-center justify-between border-b pb-4 mb-4">
                          <span className="text-white font-semibold w-1/2 text-left">
                            Architectural Theme:
                          </span>
                          <span className="text-gray-200 w-1/2 text-left">
                            {property.architectural_theme}
                          </span>
                        </div>
                        <div className="property-detail-item flex items-center justify-between border-b pb-4 mb-4">
                          <span className="text-white font-semibold w-1/2 text-left">
                            Development Type:
                          </span>
                          <span className="text-gray-200 w-1/2 text-left">
                            {property.development_type}
                          </span>
                        </div>
                        <div className="property-detail-item flex items-center justify-between border-b pb-4 mb-4">
                          <span className="text-white font-semibold w-1/2 text-left">
                            Specific Location:
                          </span>
                          <span className="text-gray-200 w-1/2 text-left">
                            {property.specific_location}
                          </span>
                        </div>
                        <div className="property-detail-item flex items-center justify-between">
                          <span className="text-white font-semibold w-1/2 text-left">
                            Units:
                          </span>
                          <span className="text-gray-200 w-1/2 text-left">
                            {property.units}
                          </span>
                        </div>
                      </div>

                      {/* Key Features Section */}
                      <div className="features-section space-y-8 flex flex-col items-center justify-center">
                        <span
                          className="section-title text-3xl font-thin 
                        text-white tracking-tight text-center uppercase"
                        >
                          Building Facilities
                        </span>
                        <ul
                          className="features-list grid grid-cols-2 
                         w-full max-w-4xl"
                        >
                          {property.features &&
                          JSON.parse(property.features).length > 0 ? (
                            JSON.parse(property.features).map(
                              (feature, featureIndex) => {
                                const getImageSrc = (imagePath) => {
                                  if (!imagePath) return ""; // If no image path, return empty string or placeholder

                                  // If the image path matches '/property/' pattern, treat it as a URL that requires the base URL
                                  if (/^\/property\//.test(imagePath)) {
                                    return `${
                                      process.env.NEXT_PUBLIC_SERVER_PORT
                                    }${imagePath.replace(/\\/g, "/")}`;
                                  }

                                  // If the image path matches 'http' or 'https', it's already a full URL
                                  if (/^https?:\/\//.test(imagePath)) {
                                    return imagePath;
                                  }

                                  // If it's a relative path (assets folder), convert it to the correct path
                                  return `${imagePath.replace(/\\/g, "/")}`;
                                };

                                const imageSrc = getImageSrc(feature.image);

                                return (
                                  <li
                                    key={featureIndex}
                                    className="feature-item flex flex-col items-center 
                                    gap-2 p-6 w-full text-center"
                                  >
                                    <img
                                      src={imageSrc}
                                      alt={feature.name}
                                      className="feature-icon w-30 h-24 border-2 shadow-lg 
                transform transition-transform duration-300 
                hover:scale-125 hover:shadow-xl"
                                      onMouseEnter={() =>
                                        setHoveredImage(imageSrc)
                                      }
                                      onMouseLeave={() => setHoveredImage(null)}
                                      onClick={() => handleImageClick(imageSrc)}
                                      style={{ cursor: "pointer" }}
                                    />
                                    <span
                                      className="text-lg font-thin 
                                    text-gray-200 tracking-tight"
                                    >
                                      {feature.name}
                                    </span>
                                  </li>
                                );
                              }
                            )
                          ) : (
                            <div className="text-center text-xl font-thin text-gray-200">
                              No features available
                            </div>
                          )}
                        </ul>
                      </div>

                      {/* Building Features Section */}
                      <div className="">
                        {/* Section Title */}
                        <span
                          className="section-title flex 
                        justify-center text-center text-2xl font-thin 
                         text-white tracking-wide uppercase mb-4"
                        >
                          Building Features
                        </span>

                        {/* Building Features List */}
                        <ul
                          className="building-features-list  
                        list-none text-start justify-start"
                        >
                          {property.buildingfeatures &&
                          property.buildingfeatures.length > 0 ? (
                            property.buildingfeatures.map(
                              (feature, featureIndex) => (
                                <li
                                  key={featureIndex}
                                  className="building-feature-item flex 
                                  items-start text-start justify-start  
                                  text-lg text-gray-200"
                                >
                                  {/* Add an icon for each feature */}
                                  <span className="icon text-cyan-400">
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
                                  <span
                                    className="text-gray-200 
                                  font-thin"
                                  >
                                    {feature.name}
                                  </span>
                                </li>
                              )
                            )
                          ) : (
                            <li className="text-gray-200 text-lg">
                              {/* Add a subtle placeholder icon */}
                              <span className="icon text-gray-200">
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
                                    d="M9 12h6m-6 4h6m-6-8h6m2-4H7a2 2 0 00-2 
                                    2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2z"
                                  />
                                </svg>
                              </span>
                              No building features available.
                            </li>
                          )}
                        </ul>

                        {/* Building Layout Section */}
                        {property.buildings &&
                          property.buildings.length > 0 && (
                            <div className="mt-6 w-auto flex justify-center">
                              <div className="w-auto max-w-4xl">
                                {/* Container with max width */}
                                <span
                                  className="section-title text-2xl font-bold 
                              text-white tracking-wide uppercase"
                                >
                                  Building Layout
                                </span>
                                <ul className="mt-3 flex -ml-9 flex-wrap w-80 gap-5">
                                  {/* Grid layout */}
                                  {property.buildings.map(
                                    (building, buildingIndex) => (
                                      <li
                                        key={buildingIndex}
                                        className="space-y-4 bg-gray-100 
                                      shadow-xl hover:shadow-2xl 
                                      transition-shadow duration-300 p-4"
                                      >
                                        <h5
                                          className="text-xl font-semibold 
                                      text-gray-800"
                                        >
                                          {building.name}
                                        </h5>

                                        <div className="relative">
                                          <img
                                            src={
                                              building.path
                                                ? /^https?:\/\//.test(
                                                    building.path
                                                  ) // Check if the path starts with "http" or "https"
                                                  ? building.path
                                                  : /^\/property\//.test(
                                                      building.path
                                                    ) // Check if the path starts with "/property/"
                                                  ? `${
                                                      process.env
                                                        .NEXT_PUBLIC_SERVER_PORT
                                                    }${building.path.replace(
                                                      /\\/g,
                                                      "/"
                                                    )}`
                                                  : `${building.path.replace(
                                                      /\\/g,
                                                      "/"
                                                    )}` // Default to handling relative paths
                                                : ""
                                            }
                                            alt={building.name}
                                            onMouseEnter={() =>
                                              setHoveredImage(building.path)
                                            }
                                            onMouseLeave={() =>
                                              setHoveredImage(null)
                                            }
                                            onClick={() =>
                                              handleImageClick(building.path)
                                            }
                                            className="w-full h-64 object-cover 
    transition-all duration-300 transform 
    hover:scale-105"
                                          />
                                        </div>

                                        <ul className="mt-4 text-gray-700 space-y-2 list-none pl-0">
                                          <li>
                                            <strong className="text-gray-800">
                                              Development Type:
                                            </strong>{" "}
                                            {building.development_type}
                                          </li>
                                          <li>
                                            <strong className="text-gray-800">
                                              Residential Levels:
                                            </strong>{" "}
                                            {building.residential_levels}
                                          </li>
                                          <li>
                                            <strong className="text-gray-800">
                                              Basement Parking Levels:
                                            </strong>{" "}
                                            {building.basement_parking_levels}
                                          </li>
                                          <li>
                                            <strong className="text-gray-800">
                                              Podium Parking Levels:
                                            </strong>{" "}
                                            {building.podium_parking_levels}
                                          </li>
                                          <li>
                                            <strong className="text-gray-800">
                                              Commercial Units:
                                            </strong>{" "}
                                            {building.commercial_units}
                                          </li>
                                        </ul>
                                      </li>
                                    )
                                  )}
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
  const pathname = usePathname(); // Use the usePathname hook to access the current path
  const [currentLocation, setCurrentLocation] = useState("LOCATION");
  const [specificLocation, setSpecificLocation] = useState("");
  const [posts, setPosts] = useState({}); // State to store fetched data

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCurrentLocation(params.get("currentLocation") || "LOCATION");
    setSpecificLocation(params.get("specificLocation") || "");
    console.log(params);
  }, []);

  useEffect(() => {
    // Fetch data from the backend API
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/area_user`) // Adjust the API endpoint if necessary
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // Log the raw data fetched from the API

        const fetchedPosts = {};
        // Process the data into a key-value object
        data.forEach((location) => {
          const key = location.area_name; // The transformed area_name from the backend
          fetchedPosts[key] = {
            location: location.area_name,
            key: key,
            path: location.image, // Image path from the API
            title: location.title,
            intro: location.description,
          };
        });
        setPosts(fetchedPosts); // Set the transformed data to state
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
      });
  }, []);
  const handleToggle = (key) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [key]: !prevExpanded[key],
    }));
  };

  const [expanded, setExpanded] = useState({});

  const toggleReadMore = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <>
      <SEO
        title="REAL ESTATE"
        description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
        keywords="alveo, real estate, luxury living, property, condominiums, luxury homes, investment, residential properties,sale"
        canonical="${process.env.NEXT_PUBLIC_LOCAL_PORT}"
      />

      <div className="mb-10">
        <Header />
      </div>

      <AlveoBanner />

      <Carousel />
      <div className="flex flex-col xl:flex-row w-screen">
        <div className="w-full">
          <AboutAlveo />
        </div>
      </div>
      <div className="w-full mx-auto overflow-hidden mt-3 text-center h-full relative pb-10">
        <div className="w-full flex xl:flex-row">
          {/* Map Section */}
          {/* <div className='items-start w-full xl:w-1/2 mb-6 xl:mb-0 me-5 p-3'>
            <h1 className='font-thin items-center text-4xl text-customBlue border-t-2 w-28 border-customBlue pl-4 pb-3 mx-20 whitespace-nowrap'>
              OUR LOCATIONS
            </h1>
            {/* <Map/> */}
          {/* <img
              src='/assets/Location/Address-cuate.svg'
              alt='Our Locations'
              className='w-full h-80 mx-auto hidden sm:block'
            />
          </div>  */}

          {/* Image Gallery Section */}
          <div className="w-full mx-auto overflow-hidden mt-3 text-center h-full relative pb-10 px-4 sm:px-6 lg:px-8">
            <h1
              className="font-thin items-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-customBlue 
      border-t-2 w-fit mx-auto border-customBlue whitespace-nowrap mt-4"
            >
              RECOMMENDED LOCATIONS
            </h1>
            <div className="p-2 mx-auto">
              <div className="flex flex-wrap -mx-2">
                {Object.values(posts)
                  .slice(-4) // Limit to the last 4 items
                  .reverse() // Reverse the order to display the latest first
                  .map(({ location, key, path, title, intro }) => (
                    <div
                      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-8"
                      key={key}
                    >
                      <div className="bg-white shadow-md overflow-hidden flex flex-col h-full">
                        <ImageWithLoader
                          src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${path}`} // Try to load from localhost:3000
                          alt={title}
                        />
                        <div className="p-4 flex flex-col justify-between flex-grow">
                          <div>
                            <h5 className="text-lg font-semibold">{title}</h5>
                            <p className="text-base">
                              {expanded[key]
                                ? intro
                                : `${intro.substring(0, 100)}...`}
                            </p>
                          </div>
                          <a
                            href={`/pages/locations/${key}`} // Standard anchor tag for navigation
                            className="mt-4 text-customBlue hover:text-customBlue"
                          >
                            {expanded[key] ? "Read Less" : "Read More"} &rarr;
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <a
              href="/pages/location"
              className="mt-4 inline-block text-customBlue hover:text-customBlue text-lg font-medium"
            >
              View All
            </a>
          </div>
        </div>
      </div>

      <div className="max-sm:mt-32 sm:mt-32 xl:mt-0 xl:z-50">
        <SocialMediaFloating />
        <MyBot />
        <Footer />
      </div>

      {/**    
        
      */}

      <div></div>
    </>
  );
};

export default DashboardComponent;
