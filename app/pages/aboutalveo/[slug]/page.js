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
import Icon from "@/app/pages/socialmedia-icons/page";
import Header from "../../header";
import Footer from "./../../footer";
import { showToast } from "@/components/alert/page";
import FloatingFeatures from "@/app/pages/floatingfeatures/page";
export default function BlogPost({ params }) {
  const { slug } = params; // Extract slug from params
  const [isAccessible, setIsAccessible] = useState(true);

  const handleShowWarningToast = (message) => {
    showToast(message, "warning"); // Warning toast
  };
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
          canonical="${process.env.NEXT_PUBLIC_LOCAL_PORT}"
        />
        <Header /> <Icon />
        <Directory
          currentLocation={post.currentLocation}
          specificLocation={post.specificLocation}
        />{" "}
        <FloatingFeatures
          isAccessible={isAccessible}
          handleShowWarningToast={handleShowWarningToast}
        />
        {slug === "aboutalveo" && post.path && (
          <div className="directory-wrapper lg:h-3/4 xl:h-/4 ">
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
                  <p>
                    Your browser does not support HTML5 video. Here's a
                    description of the content: {post.title}.
                  </p>
                </video>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-customBlue"></div>
              </div>
              <div className="absolute top-1/3 mt-3 left-5 w-4/5 z-10 text-white text-sm mx-1  sm:mx-10 sm:ml-20 md:top-96 lg:mt-64 lg:top-96 lg:ml-10">
                <div className="flex space-x-4 h-36 lg:mt-10 lg:top-64 lg:ml-10 xl:-mt-16 xl:ml-40 max-sm:-mt-32 md:-mt-20 ">
                  {headings.map((heading, idx) => (
                    <h1
                      key={idx}
                      className={`${
                        index === idx
                          ? "opacity-100 transform translate-y-0 transition-transform duration-1000 ease-out"
                          : "opacity-0 transform translate-y-5 font-thin"
                      } w-full text-sm sm:text-2xl md:text-3xl lg:text-4xl font-thin`}
                    >
                      {heading}
                    </h1>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mt-5 h-auto sm:h-32 p-2 text-black lg:mt-20 xl:mt-12 pb-3">
              <table className="w-full sm:w-11/12 mx-auto xl:mx-28">
                <tbody>
                  <tr>
                    <td className="font-thin text-xl bg-customBlue border border-white text-white py-2 px-4 md:text-4xl lg:text-3xl">
                      LIVE WELL WITH ALVEO
                    </td>
                    <td className="font-thin text-customBlue py-2 px-4 border-none text-justify indent-5 md:text-2xl lg:text-md">
                      Carrying the legacy of Ayala Land, the largest and most
                      experienced real estate developer in the Philippines,
                      Alveo offers a remarkable portfolio of prime real estate
                      developments within thriving and emerging growth centers
                      around the country.
                      <p className="mt-3">
                        Armed with sharper foresight, unparalleled excellence,
                        and total commitment, the company provides
                        thoughtfully-designed, master planned environments for
                        living and working well in the Philippines.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className="relative mt-20 w-full sm:w-11/12 mx-auto sm:mx-10 bg-cover bg-center bg-customBlue bg-opacity-100 mt-30"
              style={{ backgroundImage: "url('/assets/dashboard/about.jpg')" }}
            >
              <div className="absolute inset-0 bg-customBlue bg-opacity-90"></div>

              <div className="container mx-auto mb-10 px-4 sm:px-6 lg:px-10 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between gap-x-32 ">
                  {/* Left Column */}
                  <div className="w-full sm:w-1/2 pt-10">
                    <h1 className="font-thin text-left text-4xl text-white border-t-2 border-l-4 border-white pl-4 pb-10">
                      OUR FOUNDATION
                    </h1>
                    <p className="mt-4 font-light text-slate-100 text-sm sm:text-xl md:text-2xl text-justify">
                      With more than 35 years of experience in enhancing land
                      and enriching lives, Ayala Land, the most trusted property
                      developer in the Philippines and one of the country’s most
                      important nation-builders, expands its portfolio to
                      address evolving needs of a future-forward market.
                    </p>
                  </div>

                  {/* Right Column */}
                  <div className="w-full sm:w-1/2 pt-10">
                    <h1 className="font-thin text-left text-4xl text-white border-t-2 border-l-4 border-white pl-4">
                      CONTEMPORARY ENVIRONMENTS FOR HOME, WORK, AND LEISURE
                    </h1>
                    <p className="mt-4 font-light text-slate-100 text-sm sm:text-xl md:text-2xl text-justify">
                      Alveo Land’s extensive range of holistic developments
                      offer fresh lifestyle and workstyle concepts that
                      cultivate vibrant centers of vitality all across the
                      country. Going where the growth is, Alveo expands its
                      footprint and diversifies its locations all over the
                      Philippines to provide an enhanced quality of life.
                    </p>
                    <p className="mt-4 font-light text-slate-100 text-sm sm:text-xl md:text-2xl text-justify mb-20">
                      Building with the future on its sightlines, Alveo
                      continues to make meaningful breakthroughs and act
                      responsibly with focus, all while being in touch with the
                      needs of the present.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-auto relative mt-10 justify-center p-6 bg-gradient-to-b from-white via-customBlue/10 to-white">
              <div className="container mx-auto">
                <h1 className="text-4xl text-center mb-12 font-thin text-customBlue">
                  AWARDS AND RECOGNITION
                </h1>
                <div className="flex justify-center gap-10">
                  {/* Accordion for Awards */}
                  <Accordion type="single" collapsible className="w-full">
                    {awardsData.map((item) => (
                      <AccordionItem
                        key={item.year}
                        value={`item-${item.year}`}
                      >
                        <AccordionTrigger className="py-4 px-6 text-lg font-semibold text-customBlue border-b-2 border-customBlue">
                          {item.year}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
                            {item.awards.map((award, index) => (
                              <div
                                key={index}
                                className="p-8 border-b-2 border-b-customBlue"
                              >
                                <div className="font-semibold text-2xl mb-4 text-customBlue ">
                                  {award.title}
                                </div>
                                <div className="text-md text-gray-700 ">
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
            <div className="mt-20">
              <Footer />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
