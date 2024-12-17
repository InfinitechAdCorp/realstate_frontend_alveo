"use client"; // Ensure this is at the top
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Directory from '../pathDirectory';
import Header from '../header';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Footer from './../footer'
import SEO from '../../seo/page'
const LocationPage = () => {
  const pathname = usePathname(); // Use the usePathname hook to access the current path
  const [currentLocation, setCurrentLocation] = useState('LOCATION');
  const [specificLocation, setSpecificLocation] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCurrentLocation(params.get('currentLocation') || 'LOCATION');
    setSpecificLocation(params.get('specificLocation') || '');
  }, []);

    const locations = [
        {
            location: "Caloocan City",
            key: "caloocancity",
            path: "/assets/Location/Location View/Caloocan City.png",
            title: "Thriving in the Heart of Heritage and Progress",
            intro: "This vibrant metropolis blends rich history with modern urban life. Known for its thriving business hubs and lively markets, it offers convenience for residents and visitors alike."
        },
        {
            location: "Las Pinas",
            key: "laspinas",
            path: "/assets/Location/Location View/Las Pinas.jpg",
            title: "Where Tradition Meets Tranquility: Life in Las Piñas",
            intro: "A unique blend of historical charm and peaceful suburban living awaits here. Famous for its iconic bamboo organ, it preserves cultural heritage while providing modern conveniences."
        },
        {
            location: "Makati City",
            key: "makaticity",
            path: "/assets/Location/Location View/Makati City.jpeg",
            title: "The Pulse of Progress: Life in Makati City",
            intro: "As the premier financial and commercial hub of the region, this city is known for its sleek skyline and vibrant lifestyle. It pulses with the energy of progress and sophistication."
        },
        {
            location: "Mandaluyong City",
            key: "mandaluyongcity",
            path: "/assets/Location/Location View/Mandaluyong.jpg",
            title: "The Crossroads of Commerce and Community: Life in Mandaluyong City",
            intro: "Here, the perfect balance between commercial vitality and community living is struck. Known as the 'Tiger City,' it offers a dynamic yet welcoming environment for all."
        },
        {
            location: "Manila",
            key: "manila",
            path: "/assets/Location/Location View/Manila.jpeg",
            title: "Where History and Modernity Converge: Life in Manila",
            intro: "This vibrant capital is where centuries of history blend seamlessly with modern urban life. From iconic landmarks to lively markets, it captivates with its depth and diversity."
        },
        {
            location: "Pasay City",
            key: "pasaycity",
            path: "/assets/Location/Location View/Pasay.png",
            title: "The Gateway to Leisure and Culture: Life in Pasay City",
            intro: "A gateway to leisure and culture, this area offers world-class entertainment venues and vibrant lifestyle hubs. With endless opportunities for recreation, it caters to both locals and tourists alike."
        },
        {
            location: "Pasig City",
            key: "pasigcity",
            path: "/assets/Location/Location View/Pasig City.png",
            title: "The Gateway to Leisure and Culture: Life in Pasig City",
            intro: "A gateway to leisure and culture, this area offers world-class entertainment venues and vibrant lifestyle hubs. With endless opportunities for recreation, it caters to both locals and tourists alike."
        },
        {
            location: "Paranaque City",
            key: "paranaquecity",
            path: "/assets/Location/Location View/Paranaque.jpg",
            title: "The Vibrant Blend of Culture and Commerce: Life in Parañaque City",
            intro: "This dynamic urban hub is where culture and commerce intersect. Renowned for its rich history and diverse communities, it boasts bustling markets and a lively nightlife scene."
        },
        {
            location: "Quezon City",
            key: "quezoncity",
            path: "/assets/Location/Location View/Quezon City.jpg",
            title: "The City of Innovation and Heritage: Life in Quezon City",
            intro: "A vibrant tapestry woven from rich history and modern innovation awaits you. With significant landmarks and a hub of education and culture, it offers diverse dining and entertainment options."
        },
        {
            location: "San Juan, Batangas",
            key: "batangascity",
            path: "/assets/Location/Location View/San Juan, Batangas.png",
            title: "The Charming Retreat of San Juan: Where Coastal Beauty Meets Community",
            intro: "This picturesque coastal town is renowned for its stunning beaches and rich cultural heritage. Often referred to as the 'Surfing Capital of the Philippines,' it attracts water sports enthusiasts and beach lovers alike."
        },
        {
            location: "Taguig City",
            key: "taguigcity",
            path: "/assets/Location/Location View/Taguig City.jpg",
            title: "The Modern Marvel of Taguig: A City of Innovation and Lifestyle",
            intro: "An emerging powerhouse in the region, this area is a testament to modern urban development and innovation. It offers a vibrant hub for business, upscale retail, and fine dining."
        },
        {
            location: "Tuba, Benguet",
            key: "benguet",
            path: "/assets/Location/Location View/Tuba Benguet.png",
            title: "The Mountain Oasis of Tuba: Nature’s Haven in Benguet",
            intro: "A serene mountain retreat awaits, offering breathtaking natural beauty and rich cultural heritage. Surrounded by lush pine forests, it is known for its stunning landscapes and vibrant flower farms."
        }
    ];
 const [expanded, setExpanded] = useState({});

    const toggleReadMore = (key) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
         <> 
          <SEO
  title="REAL ESTATE"
  description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
  keywords="alveo, real estate, luxury living, property, condominiums, luxury homes, investment, residential properties,sale, property location, location"
  canonical="http://localhost:3000/pages/location"
/>
            <Header />

         <div className="xl:ml-64">
            <Directory currentLocation="LOCATION" specificLocation={``} />
     
         </div>
      
         
    <div className="locations-container text-center mb-0">
  <h1 className="text-2xl -mt-10 mb-8 md:text-4xl md:-mt-2 sm:text-4xl lg:mt-5 lg:text-5xl xl:text-4xl">OUR LOCATIONS</h1>
  <div className="container mx-auto">
    <div className="flex flex-wrap -mx-2">
      {locations.map(({ location, key, path, title, intro }) => (
        <div className="w-full md:w-1/3 px-2 mb-8" key={key}>
          <div className="bg-white shadow-md rounded-md overflow-hidden flex flex-col h-full">
            <img
              src={path}
              alt={location}
              className="w-full object-cover h-48 md:h-56 lg:h-64"
            />
            <div className="p-4 flex flex-col justify-between flex-grow">
              <div>
                <h5 className="text-lg font-semibold">{title}</h5>
                <p className="text-base">
                  {expanded[key] ? intro : `${intro.substring(0, 100)}...`}
                </p>
              </div>
              <Link
                href={`/pages/locations/${key}`}
                className="mt-4 text-blue-500 hover:text-blue-700"
              >
                {expanded[key] ? 'Read Less' : 'Read More'} &rarr;
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  <div className="text-left xl:mt-10">
    <Footer />
  </div>
</div>

    

        </>
    );
};

export default LocationPage;