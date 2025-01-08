"use client"
import React from 'react';

const SocialMediaFloating = () => {
  return (
   <div className="social-media-icons fixed top-1/2 right-0 transform -translate-y-1/2 flex flex-col items-center space-y-3">
  {/* Facebook */}
  <a href="https://www.facebook.com/AlveoLand/" target="_blank">
    <img
      className="w-12 h-12 transition-transform transform hover:scale-110 "
      src="/assets/socialmedia/facebook.png"
      alt="Facebook"
    />
  </a>

  {/* Telegram */}
  <a href="https://t.me/+6309175480999" target="_blank">
    <img
      className="w-12 h-12 mt-3 transition-transform transform hover:scale-110"
      src="/assets/socialmedia/telegram.png"
      alt="Telegram"
    />
  </a>

  {/* WhatsApp */}
  <a
    href="https://api.whatsapp.com/send/?phone=639175480999&text&type=phone_number&app_absent=0"
    target="_blank"
  >
    <img
      className="w-12 h-12 mt-3 transition-transform transform hover:scale-110"
      src="/assets/socialmedia/whatsapp.png"
      alt="WhatsApp"
    />
  </a>

  {/* Viber */}
  <a href="https://www.viber.com/en/" target="_blank">
    <img
      className="w-12 h-12 mt-3 transition-transform transform hover:scale-110"
      src="/assets/socialmedia/viber.png"
      alt="Viber"
    />
  </a>
</div>

  );
};

export default SocialMediaFloating;
