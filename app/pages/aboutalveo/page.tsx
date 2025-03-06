"use client"; 

import Image from "next/image";
import Directory from "../pathDirectory";
import SEO from "../../seo/page";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Icon from "@/app/pages/socialmedia-icons/page";
import Header from "../header";
import { showToast } from "@/components/alert/page";

export default function AboutAlveo() {
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
          title: "Asia Pacific Property Awards",
          description:
            "The Lattice at Parklinks: Best Residential High-Rise Development – Philippines",
        },
        {
          title: "Titan Property Awards ",
          description: "Portico: Mixed-use Development",
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
      ],
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % headings.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [headings.length]);

  return (
    <>
      <SEO
        title="REAL ESTATE"
        description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle."
        keywords="alveo, real estate, property, lands, investment, loan, buildings"
        canonical={`${process.env.NEXT_PUBLIC_LOCAL_PORT}/about`}
      />

      <Directory currentLocation="ABOUT ALVEO" specificLocation="" />

      {/* Hero Section with Video */}
<div>
              <div className="relative">
                <video
                  src="https://media-hosting.imagekit.io//65923e66b0c14f34/vi2.mp4?Expires=1831509873&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=uhnF9H631jYx7R~b9dN1gJ4bAXHsAqU9uVsbU0efep2bz4JSeIMjdXeOu~dcudagaYtrpUtyWy-xwnJLN28Ss-p1fRwcput-RfhByWfHWhxJzo7V65ABdGIjPaiGseuRd8RYB15qkdV9urhBtn3yBC-f6fBDm7hXRA651~VdJvCQlHo6tqjMdxw8luSMAsof6Y74P57ilFtuOBrr-hasWjBrptycOwUazqT9XASgzTATu-GOFXCNxdFCCtx-0K~FjIjUoI2n9bvyOdsAdHGgUPFn-VKLvmitHT5Fq9peGzaEY92Xz446~vVvatD28Kbtk-kB4nuIJ9zx6auohTKTWg__"
                  className="object-cover w-full h-1/2 xl:h-96"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
           
                </video>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-customBlue"></div>
              </div>
              <div className="absolute top-0 -mt-20 left-5 w-3/5 text-white text-left text-sm mx-1 sm:mx-10 md:top-96 lg:mt-80 lg:top-72 h-36  overflow-hidden">
                {headings.map((heading, idx) => (
                  <h1
                    key={idx}
                    className={`absolute left-0 top-0 w-full h-full ${
                      index === idx
                        ? "opacity-100 transform translate-y-0 transition-transform duration-1000 ease-out"
                        : "opacity-0 transform translate-y-5"
                    } text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold`}
                  >
                    {heading}
                  </h1>
                ))}
              </div>
            </div>

      {/* Content Section */}
      <div className="relative mt-8 h-auto p-4 text-black lg:mt-20 xl:mt-12">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <table className="w-full sm:w-11/12 mx-auto xl:mx-28">
            <tbody>
              <tr>
                <td className="font-semibold text-lg sm:text-xl bg-customBlue text-white py-4 px-6 text-center">
                  LIVE WELL WITH ALVEO
                </td>
              </tr>
              <tr>
                <td className="font-light text-customBlue py-4 px-6 sm:text-lg lg:text-md text-justify leading-relaxed indent-14">
                  Carrying the legacy of Ayala Land, the largest and most experienced real estate developer in the Philippines,
                  Alveo offers a remarkable portfolio of prime real estate developments within thriving and emerging growth centers
                  around the country. Armed with sharper foresight, unparalleled excellence, and total commitment, the company
                  provides thoughtfully-designed, master-planned environments for living and working well in the Philippines.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Our Foundation Section */}
      <div
        className="relative mt-20 w-full sm:w-11/12 mx-auto sm:mx-10 bg-cover bg-center bg-customBlue bg-opacity-100 mt-30"
        style={{ backgroundImage: "url('/assets/dashboard/about.jpg')" }}
      >
        <div className="absolute inset-0 bg-customBlue bg-opacity-90"></div>

        <div className="container mx-auto mb-10 px-4 sm:px-6 lg:px-10 relative">
          <div className="flex flex-col sm:flex-row justify-between gap-x-32">
            {/* Left Column */}
            <div className="w-full sm:w-1/2 pt-10">
              <h1 className="font-thin text-left text-4xl text-white border-t-2 border-l-4 border-white pl-4 pb-10">
                OUR FOUNDATION
              </h1>
              <p className="mt-4 font-light text-slate-100 text-sm sm:text-xl md:text-2xl text-justify">
                With more than 35 years of experience in enhancing land and enriching lives, Ayala Land, the most trusted property
                developer in the Philippines, expands its portfolio to address evolving needs of a future-forward market.
              </p>
            </div>

            {/* Right Column */}
            <div className="w-full sm:w-1/2 pt-10">
              <h1 className="font-thin text-left text-4xl text-white border-t-2 border-l-4 border-white pl-4">
                CONTEMPORARY ENVIRONMENTS FOR HOME, WORK, AND LEISURE
              </h1>
              <p className="mt-4 font-light text-slate-100 text-sm sm:text-xl md:text-2xl text-justify">
                Alveo Land’s extensive range of holistic developments offer fresh lifestyle and workstyle concepts that cultivate vibrant centers
                of vitality all across the country.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Awards Section */}
      <div className="h-auto relative mt-10 justify-center p-6 bg-gradient-to-b from-white via-customBlue/10 to-white">
        <div className="container mx-auto">
          <h1 className="text-4xl text-center mb-12 font-thin text-customBlue">
            AWARDS AND RECOGNITION
          </h1>
          <div className="flex justify-center gap-10">
            <Accordion type="single" collapsible className="w-full">
              {awardsData.map((item) => (
                <AccordionItem key={item.year} value={`item-${item.year}`}>
                  <AccordionTrigger className="py-4 px-6 text-lg font-semibold text-customBlue border-b-2 border-customBlue">
                    {item.year}
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.awards.map((award, index) => (
                      <div key={index} className="p-8 border-b-2 border-b-customBlue">
                        <div className="font-semibold text-2xl mb-4 text-customBlue">
                          {award.title}
                        </div>
                        <div className="text-md text-gray-700">
                          {award.description}
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}
