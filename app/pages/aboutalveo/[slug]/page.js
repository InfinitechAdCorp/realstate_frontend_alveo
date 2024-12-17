"use client"; // app/blog/[slug]/page.js
import Image from 'next/image';
import Directory from "../../pathDirectory";
import SEO from "../../../seo/page"
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import Header from '../../header';
import Footer from './../../footer'
export default function BlogPost({ params }) {
    const { slug } = params; // Extract slug from params
const headings = [
        "ALL ACROSS THE PHILIPPINES",
        "MASTERPLANNED DEVELOPMENTS",
        "DYNAMIC COMMUNITIES"
    ];
const accordionData = [
  {
    value: "item-1",
    trigger: "AWARDS AND RECOGNITION",
    content: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    value: "item-2",
    trigger: "2024",
    content: "The Accordion is a UI component that allows users to hide or reveal content.",
  },
  {
    value: "item-3",
    trigger: "2023",
    content: "It saves space and makes information easier to digest by organizing content.",
  },
  {
    value: "item-4",
    trigger: "2022",
    content: "Details about events and achievements in 2022.",
  },
  {
    value: "item-5",
    trigger: "2021",
    content: "Details about events and achievements in 2021.",
  },
];

    const posts = {
        aboutalveo: {
            title: "ABOUT ALVEO",
            path: "/assets/alveoland.jpg",
            path1:"/assets/alveoland2.jpg",
            content: "ALVEOLAND",
            layout: <div>Your custom layout for ABOUT ALVEO</div>,
            currentLocation: 'ABOUT ALVEO',
            specificLocation: ''
        },
        commtalk: {
            title: "CommTalk Service",
            content: "Details about the CommTalk service.",
            layout: <div>Your custom layout for CommTalk</div>,
            currentLocation: 'ABOUT ALVEO',
            specificLocation: 'CommTalk'
        },
        contactus: {
            title: "Contact Us",
            content: "Reach out to us through our contact form.",
            layout: <div>Your custom layout for Contact Us</div>,
            currentLocation: 'ABOUT ALVEO',
            specificLocation: 'Contact Us'
        },
        jointeamalveo: {
            title: "Join Team Alveo",
            content: "Information on how to join Team Alveo.",
            layout: <div>Your custom layout for Join Team Alveo</div>,
            currentLocation: 'ABOUT ALVEO',
            specificLocation: 'JoinTeamAlveo'
        },
    };

    const post = posts[slug] || { title: "Post Not Found", content: "This post does not exist." };

    useEffect(() => {
        // Add any side-effects here if necessary
    }, [slug]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setIndex(prevIndex => (prevIndex + 1) % headings.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
}, [headings.length]);

    return (
       <div className="w-full ">
         <SEO
  title="REAL ESTATE"
  description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
  keywords="alveo, real estate, property, lands, investment, loan, buildings,"
  canonical="http://localhost:3000"
/>
        <Header/>
            <Directory currentLocation={post.currentLocation} specificLocation={post.specificLocation} />
{slug === 'aboutalveo' && post.path && (
  <div className="directory-wrapper lg:mt-5 lg:h-2/3  xl:h-2/4 xl:-mt-5">
    <div className="relative relative-wrapper ">
      <img 
        src={post.path}
        alt={post.title}
        width={800}
        height={300}
        className="img object-cover w-full h-1/2 xl:h-96"
      />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-transparent to-[#00008b] pointer-events-none" />
    </div>
<div className="absolute top-1/3 mt-3 left-5 w-4/5 z-10 text-white text-sm mx-1 sm:mx-10 sm:ml-20 md:top-96 lg:mt-64 lg:top-96 lg:ml-10  ">
  <div className="flex space-x-4 h-36 lg:mt-48 lg:top-64 lg:ml-10 xl:-mt-16 xl:ml-40">
    <h1
      className={`
        ${index === 0 ? 'opacity-100 transform translate-x-0 transition-all duration-1500' : 'opacity-0 transform translate-x-5'}
        w-full text-sm sm:text-2xl md:text-3xl lg:text-4xl
      `}
    >
      {headings[0]}
    </h1>
    <h1
      className={`
        ${index === 1 ? 'opacity-100 transform translate-x-0 transition-all duration-1500' : 'opacity-0 transform translate-x-5'}
        w-full text-sm sm:text-2xl md:text-3xl lg:text-4xl
      `}
    >
      {headings[1]}
    </h1>
    <h1
      className={`
        ${index === 2 ? 'opacity-100 transform translate-x-0 transition-all duration-1500' : 'opacity-0 transform translate-x-5'}
        w-full text-sm sm:text-2xl md:text-3xl lg:text-4xl
      `}
    >
      {headings[2]}
    </h1>
  </div>
</div>

 <div className="relative -mt-5 left-5 w-10/12 h-24 -z-50 mx-2 sm:w-11/12 ">
      <img 
        src={post.path1}
        alt={post.title}
        className="img w-full h-40 lg:h-64 xl:mx-5" 
      />
    </div>

    <div className="relative -mt-12 ml-10 w-4/5 h-36 text-white text-sm overflow-hidden z-10 pt-3 sm:text-lg lg:text-3xl lg:mx-20 xl:mt-2 xl:ml-32">
      <p className="indent-14 ">
        Every Alveo Land development nurtures individuals and hard-earned investments with a singular vision: giving you a place for living and working well.
      </p>
    </div>

   

    <div className="relative -mt-5 h-24 text-black lg:mt-16 xl:mt-1">
      <table className="w-96 sm:w-10/12 sm:mx-14 xl:mx-28 ">
        <tbody>
          <tr>
            <td className="font-bold text-xl bg-[#002B47] text-white py-2 px-4 md:text-4xl lg:text-5xl">LIVE WELL WITH ALVEO</td>
            <td className="text-base text-black py-2 px-4 border border-black text-justify indent-5 md:text-2xl lg:text-3xl">
              Carrying the legacy of Ayala Land, the largest and most experienced real estate developer in the Philippines, Alveo offers a remarkable portfolio of prime real estate developments within thriving and emerging growth centers around the country.
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-10 ml-0 w-11/12 justify-center text-center sm:mx-10">
        <h1 className="font-bold text-xl underline md:text-4xl">OUR FOUNDATION</h1>
        <p className="text-sm md:text-2xl">With more than 35 years of experience ...</p>
        <h1 className="font-bold text-xl underline mt-8 md:text-4xl">CONTEMPORARY ENVIRONMENTS FOR HOME, WORK, AND LEISURE</h1>
        <p className="text-sm md:text-2xl" >Alveo Lands extensive range of holistic developments...</p>
      </div>
    </div>
<div className="relative top-96 w-11/12  overflow-auto sm:mx-10 sm:-mt-14 max-sm:mb-96  md:mt-20 xl:-mt-10 xl:mb-20 lg:mb-96 md:mb-96 sm:mb-96 2xl:-mt-10 2xl:mb-0 2xl:h-2/4">
  <div className="accordion1 relative z-10 2xl:h-2/4">
    <div className="accordion2" style={{ width: '100%' }}>
      <Accordion type="single" collapsible>
        {accordionData.map((item) => (
          <AccordionItem className="accordion-item" key={item.value} value={item.value}>
            <AccordionTrigger className="accordion-trigger w-full md:text-2xl">
              <span>{item.trigger}</span>
            </AccordionTrigger>
            <AccordionContent className="accordion-content z-20 md:text-xl">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
</div>



  </div>
)}
<div className="bg-black xl:mt-96">
      <Footer />
    </div>

        </div>
        
    );
}
