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
    <>
      <SEO
        title="REAL ESTATE"
        description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle."
        keywords="alveo, real estate, luxury living, property, contacts, services, account"
        canonical="${process.env.NEXT_PUBLIC_LOCAL_PORT}"
      />
      <div
        className="bg-customBlue text-white py-2 px-4 xl:px-12"
        style={{ background: "#002B47" }}
      >
        <div className="max-w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-8 text-center lg:text-left ">
          {/* Contact Us Section */}
          <div className="flex flex-col lg:items-start py-4">
            <h2 className="text-2xl xl:text-3xl font-thin">Contact Us:</h2>
            <p className="text-xs xl:text-sm mt-2 text-start">
              Our dedicated teams are ready to assist you with information on
              Alveo Land properties.
            </p>
          </div>

          {/* Customer Hotline Section */}
          <div className="flex flex-col items-center lg:items-start py-4">
            <h2 className="text-2xl xl:text-3xl font-thin">
              Customer Hotline:
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

          {/* Email Section */}
          <div className="flex flex-col items-center lg:items-start py-4">
            <h2 className="text-2xl xl:text-3xl font-thin">Email:</h2>
            <p className="text-xs xl:text-sm mt-2">
              <a
                href="mailto:info@alveoland.com.ph"
                className="text-white hover:text-blue-600 hover:underline"
              >
                info@alveoland.com.ph
              </a>
            </p>
          </div>

          {/* Location Section */}
          <div className="flex flex-col items-center lg:items-start py-4">
            <h2 className="text-2xl xl:text-3xl font-thin">Location:</h2>
            <a
              href="https://maps.app.goo.gl/dQRKwnAkHXiwc7hq8"
              target="_blank"
              className="no-underline text-white hover:text-blue-500"
            >
              <p className="text-xs xl:text-sm mt-2 text-start">
                Alveo Corporate Center 728 28th Street, Bonifacio Global City
                1634 Taguig City, Metro Manila Philippines
              </p>
            </a>
          </div>
        </div>

        <hr className="my-1 border-t-2 border-white w-4/5 mx-auto" />

        <div className="text-center text-white py-4">
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

          <div className="flex justify-center items-center space-x-4 mt-4">
            <button
              onClick={handleDownloadClick}
              className="bg-slate-100 text-customBlue text-sm xl:text-base py-2 px-6 rounded-full"
            >
              Download App
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
