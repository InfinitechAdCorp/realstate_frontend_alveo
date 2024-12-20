"use client"
import { useState } from "react";
import Header from './../header'
import Footer from './../footer'
export default function agent() {
   const [activeSection, setActiveSection] = useState("certificates");
   const testimonial = [ 
    {id:1,name:'Maria Santos',message:'I had an excellent experience working with ella. She demonstrated extensive knowledge of the real estate market and was attentive to my needs. Her dedication and professionalism made the entire process smooth and enjoyable. Thanks to Ella, I found my dream home without any hassle. I highly recommend her for anyone looking to buy or sell a property!'},
      {id:2,name:'James Rodriguez',message:'Working with Ella was an absolute pleasure! Her expertise in the real estate industry is unparalleled, and she guided me through every step of the process. Her responsiveness and attention to detail made me feel supported, and I truly felt she had my best interests at heart. Thanks to Ella, I sold my property quickly and at a great price. I can’t recommend her enough!'},
        {id:3,name:'Sarah Thompson',message:'Ella made my home buying experience enjoyable and stress-free. Her attention to detail and proactive approach ensured that I found the perfect home that met all my requirements. I felt supported throughout the entire process. I highly recommend her services to anyone looking for a dedicated and knowledgeable real estate agent!'},
          {id:4,name:'David Chen',message:'I was impressed by Ella professionalism and expertise. She took the time to understand my needs and provided excellent advice throughout the selling process. Thanks to her hard work, my property sold above asking price! I couldn’t have done it without her.'},
{id:5,name:'Angela White',message:'Ella dedication to her clients is truly commendable. She helped me navigate the complicated process of buying my first home with ease. Her responsiveness and market knowledge were invaluable. I highly recommend her to anyone in need of a trustworthy real estate agent!'},
   ]
  return (
 <>
 <Header/>
<div 
      className="bg-cover bg-center h-screen flex justify-center items-center "
      style={{ backgroundImage: 'url(/assets/seller-background.png)' }}
    >
      <div className="flex w-full max-w-4xl bg-opacity-80 p-8 rounded-lg shadow-xl">
    {/* Left Column: Image */}
    <div className="flex-1 pr-5">
      <img
        src="/assets/agent/ella.jpg"
        alt="Ella Carmela Sarmiento"
        className="w-full h-auto rounded-lg"
      />
    </div>

    {/* Right Column: Text */}
<div className="flex-1 flex flex-col justify-center items-center text-center ">
  <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
    Ella Carmela Sarmiento
  </h2>
  <p className="text-2xl font-semibold text-white uppercase tracking-wide">
    Property Specialist
  </p>
  <p className="text-lg text-white leading-relaxed font-light max-w-3xl mx-auto opacity-80">
    As a dedicated property seller with extensive experience in the real estate market, I take pride in being recognized as one of DMCI Homes’ Top 5 Property Consultants in the JB Division. My commitment to providing exceptional service and delivering results has been the cornerstone of my success.
  </p>
</div>

  </div>
    </div>

   <div className="flex justify-center items-center h-36 space-x-6">
        <button
          onClick={() => setActiveSection("certificates")}
          className="px-6 w-36 py-3 border-2 text-black font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Certificates
        </button>
        <button
          onClick={() => setActiveSection("gallery")}
          className="px-6 py-3 w-36 border-2 text-black font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
        >
          Gallery
        </button>
        <button
          onClick={() => setActiveSection("testimonial")}
          className="px-6 py-3 w-36 border-2 text-black font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
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
{activeSection === 'testimonial' && (
  <div className="text-center mt-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {testimonial.slice(0, testimonial.length - 1).map((testimonial, index) => (
        <div
          key={testimonial.id}
          className="max-w-xl mx-auto p-6 border-2 border-gray-300 rounded-lg shadow-lg mb-6"
          style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '15px',
          }}
        >
          <div className="text-center mb-4">
            <img
              src="/assets/agent/text.png"
              alt={testimonial.name}
              className="w-16 h-16 object-cover rounded-full mx-auto"
            />
          </div>
          <div
            className="text-lg text-gray-700"
            style={{
              fontStyle: 'italic',
              marginBottom: '10px',
              fontSize: '16px',
            }}
          >
            <p>{testimonial.message}</p>
          </div>
          <div
            className="text-xl font-semibold text-gray-900"
            style={{
              marginTop: '10px',
              fontSize: '18px',
            }}
          >
            - {testimonial.name}
          </div>
        </div>
      ))}
      {/* Last testimonial - only render this if there's an odd number of testimonials */}
      {testimonial.length % 2 !== 0 && (
        <div
          key={testimonial[testimonial.length - 1].id}
          className="max-w-xl mx-auto p-6 border-2 border-gray-300 rounded-lg shadow-lg mb-6 sm:col-span-2"
          style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '15px',
          }}
        >
          <div className="text-center mb-4">
            <img
              src="/assets/agent/text.png"
              alt={testimonial[testimonial.length - 1].name}
              className="w-16 h-16 object-cover rounded-full mx-auto"
            />
          </div>
          <div
            className="text-lg text-gray-700"
            style={{
              fontStyle: 'italic',
              marginBottom: '10px',
              fontSize: '16px',
            }}
          >
            <p>{testimonial[testimonial.length - 1].message}</p>
          </div>
          <div
            className="text-xl font-semibold text-gray-900"
            style={{
              marginTop: '10px',
              fontSize: '18px',
            }}
          >
            - {testimonial[testimonial.length - 1].name}
          </div>
        </div>
      )}
    </div>
  </div>
)}



    
  </div>
</div>


<div className="">
<Footer />
</div>

 </>
  );
}
  