"use client"; // Add this line at the top
import { useRouter } from "next/router"; // Import useRouter for navigation
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image"; // Assuming you're using Next.js's Image component
import { throttle } from "lodash";
import { useSession, signIn, signOut } from "next-auth/react";

import SEO from "./../seo/page";
const Footer = () => {
  useEffect(() => {
    // Reload the page if it hasn't already been reloaded
    const hasReloaded = sessionStorage.getItem("footerPageReloaded");
    if (!hasReloaded) {
      sessionStorage.setItem("footerPageReloaded", "true"); // Set a flag to prevent infinite reloads
      window.location.reload();
    }
  }, []);
  const handleDownloadClick = () => {
    const apkUrl = "/apk/app-apk-6789d3658d6bf-1737085797.apk";
    const link = document.createElement("a");
    link.href = apkUrl;
    link.download = "AlveoLand.apk"; // Specify the desired file name
    document.body.appendChild(link); // Append to DOM
    link.click(); // Trigger download
    document.body.removeChild(link); // Remove from DOM
  };

  return (
    <>
      <SEO
        title="REAL ESTATE"
        description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
        keywords="alveo, real estate, luxury living, property, contacts, services, account"
        canonical="${process.env.NEXT_PUBLIC_LOCAL_PORT}"
      />
      <div
        className="text-center xl:-mt-14 2xl:mt-1 xl:z-50 text-white h-100 gap-5 
        lg:text-2xl xl:text-left xl:flex xl:flex-row xl:items-start pb-10"
        style={{ background: "#002B47" }}
      >
        <div className="xl:w-1/3 max-sm:-mt-3 sm:mt-5 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center text-center max-sm:mt-5 sm:pt-10">
            <h1 className="font-thin text-5xl">Λ L V E O</h1>
            <p className="font-thin text-xs tracking-wider mt-2">
              an AyalaLand Company
            </p>
          </div>
          <div className="mb-10 my-10">
            <button
              onClick={handleDownloadClick}
              className="bg-slate-100 text-customBlue text-lg py-1 px-4 rounded-full"
            >
              Download App
            </button>
          </div>
        </div>

        <div className="xl:w-1/3 xl:pl-8 xl:text-left xl:-ml-20 font-thin mx-10">
          <h1 className="xl:text-2xl xl:mt-10 text-3xl sm:text-3xl lg:text-2xl text-start font-thin">
            Contact Us:
          </h1>
          <p className="xl:text-sm text-sm sm:text-sm lg:text-sm text-start">
            Our dedicated teams are ready to assist you with needed information
            on Alveo Land properties, wherever you are.
          </p>

          <h1 className="xl:text-2xl xl:mt-10 text-3xl sm:text-3xl lg:text-2xl text-start font-thin">
            Customer Hotline:
          </h1>
          <p className="xl:text-sm text-sm sm:text-sm lg:text-sm text-start">
            (+632) 8848 5000
          </p>
          <h1 className="xl:text-2xl xl:mt-10 text-3xl sm:text-3xl lg:text-2xl text-start font-thin">
            Email:
          </h1>
          <p className="xl:text-sm text-sm sm:text-sm lg:text-sm text-start">
            info@alveoland.com.ph
          </p>
        </div>

        <div className="xl:w-1/3 xl:pl-8 xl:text-left xl:-ml-20 font-thin mx-10">
          <h1 className="xl:text-2xl xl:mt-10 text-3xl sm:text-3xl lg:text-2xl text-start font-thin">
            Location:
          </h1>
          <a
            href="https://maps.app.goo.gl/D46bpCPXfhXgdQEcA"
            target="_blank"
            className="no-underline text-white hover:text-blue-500"
          >
            <p className="xl:text-sm text-sm sm:text-sm lg:text-sm text-start">
              Alveo Corporate Center 728 28th Street, Bonifacio Global City 1634
              Taguig City, Metro Manila Philippines
            </p>
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
