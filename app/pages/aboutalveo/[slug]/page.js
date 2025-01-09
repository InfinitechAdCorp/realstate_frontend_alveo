"use client"; // app/blog/[slug]/page.js
import Image from "next/image";
import Directory from "../../pathDirectory";
import SEO from "../../../seo/page";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Header from "../../header";
import Footer from "./../../footer";

export default function BlogPost({ params }) {
  const { slug } = params; // Extract slug from params
  const headings = [
    "ALL ACROSS THE PHILIPPINES",
    "MASTERPLANNED DEVELOPMENTS",
    "DYNAMIC COMMUNITIES",
  ];
  const awardsData = [
    {
      year: 2023,
      awards: [
        {
          title: "Asia Pacific Property Awards test",
          description:
            "The Lattice at Parklinks: Best Residential High-Rise Development – Philippines",
        },
        {
          title: "Titan Property Awards ",
          description: "Portico: Mixed-use Development",
        },
        {
          title: "Titan Property Awards ",
          description: "Cerule at Solinea: Residential High-Rise",
        },
        {
          title: "Titan Property Awards ",
          description: "Property Content – Magazine (Commtalk) – PLATINUM",
        },
      ],
    },
    {
      year: 2022,
      awards: [
        {
          title: "International Business Awards",
          description: "Company of the Year – Real Estate Large (Silver)",
        },
        {
          title: "Global Banking & Finance Awards® ",
          description: "Real Estate Brand of the Year Philippines",
        },
        {
          title: "Titan Property Awards ",
          description:
            "Alveo Virtual Showroom: Interactive Brand Experience (Gold)",
        },
        {
          title: "International Business Magazine Awards  ",
          description: "Best Real Estate Company Philippines",
        },
        {
          title: "Asia Pacific Property Awards",
          description:
            "Tryne Enterprise Plaza: Best Office Development Philippines",
        },
      ],
    },
    {
      year: 2021,
      awards: [
        {
          title: "International Business Magazine Awards ",
          description: "Best Real Estate Company Philippines ",
        },
        {
          title: "Global Business Review Magazine Awards",
          description: "Best Real Estate Company Philippines",
        },
        {
          title: "World Economic Magazine Awards ",
          description: "Best Real Estate Company Philippines",
        },
        {
          title: "BUILDs Architecture Awards  ",
          description: "Best Office Buildings Development Company  Philippines",
        },
      ],
    },
  ];
  const posts = {
    aboutalveo: {
      title: "ABOUT ALVEO",
      path: "/assets/alveoland.jpg",
      path1: "/assets/alveoland2.jpg",
      content: "ALVEOLAND",
      layout: <div>Your custom layout for ABOUT ALVEO</div>,
      currentLocation: "ABOUT ALVEO",
      specificLocation: "",
    },
    commtalk: {
      title: "CommTalk Service",
      content: "Details about the CommTalk service.",
      layout: <div>Your custom layout for CommTalk</div>,
      currentLocation: "ABOUT ALVEO",
      specificLocation: "CommTalk",
    },
    contactus: {
      title: "Contact Us",
      content: "Reach out to us through our contact form.",
      layout: <div>Your custom layout for Contact Us</div>,
      currentLocation: "ABOUT ALVEO",
      specificLocation: "Contact Us",
    },
    jointeamalveo: {
      title: "Join Team Alveo",
      content: "Information on how to join Team Alveo.",
      layout: <div>Your custom layout for Join Team Alveo</div>,
      currentLocation: "ABOUT ALVEO",
      specificLocation: "JoinTeamAlveo",
    },
  };

  const post = posts[slug] || {
    title: "Post Not Found",
    content: "This post does not exist.",
  };

  useEffect(() => {
    // Add any side-effects here if necessary
  }, [slug]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % headings.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [headings.length]);

  return (
    <>
      <div className="w-full h-screen">
        <SEO
          title="REAL ESTATE"
          description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
          keywords="alveo, real estate, property, lands, investment, loan, buildings,"
          canonical="http://localhost:3000"
        />
        <Header />
        <Directory
          currentLocation={post.currentLocation}
          specificLocation={post.specificLocation}
        />
        {slug === "aboutalveo" && post.path && (
          <div className="directory-wrapper lg:h-2/3 xl:h-2/4">
            <div className="relative">
              <img
                src={post.path}
                alt={post.title}
                width={800}
                height={300}
                className="img object-cover w-full h-1/2 xl:h-96"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-transparent to-[#00008b] pointer-events-none" />
            </div>
            <div className="absolute top-1/3 mt-3 left-5 w-4/5 z-10 text-white text-sm mx-1 sm:mx-10 sm:ml-20 md:top-96 lg:mt-64 lg:top-96 lg:ml-10">
              <div className="flex space-x-4 h-36 lg:mt-48 lg:top-64 lg:ml-10 xl:-mt-16 xl:ml-40">
                {headings.map((heading, idx) => (
                  <h1
                    key={idx}
                    className={`${
                      index === idx
                        ? "opacity-100 transform translate-x-0 transition-all duration-1500"
                        : "opacity-0 transform translate-x-5"
                    } w-full text-sm sm:text-2xl md:text-3xl lg:text-4xl`}
                  >
                    {heading}
                  </h1>
                ))}
              </div>
            </div>

            <div className="relative mt-5 h-24 p-2 text-black lg:mt-20 xl:mt-12">
              <table className="w-full sm:w-10/12 sm:mx-14 xl:mx-28">
                <tbody>
                  <tr>
                    <td className="font-bold text-xl bg-[#002B47] text-white py-2 px-4 md:text-4xl lg:text-3xl">
                      LIVE WELL WITH ALVEO
                    </td>
                    <td className="text-base text-black py-2 px-4 border border-black text-justify indent-5 md:text-2xl lg:text-md">
                      Carrying the legacy of Ayala Land, the largest and most
                      experienced real estate developer in the Philippines,
                      Alveo offers a remarkable portfolio of prime real estate
                      developments within thriving and emerging growth centers
                      around the country.
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-10 ml-0 w-11/12 justify-center text-center sm:mx-10">
                {/* First Column */}
                <h1 className="font-semibold text-xl text-[#002B47] md:text-4xl">
                  OUR FOUNDATION
                </h1>
                <p className="text-sm md:text-2xl">
                  With more than 35 years of experience ...
                </p>
                {/* Second Column */}
                <h1 className="font-semibold mt-20 text-xl text-[#002B47] md:text-4xl">
                  CONTEMPORARY ENVIRONMENTS FOR HOME, WORK, AND LEISURE
                </h1>
                <p className="text-sm md:text-2xl">
                  Alveo Lands extensive range of holistic developments...
                </p>
              </div>
            </div>

            <div className="h-fit relative mt-96 justify-center p-4 ">
              <div className="container">
                <h1 className="text-3xl text-center">AWARDS AND RECOGNITION</h1>
                <div className="flex space-x-8 mt-8 justify-center">
                  {/* First Award */}
                  <Accordion type="single" collapsible className="w-full">
                    {awardsData.map((item) => (
                      <AccordionItem
                        key={item.year}
                        value={`item-${item.year}`}
                      >
                        <AccordionTrigger>{item.year}</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {item.awards.map((award, index) => (
                              <div
                                key={index}
                                className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                              >
                                {/* Title */}
                                <div className="font-semibold text-xl mb-3 text-gray-800">
                                  {award.title}
                                </div>
                                {/* Description */}
                                <div className="text-sm text-gray-600">
                                  {award.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
