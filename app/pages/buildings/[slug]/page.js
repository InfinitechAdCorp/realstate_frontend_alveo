"use client"; // If you're using client-side components
import { useEffect, useState } from "react";
import Image from "next/image";
import Directory from "../../pathDirectory";
import Header from "../../header";
import Footer from "./../../footer";
import SEO from "./../../../seo/page"
import { showToast } from '@/components/alert/page';

export default function BlogPost({ params }) {
  const { slug } = params; // Extract slug from params
  const [property, setProperty] = useState(null); // State to hold property data
  const [loading, setLoading] = useState(true); // State for loading
  const [facilities, setFacilities] = useState([]);
  const [buildings, setBuildings] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {
    setIsOpen(!isOpen);
  };
    const handleShowSuccessToast = (message) => {
    showToast(message, 'success');
  };

  const handleShowErrorToast = (message) => {
    showToast(message, 'error'); // Error toast
  };

  const handleShowWarningToast = (message) => {
    showToast(message, 'warning'); // Warning toast
  };
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    appointmentDate: "",
    unit: "",
    message: "",
    status:"PENDING",
    reason:"REQUEST VIEWING",
  });
 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/property/id/${slug}`
        ); // Use the new endpoint for fetching by ID
        const data = await res.json();

        if (res.ok) {
          setProperty(data);
  
          await fetchFacilities(slug);
          await fetchBuildings(slug);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFacilities = async (propertyId) => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/facilities/id/${propertyId}`
        ); // Fetch facilities
        const data = await res.json();

        if (res.ok) {
          setFacilities(data);

        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };

    const fetchBuildings = async (propertyId) => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/buildings/id/${propertyId}`
        ); // Fetch buildings
        const data = await res.json();

        if (res.ok) {
          setBuildings(data); // Ensure you're setting buildings, not facilities

        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };

    fetchProperty();
  }, [slug]);
  const parseFeatures = (features) => {
    try {
      return JSON.parse(features);
    } catch (error) {
      console.error("Error parsing features:", error);
      return [];
    }
  };
const submitAppointment = () => {
  
// Assuming formData contains the appointment data from the form
const formdata = { ...formData, propertyId: property.id };
const formattedDateForDisplay = new Date(formData.appointmentDate).toLocaleString("en-US", {
  month: "2-digit",  // Always show two digits for the month (02).
  day: "2-digit",    // Always show two digits for the day (02).
  year: "numeric",   // Full year (2025).
  hour: "2-digit",   // Always show two digits for the hour.
  minute: "2-digit", // Always show two digits for minutes.
  hour12: true,      // AM/PM format.
});

// Now we need to send this formatted date to the backend for storage (ISO 8601 format)
const isoDateForBackend = new Date(formData.appointmentDate).toISOString();

// Prepare the data to send to the backend
const formDataToSubmit = { 
  ...formData, 
  unit: property.name,
  appointmentDate: isoDateForBackend, // Send the ISO format date to the backend
};

console.log("Appointment Details to send:", formDataToSubmit);


  fetch("http://localhost:8000/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataToSubmit),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Appointment saved successfully:", data);
      handleShowSuccessToast("Appointment scheduled successfully!");
    })
    
    .catch((error) => {
      console.error("Error saving appointment:", error.message);
      handleShowErrorToast("Failed to schedule appointment. Please try again.");
    });
};


  if (loading) return <div></div>;

  if (!property) return <div>Property not found</div>;
  const parsedFeatures = parseFeatures(property.features);
  return (
    <>
     <SEO
  title="REAL ESTATE"
  description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
  keywords="alveo, real estate, luxury property, property features, building information, property information, building features, condominium features"
  canonical="http://localhost:3000"
/>
        <div className="mb-10">
    <Header />
      </div>
      <div className=" p-4 md:p-8 mt-2 w-full mb-20">
        <h1 className="text-2xl font-bold mb-4 text-center">{property.name}</h1>
        <div className="grid gap-4 lg:flex justify-center items-center text-center w-full 2xl:w-8/12 mx-auto">
 <img
  src={
    property.path?.startsWith("https://") 
      ? property.path // If it's already a full URL, use it directly
      : `http://localhost:8000/${property.path}`
  }
  alt={property.name}
  className="w-full max-h-96 h-auto xl:max-h-72 mx-auto mb-4 rounded-lg shadow-md"
/>


     <img
  src={
    property.view?.startsWith("https://") 
      ? property.view // If it's already a full URL, use it directly
      : `http://localhost:8000/${property.view}`
  }
  alt={property.name}
  className="w-full max-h-96 h-auto xl:max-h-72 mx-auto mb-4 rounded-lg shadow-md"
