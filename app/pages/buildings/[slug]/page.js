"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Directory from "../../pathDirectory";
import Header from "../../header";
import Footer from "./../../footer";
import SEO from "./../../../seo/page";
import { showToast } from "@/components/alert/page";
import Icon from "@/app/pages/socialmedia-icons/page";
import * as Yup from "yup";

export default function BlogPost({ params }) {
  const { slug } = params;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [errors, setErrors] = useState({});
  const [isImageVisible, setIsImageVisible] = useState(null);
  const [isImageVisibleMain, setIsImageVisibleMain] = useState(null);
  const handleImageClickMain = (index) => {
    setIsImageVisibleMain(index); // Show the clicked image in a larger container
  };
  const handleImageClick = (index) => {
    setIsImageVisible(index); // Show the clicked image
  };

  const handleImageHover = (index) => {
    setIsImageVisible(index); // Show the image when hovered
  };

  const handleImageLeave = () => {
    setIsImageVisible(null); // Hide the image when mouse leaves
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(4, "Name must be at least 4 characters"), // Minimum length of 4 characters
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^\d*$/, "Phone number must be numeric")
      .matches(/^[0-9]+$/, "Phone number must be numeric") // Ensures only digits
      .min(11, "Phone number must be 11 or 12 digits")
      .max(12, "Phone number must be 11 or 12 digits"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    message: Yup.string().required("Message is required"),
    appointmentDate: Yup.string().when("popupType", {
      is: "Request Viewing",
      then: Yup.string().required("Appointment date and time is required"),
    }),
  });
  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false }); // Ensure all fields are validated
      setErrors({}); // Clear previous errors if validation passes
      return true;
    } catch (err) {
      const newErrors = err.inner.reduce((acc, currentError) => {
        acc[currentError.path] = currentError.message; // Capture field-specific errors
        return acc;
      }, {});
      setErrors(newErrors); // Update the error state with the validation errors
      return false;
    }
  };
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
  const submitForm = async () => {
    const isValid = await validateForm(); // Await validation result
    console.log(isValid); // This will now show the resolved value (true/false)
    if (isValid) {
      console.log("Form is valid, submitting...");

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

      const isoDateForBackend = new Date(
        formData.appointmentDate
      ).toISOString();

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
    } else {
      // Handle invalid form (e.g., show error messages)
      handleShowErrorToast("Error Input Format");
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

      <div className=" p-2 md:p-8 mt-20 w-full mb-20 ">
        <h1 className="text-2xl font-semibold text-customBlue mb-4 text-center">
          {property.name}
        </h1>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="relative">
              <div className="grid gap-2">
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
                  onClick={() => handleImageClickMain(property.index)}
                />
                {isImageVisibleMain !== null && (
                  <div
                    className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
                    onClick={() => setIsImageVisibleMain(null)} // Close the modal when clicked outside
                  >
                    <div className="relative">
                      <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${property.path}`} // Assuming 'property' is defined elsewhere
                        alt={property.name}
                        className="max-w-[80vw] max-h-[80vh] object-contain rounded-lg shadow-lg"
                      />
                      <button
                        onClick={() => setIsImageVisibleMain(null)} // Close button
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                      >
                        X
                      </button>
                    </div>
                  </div>
                )}
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
                    <strong>Specific Location:</strong>{" "}
                    {property.specific_location}
                  </p>
                  <p>
                    <strong>Price Range:</strong>{" "}
                    <span className="text-black w-1/2 text-left">
                      {`₱${new Intl.NumberFormat("en-PH").format(
                        property.price_range.split(" - ")[0]
                      )} - ₱${new Intl.NumberFormat("en-PH").format(
                        property.price_range.split(" - ")[1]
                      )}`}
                    </span>
                  </p>

                  <p>
                    <strong>Status:</strong> {property.status}
                  </p>
                  <p>
                    <strong>Development Type:</strong>{" "}
                    {property.development_type}
                  </p>
                  <p>
                    <strong>Architectural Theme</strong>{" "}
                    {property.architectural_theme}
                  </p>
                  <p>
                    <strong>Units:</strong> {property.units}
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => togglePopup("Request Viewing")}
                    className="px-6 py-2 text-md font-semibold text-white bg-cyan-700 
    shadow-md hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out 
    sm:px-4 sm:py-2 sm:text-sm w-full sm:w-auto"
                  >
                    Request Viewing
                  </button>
                  <button
                    onClick={() => togglePopup("Property Inquiry")}
                    className="px-6 py-2 text-md font-semibold text-white bg-cyan-700 
    shadow-md hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out 
    sm:px-4 sm:py-2 sm:text-sm w-full sm:w-auto"
                  >
                    Property Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-customBlue bg-opacity-60 z-50">
              <div className="bg-white p-8 shadow-lg w-11/12 sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-3/5 flex flex-col md:flex-row gap-8 relative max-h-screen overflow-y-auto mt-10">
                <button
                  className="absolute top-2 right-4 p-2 text-2xl text-black rounded-full"
                  onClick={togglePopup}
                >
                  &times;
                </button>

                <div className="w-full md:w-1/2">
                  <h2 className="text-xl font-semibold mb-4">
                    Property Details
                  </h2>
                  <img
                    src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${property.path}`}
                    alt={property.name}
                    className="w-full h-72 object-cover rounded-lg mb-4"
                  />

                  <p>
                    <strong>Name:</strong> {property.name}
                  </p>
                  <p>
                    <strong>Location:</strong> {property.location}
                  </p>
                  <p>
                    <strong>Specific Location:</strong>{" "}
                    {property.specific_location}
                  </p>
                  <p>
                    <strong>Price Range:</strong>{" "}
                    {`₱${property.price_range
                      .split(" - ")
                      .map((price) => parseInt(price).toLocaleString("en-PH"))
                      .join(" - ₱")}`}
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
                </div>

                <div className="w-full md:w-1/2">
                  <h2 className="text-3xl font-semibold text-customBlue mb-6 text-center">
                    {popupType === "Request Viewing"
                      ? "Schedule Appointment"
                      : "Submit Inquiry"}
                  </h2>
                  <form
                    className="grid gap-6 w-full"
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitForm();
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-customBlue">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full p-2 border border-cyan-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Your Name"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                      </div>
                      <div className="w-full">
                        <label className="block text-sm font-medium text-customBlue">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          onInput={(e) => {
                            const prevValue = e.target.value;
                            const newValue = prevValue.replace(/\D/g, ""); // Remove non-numeric input

                            if (prevValue !== newValue) {
                              setErrors({
                                ...errors,
                                phone: "Only numeric values are allowed",
                              });
                            } else {
                              const updatedErrors = { ...errors };
                              delete updatedErrors.phone;
                              setErrors(updatedErrors);
                            }

                            e.target.value = newValue; // Update input field with valid numbers only
                          }}
                          className="mt-1 block w-full p-2 border border-cyan-700 rounded-lg focus:ring-customBlue focus:border-blue-500 text-sm"
                          placeholder="Your Phone Number"
                        />

                        {errors.phone && (
                          <p className="text-red-500 text-sm">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-customBlue">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full p-2 border border-cyan-700 rounded-lg focus:ring-customBlue focus:border-blue-500 text-sm"
                          placeholder="Your Email"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                      </div>
                      {popupType === "Request Viewing" && (
                        <div className="w-full">
                          <label className="block text-sm font-medium text-customBlue">
                            Appointment Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-2 border border-cyan-700 rounded-lg focus:ring-customBlue focus:border-blue-500 text-sm"
                          />
                          {errors.appointmentDate && (
                            <p className="text-red-500 text-sm">
                              {errors.appointmentDate}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none h-32 w-full text-sm"
                        placeholder="Type your message here"
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full px-6 py-4 bg-customBlue text-white rounded-lg text-sm font-semibold hover:bg-cyan-700"
                    >
                      {popupType === "Request Viewing"
                        ? "Confirm Appointment"
                        : "Submit Inquiry"}
                    </button>
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
                <div key={index} className="relative">
                  {/* Loader/Placeholder */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg w-full sm:w-80 h-40 sm:h-60 lg:w-96 lg:h-72">
                      <div className="text-xl font-thin text-opacity-40 text-cyan-700 animate-pulse">
                        Λ L V E O
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${feature.image}`}
                    alt={feature.name}
                    className="rounded-lg w-80 h-40 object-cover transform transition-transform duration-300 ease-in-out"
                    onClick={() => handleImageClick(index)} // Click to enlarge
                  />

                  <p className="text-customBlue text-xl mt-2">{feature.name}</p>
                </div>
              ))}
            </div>
          )}

          {/* Enlarged Image Modal */}
          {isImageVisible !== null && (
            <div
              className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
              onClick={() => setIsImageVisible(null)} // Close the modal when clicked outside
            >
              <div className="relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_PORT}${parsedFeatures[isImageVisible].image}`}
                  alt={parsedFeatures[isImageVisible].name}
                  className="max-w-[80vw] max-h-[80vh] object-contain rounded-lg shadow-lg" // object-contain to avoid stretching
                />
                <button
                  onClick={() => setIsImageVisible(null)} // Close button
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 relative bg-cover bg-center">
          <div className="relative z-10">
            {/* Center the heading */}
            <h2 className="text-xl font-semibold text-center mb-4 text-customBlue">
              Facilities
            </h2>

            {facilities.length === 0 ? (
              <div className="flex items-center justify-center w-full">
                {/* Center the "No facilities available" message */}
                <p className="text-sm sm:text-lg text-white text-center">
                  No facilities available for this property.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center">
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="bg-white p-2 rounded-lg hover:shadow-lg transition-shadow duration-300 shadow-lg 
                 flex items-center justify-center h-auto" // ✅ Added flex, items-center, justify-center, and height
                  >
                    <h3 className="text-sm font-semibold text-gray-800 text-center mt-1">
                      {facility.name}
                    </h3>
                  </div>
                ))}
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

                    <div className="mb-4">
                      <h5 className="mb-0 font-bold text-cyan-700">
                        {building.lower_ground_floor_parking_levels || "N/A"}
                      </h5>
                      <span className="text-customBlue">
                        Lower Ground Parking
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
