"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Directory from "../../pathDirectory";
import Header from "../../header";
import Footer from "./../../footer";
import SEO from "./../../../seo/page";
import { showToast } from "@/components/alert/page";

export default function BlogPost({ params }) {
  const { slug } = params;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState("");

  // Handle when the image has loaded
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const togglePopup = (type = "") => {
    setPopupType(type);
    setIsOpen(!isOpen);
  };
  const handleShowSuccessToast = (message) => {
    showToast(message, "success");
  };

  const handleShowErrorToast = (message) => {
    showToast(message, "error");
  };

  const handleShowWarningToast = (message) => {
    showToast(message, "warning");
  };
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    appointmentDate: "",
    unit: "",
    message: "",
    status: "PENDING",
    reason: "",
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
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/property/id/${slug}`
        );
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
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/facilities_user/id/${propertyId}`
        );
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
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/buildings_user/id/${propertyId}`
        );
        const data = await res.json();

        if (res.ok) {
          setBuildings(data);
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
  const submitForm = () => {
    console.log(popupType);

    const formdata = { ...formData, propertyId: property.id };
    const formattedDateForDisplay = new Date(
      formData.appointmentDate
    ).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const isoDateForBackend = new Date(formData.appointmentDate).toISOString();

    const formDataToSubmit = {
      ...formData,
      unit: property.name,
      appointmentDate: isoDateForBackend,
    };

    console.log(formDataToSubmit);
    if (popupType === "Request Viewing") {
      const formDataToSubmit = {
        ...formData,
        unit: property.name,
        appointmentDate: isoDateForBackend,
        reason: popupType,
      };
      submitAppointment(formDataToSubmit);
      console.log("Submitting Viewing Request:", formDataToSubmit);
    } else if (popupType === "Property Inquiry") {
      const formDataToSubmit = {
        ...formData,
        unit: property.name,
        appointmentDate: isoDateForBackend,
        reason: popupType,
      };
      submitAppointment(formDataToSubmit);
    }
  };
  const submitAppointment = (formDataToSubmit) => {
    console.log("Appointment Details to send:", formDataToSubmit);

    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/appointments`, {
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
        console.log(popupType);
        const successMessage =
          popupType === "Request Viewing"
            ? "Appointment scheduled successfully!"
            : "Property inquired successfully!";

        handleShowSuccessToast(successMessage);
      })

      .catch((error) => {
        console.error("Error saving appointment:", error.message);
        handleShowErrorToast(
          "Failed to schedule appointment. Please try again."
        );
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
        canonical="${process.env.NEXT_PUBLIC_LOCAL_PORT}"
      />
      <div className="mb-10">
        <Header />
      </div>
      <div className=" p-4 md:p-8 mt-20 w-full mb-20 ">
        <h1 className="text-2xl font-semibold text-customBlue mb-4 text-center">
          {property.name}
        </h1>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="relative">
              <div className="grid gap-4">
                {isLoading && (
                  <div className="absolute  inset-0 flex items-center justify-center bg-gray-200 w-full h-auto max-h-80 object-cover rounded-sm">
                    <div className="text-5xl font-thin text-opacity-40 text-cyan-700 animate-pulse">
                      Λ L V E O
                    </div>
                  </div>
                )}
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${property.path}`}
                  alt={property.name}
                  className="w-full h-auto max-h-80 object-cover rounded-sm"
                />
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div className="property-info mb-4">
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">Property Details</h2>
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
                    <strong>Development Type:</strong>{" "}
                    {property.development_type}
                  </p>
                  <p>
                    <strong>Units:</strong> {property.units}
                  </p>
                  <p>
                    <strong>Specific Location:</strong>{" "}
                    {property.specific_location}
                  </p>
                </div>

                <div className="mt-7 space-x-4">
                  <button
                    onClick={() => togglePopup("Request Viewing")}
                    className="px-6 py-2 text-md font-semibold text-white bg-cyan-700 
                    shadow-md hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    Request Viewing
                  </button>
                  <button
                    onClick={() => togglePopup("Property Inquiry")}
                    className="px-6 py-2 text-md font-semibold text-white bg-cyan-700 
                    shadow-md hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out"
                  >
                    Property Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-customBlue bg-opacity-60 z-50">
              <div className="bg-white p-6 shadow-lg w-11/12 sm:w-4/5 md:w-3/4 lg:w-1/2 flex flex-col md:flex-row gap-6 relative">
                <button
                  className="absolute top-0 right-4 p-2 text-2xl text-black rounded-full
                  "
                  onClick={togglePopup}
                >
                  &times;
                </button>

                <div className="w-full md:w-1/2">
                  <h2 className="text-xl font-semibold mb-4">
                    Property Details
                  </h2>
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
                    <strong>Development Type:</strong>{" "}
                    {property.development_type}
                  </p>
                  <p>
                    <strong>Units:</strong> {property.units}
                  </p>
                  <p>
                    <strong>Specific Location:</strong>{" "}
                    {property.specific_location}
                  </p>
                </div>

                <div className="w-full md:w-1/2 mt-2">
                  <h2 className="text-2xl font-semibold text-customBlue mb-4">
                    {popupType === "Request Viewing"
                      ? "Schedule Appointment"
                      : "Submit Inquiry"}
                  </h2>
                  <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitForm();
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-customBlue">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full p-2 border border-cyan-700 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-customBlue">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full p-2 border border-cyan-700 focus:ring-customBlue focus:border-blue-500"
                          placeholder="Your Phone Number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-customBlue">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full p-2 border border-cyan-700 focus:ring-customBlue focus:border-blue-500"
                          placeholder="Your Email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-customBlue">
                          {popupType === "Request Viewing"
                            ? "Appointment Date & Time"
                            : "Preferred Contact Date & Time"}
                        </label>
                        <input
                          type="datetime-local"
                          name="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleInputChange}
                          className="mt-1 block w-full p-2 border border-cyan-700 focus:ring-customBlue focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          className="mt-1 p-1 border border-gray-300 rounded-md shadow-sm 
                          focus:ring-blue-500 focus:border-blue-500 resize-none h-20 w-full"
                          placeholder="Type your message here"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-customBlue text-white 
                        hover:bg-cyan-700 items-center"
                      >
                        {popupType === "Request Viewing"
                          ? "Confirm Appointment"
                          : "Submit Inquiry"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-semibold mb-2">Features</h2>
          {!parsedFeatures || parsedFeatures.length === 0 ? (
            <p>No features available for this property.</p>
          ) : (
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 text-center">
              {parsedFeatures.map((feature, index) => (
                <div key={index} className="">
                  <div className="relative group perspective-1000">
                    {/* Loader/Placeholder */}
                    {isLoading && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-gray-200 
               rounded-lg w-full sm:w-80 h-40 sm:h-60 lg:w-96 lg:h-72"
                      >
                        <div className="text-xl font-thin text-opacity-40 text-cyan-700 animate-pulse">
                          Λ L V E O
                        </div>
                      </div>
                    )}

                    {/* Actual Image */}
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${feature.image}`}
                      alt={feature.name}
                      onLoad={handleImageLoad}
                      className="rounded-lg w-80 h-40 object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>
                  <p className="text-customBlue text-xl">{feature.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/*  Facilities */}
        <div className="max-w-7xl mx-auto px-4 py-6 relative bg-cover bg-center">
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold text-start mb-6 text-customBlue">
              Facilities
            </h2>

            {/* Facilities List */}
            {facilities.length === 0 ? (
              <div className="flex items-center justify-center">
                <p className="text-lg sm:text-xl text-white">
                  No facilities available for this property.
                </p>
              </div>
            ) : (
              <div className="text-start">
                <p className="text-xl text-gray-700 font-medium">
                  {facilities.map((facility, index) => (
                    <span key={facility.id}>
                      {facility.name}
                      {index < facilities.length - 1 ? ", " : ""}{" "}
                      {/* Add a comma except for the last item */}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* building */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-semibold text-start items-center mb-4">
            Buildings
          </h2>

          <div className="buildings grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {buildings.length === 0 ? (
              <div className="col-span-full flex items-center justify-center text-center">
                <p className="text-xl">
                  No buildings available for this property.
                </p>
              </div>
            ) : (
              buildings.map((building) => (
                <div
                  key={building.id}
                  className="flex flex-col items-center p-3 border-customBlue border-2 rounded-lg"
                >
                  <h3 className="text-xl font-semibold text-customBlue text-center mb-6">
                    {building.name}
                  </h3>

                  <div className="relative group perspective-1000">
                    {/* Loader */}
                    {isLoading && (
                      <div className="absolute w-full h-60 inset-0 flex items-center justify-center bg-gray-200">
                        <div className="text-xl font-thin text-opacity-40 text-cyan-700 animate-pulse">
                          Λ L V E O
                        </div>
                      </div>
                    )}

                    {/* Image */}
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${building.path}`}
                      alt={building.name}
                      className="w-full h-60 mb-6 object-cover rounded-lg transition-transform duration-300 ease-in-out transform group-hover:scale-105 group-hover:shadow-lg"
                      onLoad={() => setIsLoading(false)} // Stop showing the loader once the image loads
                      onError={() => setIsLoading(false)} // Hide the loader even if the image fails to load
                    />
                  </div>

                  {/* Building Information */}
                  <div className="text-start w-full">
                    <div className="mb-4">
                      <h5 className="mb-0 font-bold text-cyan-700">
                        {building.residential_levels}
                      </h5>
                      <span className="text-customBlue">
                        Residential Levels
                      </span>
                    </div>

                    <div className="mb-4">
                      <h5 className="mb-0 font-bold text-cyan-700">
                        {building.basement_parking_levels || "N/A"}
                      </h5>
                      <span className="text-customBlue">
                        Basement Parking Levels
                      </span>
                    </div>

                    <div className="mb-4">
                      <h5 className="mb-0 font-bold text-cyan-700">
                        {building.podium_parking_levels || "N/A"}
                      </h5>
                      <span className="text-customBlue">
                        Podium Parking Levels
                      </span>
                    </div>

                    <div>
                      <h5 className="mb-0 font-bold text-cyan-700">
                        {building.commercial_units || "N/A"}
                      </h5>
                      <span className="text-customBlue">Commercial Units</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
