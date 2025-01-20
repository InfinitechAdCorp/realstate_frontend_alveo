"use client";
import { useState, useEffect } from "react";
import Header from "./../header";
import Footer from "./../footer";
import { FaQuoteLeft } from "react-icons/fa6";
import Icon from "@/app/pages/socialmedia-icons/page";
export default function agent() {
  const [activeSection, setActiveSection] = useState("certificates");
  const [testimonialOptions, setTestimonialOptions] = useState([]);

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
  return (
    <>
      <Header /> <Icon />
      <div
        className="relative bg-cover bg-center h-screen flex justify-center items-center"
        style={{ backgroundImage: "url(/assets/Alveo.png)" }}
      >
        {/* Overlay */}
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
              <img
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
              />
            </div>
          )}

          {/* Gallery Section */}
          {activeSection === "gallery" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-6">
              <img
                src="/assets/agent/photo_2024-10-05_18-30-19.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-80 h-96 object-cover rounded-lg"
              />
              <img
                src="/assets/agent/photo_2024-10-05_18-30-22.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-80 h-96 object-cover rounded-lg"
              />
              <img
                src="/assets/agent/photo_2024-10-05_18-30-23.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-80 h-96 object-cover rounded-lg"
              />
              <img
                src="/assets/agent/photo_2024-10-05_18-30-24.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-80 h-96 object-cover rounded-lg"
              />
              <img
                src="/assets/agent/photo_2024-10-05_18-30-26.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-80 h-96 object-cover rounded-lg"
              />
              <img
                src="/assets/agent/photo_2024-10-05_18-30-27.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-80 h-96 object-cover rounded-lg"
              />
              <img
                src="/assets/agent/photo_2024-10-05_18-30-30.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-80 h-96 object-cover rounded-lg"
              />
              <img
                src="/assets/agent/photo_2024-10-05_18-30-31.jpg"
                alt="Ella Carmela Sarmiento"
                className="w-80 h-96 object-cover rounded-lg"
              />
            </div>
          )}
          {activeSection === "testimonial" && (
            <div className="text-center mt-6">
              {testimonialOptions.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {testimonialOptions
                    .slice(0, testimonialOptions.length - 1)
                    .map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="max-w-xl mx-auto p-6 border-2 border-gray-300 mb-6"
                        style={{
                          backgroundColor: "#f9f9f9",
                          borderRadius: "15px",
                        }}
                      >
                        <div className="text-center mb-4">
                          <FaQuoteLeft className="w-16 h-16 text-customBlue mx-auto" />
                        </div>
                        <div
                          className="text-lg text-gray-700"
                          style={{
                            fontStyle: "italic",
                            marginBottom: "10px",
                            fontSize: "16px",
                          }}
                        >
                          <p>{testimonial.message}</p>
                        </div>
                        <div
                          className="text-xl font-semibold text-gray-900"
                          style={{ marginTop: "10px", fontSize: "18px" }}
                        >
                          - {testimonial.name}
                        </div>
                      </div>
                    ))}

                  {/* Last testimonial - render this if there's an odd number of testimonials */}
                  {testimonialOptions.length % 2 !== 0 && (
                    <div
                      key={testimonialOptions[testimonialOptions.length - 1].id}
                      className="max-w-xl mx-auto p-6 border-2 border-gray-300 mb-6 sm:col-span-2"
                      style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "15px",
                      }}
                    >
                      <div className="text-center mb-4">
                        <FaQuoteLeft className="w-16 h-16 text-customBlue mx-auto" />
                      </div>
                      <div
                        className="text-lg text-gray-700"
                        style={{
                          fontStyle: "italic",
                          marginBottom: "10px",
                          fontSize: "16px",
                        }}
                      >
                        <p>
                          {
                            testimonialOptions[testimonialOptions.length - 1]
                              .message
                          }
                        </p>
                      </div>
                      <div
                        className="text-xl font-semibold text-gray-900"
                        style={{ marginTop: "10px", fontSize: "18px" }}
                      >
                        -{" "}
                        {testimonialOptions[testimonialOptions.length - 1].name}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-14">
        <Footer />
      </div>
    </>
  );
}
