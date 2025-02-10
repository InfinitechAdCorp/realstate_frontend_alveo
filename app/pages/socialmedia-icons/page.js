"use client";
import React, { useState } from "react";
import { IoCall } from "react-icons/io5";
import { motion } from "framer-motion";

const SocialMediaFloating = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const toggleSlider = () => {
    setIsSliderOpen((prev) => !prev);
  };

  return (
    <div className="fixed top-36 right-1 z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleSlider}
        className="bg-white border-3 border-blue-600 text-white p-2 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all"
      >
        <img
          src="/assets/socialmedia/contact-mail.png"
          alt="Support"
          className="w-7 h-7"
        />
      </button>

      {/* Overlay (conditionally rendered) */}
      {isSliderOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsSliderOpen(false)}
        />
      )}

      {/* Social Media Slider */}
      <motion.div
        className={`fixed top-[135px] right-[45px] w-auto h-16 bg-transparent shadow-lg z-50 ${
          isSliderOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        initial={{ translateX: "100%", opacity: 0 }}
        animate={{
          translateX: isSliderOpen ? "0%" : "100%",
          opacity: isSliderOpen ? 1 : 0,
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="p-3 flex items-center space-x-4 bg-transparent shadow-md">
          {/* Social Media Links */}
          <a href="https://www.facebook.com/AlveoLand/" target="_blank">
            <img
              className="w-10 h-10 transition-transform transform hover:scale-110"
              src="/assets/socialmedia/facebook.png"
              alt="Facebook"
            />
          </a>

          <a href="https://t.me/+6309175480999" target="_blank">
            <img
              className="w-10 h-10 transition-transform transform hover:scale-110"
              src="/assets/socialmedia/telegram.png"
              alt="Telegram"
            />
          </a>

          <a
            href="https://api.whatsapp.com/send/?phone=639175480999&text&type=phone_number&app_absent=0"
            target="_blank"
          >
            <img
              className="w-10 h-10 transition-transform transform hover:scale-110"
              src="/assets/socialmedia/whatsapp.png"
              alt="WhatsApp"
            />
          </a>

          <a href="https://www.viber.com/en/" target="_blank">
            <img
              className="w-10 h-10 transition-transform transform hover:scale-110"
              src="/assets/socialmedia/viber.png"
              alt="Viber"
            />
          </a>

          <a href="tel:+63288485000" target="_blank">
            <IoCall className="w-10 h-10 transition-transform transform hover:scale-110 text-white bg-blue-500 rounded-full p-2" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default SocialMediaFloating;