/>


        </div>

        <div className="property-info mb-4">
      <div className="flex items-center">
  <h2 className="text-xl font-semibold mb-2">Details</h2>


 <div className="ml-auto">
  <button  onClick={togglePopup} className="px-6 py-2 text-md font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out">
    Request Viewing
  </button>
</div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-2/3 flex flex-col md:flex-row gap-6">
            {/* Property Details */}
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <p>
                <strong>Name:</strong> {property.name}
              </p>
              <p>
                <strong>Location:</strong> {property.location}
              </p>
              <p>
                <strong>Price Range:</strong> {property.price_range}
              </p>
              <p>
                <strong>Status:</strong> {property.status}
              </p>
              <p>
                <strong>Development Type:</strong> {property.development_type}
              </p>
              <p>
                <strong>Units:</strong> {property.units}
              </p>
              <p>
                <strong>Specific Location:</strong> {property.specific_location}
              </p>
            </div>

            {/* Schedule Appointment */}
<div className="w-full md:w-1/2">
  <h2 className="text-xl font-semibold mb-4">Schedule Appointment</h2>
  <form
    className="grid grid-cols-1 md:grid-cols-2 gap-4"
    onSubmit={(e) => {
      e.preventDefault();
      submitAppointment();
    }}
  >
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Name
      </label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Your Name"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Phone Number
      </label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Your Phone Number"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Your Email"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Appointment Date & Time
      </label>
      <input
        type="datetime-local"
        name="appointmentDate"
        value={formData.appointmentDate}
        onChange={handleInputChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Message
      </label>
      <textarea
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Any additional details or message"
      />
    </div>
    <button
      type="submit"
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 col-span-2"
    >
      Confirm Appointment
    </button>
  </form>
</div>



            {/* Close button */}
            <button
              className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
              onClick={togglePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}



</div>

          
            <p>
              <strong>Location:</strong> {property.location}
            </p>
            <p>
              <strong>Price Range:</strong> {property.price_range}
            </p>
            <p>
              <strong>Status:</strong> {property.status}
            </p>
            <p>
              <strong>Development Type:</strong> {property.development_type}
            </p>
            <p>
              <strong>Units:</strong> {property.units}
            </p>
            <p>
              <strong>Specific Location:</strong> {property.specific_location}
            </p>
          </div>

        <div className="features mb-4">
          <h2 className="text-xl font-semibold mb-2">Features</h2>
          {parsedFeatures.length === 0 ? (
            <p>No features available for this property.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 text-center">
              {parsedFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="border rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                  <h4>{feature.name}</h4>
      <img
  src={
    feature.image?.startsWith("https://") 
      ? feature.image // If it's already a full URL, use it directly
      : `http://localhost:8000/${feature.image.replace(/\\/g, "/")}` // Replace backslashes and prepend the base URL
  }
  alt={feature.name}
  className="w-full h-auto"
/>

                </div>
              ))}
            </div>
          )}
        </div>

        <div className="facilities mb-4 p-2 bg-gray-100 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-center mb-4">Facilities</h2>
          <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 text-center justify-center -ml-9">
            {facilities.map((facility) => (
              <li
                key={facility.id}
                className="bg-white p-4 rounded-lg shadow hover:-translate-y-1 transition "
              >
                <span className="text-lg text-gray-700">{facility.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-xl font-semibold mt-4 mb-4 text-center justify-center sm:text-4xl">
          Buildings
        </h2>
        <div className="buildings grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {buildings.length === 0 ? (
            <p>No buildings available for this property.</p>
          ) : (
            buildings.map((building) => (
              <div
                key={building.id}
                className="flex flex-col items-center p-6 rounded-lg bg-gray-100 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-center mb-6">
                  {building.name}
                </h3>
  <img
  src={
    building.path && building.path.startsWith("https://")
      ? building.path // If it's already a full URL, use it directly
      : building.path 
        ? `http://localhost:8000/${building.path.replace(/\\/g, "/")}` // If it's a relative path, construct the full URL
        : '' // If there's no path, set it to an empty string or fallback image URL
  }
  alt={building.name}
  className="w-full h-60 rounded-lg mb-6"
/>

                <div className="text-base">
                  <p>
                    <strong>Residential Levels:</strong>{" "}
                    {building.residential_levels}
                  </p>
                  <p>
                    <strong>Basement Parking Levels:</strong>{" "}
                    {building.basement_parking_levels}
                  </p>
                  <p>
                    <strong>Podium Parking Levels:</strong>{" "}
                    {building.podium_parking_levels || "N/A"}
                  </p>
                  <p>
                    <strong>Commercial Units:</strong>{" "}
                    {building.commercial_units || "N/A"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
