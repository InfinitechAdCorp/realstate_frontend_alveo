"use client"; // Add this line at the top
import { useRouter } from "next/router"; // Import useRouter for navigation
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import SEO from "./../seo/page";

const Footer = () => {
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("footerPageReloaded");
    if (!hasReloaded) {
      sessionStorage.setItem("footerPageReloaded", "true");
      window.location.reload();
    }
  }, []);

  const handleDownloadClick = () => {
    const apkUrl = "/apk/app-apk-6789d3658d6bf-1737085797.apk";
    const link = document.createElement("a");
    link.href = apkUrl;
    link.download = "AlveoLand.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <footer className="bg-customBlue text-white px-4 xl:px-1 w-full justify-center ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Left Column */}
        <div className="col-span-1 flex justify-center lg:justify-end md:justify-center md:mx-auto md:w-full">
          <div className="flex flex-col justify-center items-center py-4 lg:mr-20 ">
            <h2 className="text-5xl sm:text-7xl md:text-5xl xl:text-5xl font-semibold text-center">
              Λ L V E O
            </h2>
            <p className="text-lg sm:text-sm mt-2 text-center opacity-80">
              An AyalaLand Company
            </p>
            <button
              onClick={() => alert("Downloading App...")}
              className="bg-slate-100 text-customBlue text-sm xl:text-base p-3 rounded-lg mt-4"
            >
              Download App
            </button>
          </div>
        </div>

        {/* Right Column (Contact Info) */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 h-auto text-center lg:text-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
            <div className="flex flex-col ">
              <h2 className="text-2xl xl:text-3xl font-thin">Contact Us</h2>
              <p className="text-xs xl:text-sm mt-2">
                Our dedicated teams are ready to assist you with information on
                Alveo Land properties.
              </p>
            </div>

            <div className="flex flex-col">
              <h2 className="text-2xl xl:text-3xl font-thin">Email</h2>
              <p className="text-xs xl:text-sm mt-2">
                <a
                  href="mailto:info@alveoland.com.ph"
                  className="text-white hover:text-blue-600 hover:underline"
                >
                  info@alveoland.com.ph
                </a>
              </p>
            </div>

            <div className="flex flex-col">
              <h2 className="text-2xl xl:text-3xl font-thin">
                Customer Hotline
              </h2>
              <p className="text-xs xl:text-sm mt-2">
                <a
                  href="tel:+63288485000"
                  className="text-white hover:text-blue-600 hover:underline"
                >
                  (+632) 8848 5000
                </a>
              </p>
            </div>

            <div className="flex flex-col">
              <h2 className="text-2xl xl:text-3xl font-thin">Location</h2>
              <a
                href="https://maps.app.goo.gl/dQRKwnAkHXiwc7hq8"
                target="_blank"
                className="no-underline text-white hover:text-blue-500"
              >
                <p className="text-xs xl:text-sm mt-2">
                  Alveo Corporate Center 728 28th Street, Bonifacio Global City
                  1634 Taguig City, Metro Manila Philippines
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <hr className="my-2 border-t-2 border-white w-4/5 mx-auto" />

      {/* Footer Section */}
      <div className="text-center text-white py-2">
        <p className="text-xs xl:text-sm">
          Copyright © 2024 All Rights Reserved by
          <a
            href="https://www.infinitechphil.com/about-us"
            className="text-white hover:text-blue-600 hover:underline"
          >
            {" "}
            Infinitech Advertising Corporation
          </a>{" "}
          |{" "}
          <a
            href="/pages/privacypolicy"
            className="text-white hover:text-blue-600 hover:underline"
          >
            {" "}
            Privacy Policy
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
