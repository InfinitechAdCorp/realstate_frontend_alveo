"use client";
import { useState, useEffect } from "react";
import Header from "./../header";
import Footer from "./../footer";
import { FaQuoteLeft } from "react-icons/fa6";
import Icon from "@/app/pages/socialmedia-icons/page";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
export default function agent() {
  const [activeSection, setActiveSection] = useState("certificates");
  const [testimonialOptions, setTestimonialOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [testimonialName, setTestimonialName] = useState(""); // State for testimonial name
  const [testimonialMessage, setTestimonialMessage] = useState(""); // State for testimonial message

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(testimonialOptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTestimonials = testimonialOptions.slice(startIndex, startIndex + itemsPerPage);

  const galleryImage = [
    "photo_2024-10-05_18-30-19.jpg",
    "photo_2024-10-05_18-30-22.jpg",
    "photo_2024-10-05_18-30-23.jpg",
    "photo_2024-10-05_18-30-24.jpg",
    "photo_2024-10-05_18-30-26.jpg",
    "photo_2024-10-05_18-30-27.jpg",
    "photo_2024-10-05_18-30-30.jpg",
    "photo_2024-10-05_18-30-31.jpg",
  ];

  useEffect(() => {
    const fetchTestimonials = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/testimonials_user`
      );
      const data = await response.json();
      setTestimonialOptions(data);
    };

    fetchTestimonials();
  }, []);
  const handleAdd = async () => {
    if (testimonialName.trim() !== "" && testimonialMessage.trim() !== "") {
      const newTestimonialItem = {
        name: testimonialName,
        message: testimonialMessage,
      };

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/testimonials_user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTestimonialItem),
          }
        );

        const addedTestimonial = await response.json();
        setTestimonialOptions([...testimonialOptions, addedTestimonial]);
        setTestimonialName(""); // Reset name field
        setTestimonialMessage(""); // Reset message field

        handleShowSuccessToast("Testimonial added successfully!");
        setIsModalOpen(false); // Close modal after submission
      } catch (err) {
        setError("Failed to add testimonial.");
      }
    }
  };
  return (
    <div>
      <div
        className="relative bg-cover bg-center min-h-screen flex flex-col justify-center items-center"
        style={{ backgroundImage: "url(/assets/Alveo.png)" }}
      >
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center p-6 z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-10 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 border-2 border-black rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                Add Testimonial
              </h3>

              <input
                type="text"
                placeholder="Name"
                value={testimonialName}
                onChange={(e) => setTestimonialName(e.target.value)}
                className="border border-gray-400 rounded-lg p-2 w-full mb-3 focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Message"
                value={testimonialMessage}
                onChange={(e) => setTestimonialMessage(e.target.value)}
                className="border border-gray-400 rounded-lg p-2 w-full h-32 mb-3 focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleAdd}
                  className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-customBlue opacity-80 z-0"></div>
        {/* Content Container */}
        <div className="relative w-full max-w-4xl bg-opacity-80 p-8 z-0">
          <div className="flex flex-col md:flex-row w-full max-w-4xl bg-opacity-80 p-8">
            {/* Left Column: Image */}
            <div className="flex-1 pr-0 md:pr-5 mb-6 md:mb-0">
              <img
                src="/assets/agent/ella.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Right Column: Text */}
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Ella Carmela Sarmiento
              </h2>
              <p className="text-xl md:text-2xl font-semibold text-white uppercase tracking-wide">
                Property Specialist
              </p>
              <p className="text-base md:text-lg text-white leading-relaxed font-light max-w-3xl mx-auto opacity-80">
                As a dedicated property seller with extensive experience in the
                real estate market, I take pride in being recognized as one of
                DMCI Homes’ Top 5 Property Consultants in the JB Division. My
                commitment to providing exceptional service and delivering
                results has been the cornerstone of my success.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center h-36 space-x-6 z-50 max-sm:mt-20">
        <button
          onClick={() => setActiveSection("certificates")}
          className={`px-6 w-36 py-3 border-2 text-black font-thin hover:bg-customBlue hover:text-white transition duration-300 ease-in-out ${
            activeSection === "certificates" ? "bg-customBlue text-white" : ""
          }`}
        >
          Certificates
        </button>
        <button
          onClick={() => setActiveSection("gallery")}
          className={`px-6 py-3 w-36 border-2 text-black font-thin hover:bg-customBlue hover:text-white transition duration-300 ease-in-out ${
            activeSection === "gallery" ? "bg-customBlue text-white" : ""
          }`}
        >
          Gallery
        </button>
        <button
          onClick={() => setActiveSection("testimonial")}
          className={`px-6 py-3 w-36 border-2 text-black font-thin hover:bg-customBlue hover:text-white transition duration-300 ease-in-out ${
            activeSection === "testimonial" ? "bg-customBlue text-white" : ""
          }`}
        >
          Testimonial
        </button>
      </div>
      <div className="flex justify-center items-center ">
        <div className="w-full max-w-6xl p-4">
          {/* Certificates Section */}
          {activeSection === "certificates" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-6">
              {/* <img
                src="/assets/agent/credentials1.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-4/4 h-4/4 object-cover rounded-lg"
              />
              <img
                src="/assets/agent/credentials2.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-4/4 h-4/4 object-cover rounded-lg"
              />
              <img
                src="/assets/agent/credentials1.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-4/4 h-4/4 object-cover rounded-lg"
              />
              <img
                src="/assets/agent/credentials2.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-4/4 h-4/4 object-cover rounded-lg"
              /> */}
               <PhotoProvider>
                <PhotoView src="/assets/agent/credentials1.jpg">
                  <img
                    src="/assets/agent/credentials1.jpg"
                    alt="Ella Carmela Sarmiento"
                    className="w-4/4 h-4/4 object-cover rounded-lg cursor-pointer"
                  />
                </PhotoView>
                <PhotoView src="/assets/agent/credentials2.jpg">
                  <img
                    src="/assets/agent/credentials2.jpg"
                    alt="Ella Carmela Sarmiento"
                    className="w-4/4 h-4/4 object-cover rounded-lg cursor-pointer"
                  />
                </PhotoView>
                <PhotoView src="/assets/agent/credentials1.jpg">
                  <img
                    src="/assets/agent/credentials1.jpg"
                    alt="Ella Carmela Sarmiento"
                    className="w-4/4 h-4/4 object-cover rounded-lg cursor-pointer"
                   />
                </PhotoView>
                <PhotoView   src="/assets/agent/credentials2.jpg">
                  <img
                    src="/assets/agent/credentials2.jpg"
                    alt="Ella Carmela Sarmiento"
                    className="w-4/4 h-4/4 object-cover rounded-lg cursor-pointer"
                  />
                </PhotoView>
              </PhotoProvider>
            </div>
          )}

          {/* Gallery Section */}
          {activeSection === "gallery" && (
            <PhotoProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-6">
              {galleryImage.map((image, index) => (
                <PhotoView key={index} src={`/assets/agent/${image}`}>
                  <img
                    src={`/assets/agent/${image}`}
                    alt="Ella Carmela Sarmiento"
                    className="w-80 h-96 object-cover rounded-lg cursor-pointer"
                  />
                </PhotoView>
              ))}
            </div>
          </PhotoProvider>
          )}
          {activeSection === "testimonial" && (
              <div className="text-center">
              <div
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition w-40 mx-auto my-5"
              >
                Add Testimonial
              </div>
        
              {testimonialOptions.length > 0 && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {currentTestimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="max-h-[400px] max-w-xl mx-auto p-6 border-2 border-gray-300 mb-6 overflow-auto"
                        style={{ backgroundColor: "#f9f9f9", borderRadius: "15px" }}
                      >
                        <div className="text-center mb-4">
                          <FaQuoteLeft className="w-16 h-16 text-customBlue mx-auto" />
                        </div>
                        <div className="text-lg text-gray-700 italic mb-2">
                          <p>{testimonial.message}</p>
                        </div>
                        <div className="text-xl font-semibold text-gray-900 mt-2">
                          - {testimonial.name}
                        </div>
                      </div>
                    ))}
                  </div>
        
                  {/* Pagination Controls */}
                  <div className="flex justify-center mt-4 space-x-2">
                    <button
                      className={`px-4 py-2 border rounded-lg ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 border rounded-lg">Page {currentPage} of {totalPages}</span>
                    <button
                      className={`px-4 py-2 border rounded-lg ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
