"use client"; // app/blog/[slug]/page.js
import Image from "next/image";
import Directory from "../../pathDirectory";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Hook for navigation
import Header from "../../header";
import Footer from "./../../footer";
import SEO from "./../../../seo/page"
import Link from 'next/link';
export default function BlogPost({ params }) {
  const router = useRouter(); // Correct usage inside a component

  const { slug } = params; // Extract slug from params
  const [data, fetchData] = useState(null);
  const [propertyData, setPropertyData] = useState([]);
  // You can use the slug to fetch data or conditionally render content
  const posts = {
    caloocancity: {
      location: "Caloocan City",
      key: "caloocancity",
      path: "/assets/Location/Location View/Caloocan City.png",
      title: "Thriving in the Heart of Heritage and Progress",
      intro:
        "This vibrant metropolis blends rich history with modern urban life. Known for its thriving business hubs and lively markets, it offers convenience for residents and visitors alike.",
    },
    laspinas: {
      location: "Las Pinas",
      key: "laspinas",
      path: "/assets/Location/Location View/Las Pinas.jpg",
      title: "Where Tradition Meets Tranquility: Life in Las Piñas",
      intro:
        "A unique blend of historical charm and peaceful suburban living awaits here. Famous for its iconic bamboo organ, it preserves cultural heritage while providing modern conveniences.",
    },
    makaticity: {
      location: "Makati City",
      key: "makaticity",
      path: "/assets/Location/Location View/Makati City.jpeg",
      title: "The Pulse of Progress: Life in Makati City",
      intro:
        "As the premier financial and commercial hub of the region, this city is known for its sleek skyline and vibrant lifestyle. It pulses with the energy of progress and sophistication.",
    },
    mandaluyongcity: {
      location: "Mandaluyong City",
      key: "mandaluyongcity",
      path: "/assets/Location/Location View/Mandaluyong.jpg",
      title:
        "The Crossroads of Commerce and Community: Life in Mandaluyong City",
      intro:
        "Here, the perfect balance between commercial vitality and community living is struck. Known as the 'Tiger City,' it offers a dynamic yet welcoming environment for all.",
    },
    manila: {
      location: "Manila",
      key: "manila",
      path: "/assets/Location/Location View/Manila.jpeg",
      title: "Where History and Modernity Converge: Life in Manila",
      intro:
        "This vibrant capital is where centuries of history blend seamlessly with modern urban life. From iconic landmarks to lively markets, it captivates with its depth and diversity.",
    },
    pasaycity: {
      location: "Pasay City",
      key: "pasaycity",
      path: "/assets/Location/Location View/Pasay.png",
      title: "The Gateway to Leisure and Culture: Life in Pasay City",
      intro:
        "A gateway to leisure and culture, this area offers world-class entertainment venues and vibrant lifestyle hubs. With endless opportunities for recreation, it caters to both locals and tourists alike.",
    },
    pasigcity: {
      location: "Pasig City",
      key: "pasigcity",
      path: "/assets/Location/Location View/Pasig City.png",
      title: "The Gateway to Leisure and Culture: Life in Pasay City",
      intro:
        "A gateway to leisure and culture, this area offers world-class entertainment venues and vibrant lifestyle hubs. With endless opportunities for recreation, it caters to both locals and tourists alike.",
    },
    paranaquecity: {
      location: "Paranaque City",
      key: "paranaquecity",
      path: "/assets/Location/Location View/Paranaque.jpg",
      title:
        "The Vibrant Blend of Culture and Commerce: Life in Parañaque City",
      intro:
        "This dynamic urban hub is where culture and commerce intersect. Renowned for its rich history and diverse communities, it boasts bustling markets and a lively nightlife scene.",
    },
    quezoncity: {
      location: "Quezon City",
      key: "quezoncity",
      path: "/assets/Location/Location View/Quezon City.jpg",
      title: "The City of Innovation and Heritage: Life in Quezon City",
      intro:
        "A vibrant tapestry woven from rich history and modern innovation awaits you. With significant landmarks and a hub of education and culture, it offers diverse dining and entertainment options.",
    },
    batangascity: {
      location: "San Juan, Batangas",
      key: "batangascity",
      path: "/assets/Location/Location View/San Juan, Batangas.png",
      title:
        "The Charming Retreat of San Juan: Where Coastal Beauty Meets Community",
      intro:
        "This picturesque coastal town is renowned for its stunning beaches and rich cultural heritage. Often referred to as the 'Surfing Capital of the Philippines,' it attracts water sports enthusiasts and beach lovers alike.",
    },
    taguigcity: {
      location: "Taguig City",
      key: "taguigcity",
      path: "/assets/Location/Location View/Taguig City.jpg",
      title: "The Modern Marvel of Taguig: A City of Innovation and Lifestyle",
      intro:
        "An emerging powerhouse in the region, this area is a testament to modern urban development and innovation. It offers a vibrant hub for business, upscale retail, and fine dining.",
    },
    benguet: {
      location: "Tuba, Benguet",
      key: "benguet",
      path: "/assets/Location/Location View/Tuba Benguet.png",
      title: "The Mountain Oasis of Tuba: Nature’s Haven in Benguet",
      intro:
        "A serene mountain retreat awaits, offering breathtaking natural beauty and rich cultural heritage. Surrounded by lush pine forests, it is known for its stunning landscapes and vibrant flower farms.",
    },
  };


  const post = posts[slug] || {
    title: "Post Not Found",
    content: "This post does not exist.",
  };
  const PropertyCard = ({ property, onClick }) => {
    return (
      <div
        className="flex w-80 flex-col bg-gray-100 rounded-lg shadow-lg  mx-auto lg:w-2/3 xl:w-3/12 overflow-hidden text-center transform transition-transform duration-300 ease-in-out  m-2 hover:translate-y-3 hover:shadow-xl"
      
      >
         <SEO
  title="REAL ESTATE"
  description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
  keywords="alveo, real estate, location, property, building location, property location"
  canonical="http://localhost:3000/pages/locations"
/>
        <Image
          src={`/${property.path}`}
          alt={property.name}
          width={400} // Adjusted width
          height={300} // Adjusted height
          className="w-full h-60 object-cover" // Set a fixed height for the image
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 lg:text-4xl xl:text-3xl">
            {property.name}
          </h2>
          <p className="text-lg text-orange-600 mb-2 lg:text-2xl xl:text-xl">
            <strong>Price Range:</strong> {property.price_range}
          </p>
          <p className="text-md text-gray-600 mb-2 lg:text-2xl xl:text-xl">
            <strong>Status:</strong> {property.status}
          </p>
          <p className="text-md text-gray-600 lg:text-2xl xl:text-xl">
            <strong>Location:</strong> {property.specific_location}
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchApi = async () => {
      try {
  
        const response = await fetch(`http://localhost:8000/api/blog/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog post data");
        }
        const fetchedData = await response.json();
        setPropertyData(fetchedData);
      } catch (err) {
  
      }
    };
    fetchApi(); // Call the fetch function
  }, [slug]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Directory
            currentLocation="LOCATION"
            specificLocation={`  ${post.location.toUpperCase()}`}
          />

          <div className="w-full h-full">
            <div className="relative mt-1 w-full">
              <Image
                src={post.path}
                alt={post.location}
                width={2000}
                height={500}
                className="w-full h-40 object-cover sm:h-60 md:h-80 lg:h-96 xl:h-72"
                priority
              />

              <div className="left-0 right-0 h-28 lg:h-40 bg-blue-900 flex flex-col justify-center p-2 text-white w-screen">
                <div className="-mt-10 left-0 right-0 h-1/5 bg-blue-900 flex flex-col justify-center p-2 text-white">
                  <p className="mt-6 text-sm font-bold sm:text-lg md:text-2xl lg:text-4xl xl:text-2xl">
                    Premium Lots for Sale in {post.location}
                  </p>
                  <p className="-mt-4 text-sm font-bold sm:text-lg md:text-2xl lg:text-4xl xl:text-3xl">
                    {post.title}
                  </p>
                </div>
              </div>

              <div className="sm:-mt-3 md:-mt-5 -mt-10 border-black border-2 lg:h-48 xl:h-28 xl:-mt-10 2xl:h-16 bg-white text-justify text-black flex justify-center left-10 h-28 w-3/3 mx-2 text-lg p-2">
                <p className="text-sm indent-10 sm:text-lg sm:p-2 md:text-xl lg:text-3xl lg:p-5 xl:text-xl 2xl:p-1">
                  {post.intro}
                </p>
              </div>

              <div className="relative text-center sm:px-10 md:mx-5 justify-center">
                <h1 className="text-2xl font-bold justify-center mt-10 -mb-5 sm:text-4xl lg:text-5xl xl:text-3xl">
                  FEATURED PROPERTIES
                </h1>
           <div className=" justify-start items-start gap-1 mt-5 w-full mb-20 ">
                {propertyData.map((property) => (
                  <Link key={property.id} href={`/pages/buildings/${property.id}`}passHref className="no-underline">
                
                      <PropertyCard
                        property={property}
                      />
                  </Link>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
