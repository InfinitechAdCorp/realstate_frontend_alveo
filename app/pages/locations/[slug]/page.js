"use client";
import Image from "next/image";
import Directory from "../../pathDirectory";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Hook for navigation
import Header from "../../header";
import Footer from "./../../footer";
import SEO from "./../../../seo/page";
import Icon from "@/app/pages/socialmedia-icons/page";
export default function BlogPost({ params }) {
  const router = useRouter(); // Correct usage inside a component
  const { slug } = params; // Extract slug from params
  const [posts, setPosts] = useState({});
  const [propertyData, setPropertyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const handleImageLoad = () => {
    setIsLoading(false); // Stop showing the loader once the image is loaded
  };

  const handleImageError = () => {
    setIsLoading(false); // Stop the loader even if the image fails to load
  };
  // Fetch locations dynamically and set posts object
  useEffect(() => {
    console.log(params.slug); // Check if params.slug is correct
    // Fetch data from the backend API using template literal for params
    fetch(`${process.env.NEXT_PUBLIC_SERVER_PORT}/api/areas/${params.slug}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((response) => {
        console.log("Fetched data:", response.data); // Log the fetched data

        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const fetchedPosts = {};

          // Assuming the first item in the array is the relevant data
          const location = response.data[0];
          const key = location.area_name;

          fetchedPosts[key] = {
            location: location.area_name,
            key: key,
            path: location.image, // Image path from the API
            title: location.title,
            intro: location.description,
          };

          setPosts(fetchedPosts); // Set the transformed data to state
        } else {
          console.error("No data available in the response");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [params]); // Add `params` as a dependency to refetch when params change

  const post = posts[slug] || {
    title: "Post Not Found",
    intro: "This post does not exist.",
    image: "/assets/default.jpg",
    location: "Unknown",
  };

  const PropertyCard = ({ property, onClick }) => {
    return (
      <div
        className="flex w-80 h-full flex-col bg-gray-100 mx-auto lg:w-3/3 xl:w-full 
      overflow-hidden text-center relative"
      >
        {/* Loader */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="text-5xl font-thin text-opacity-40 text-cyan-700 animate-pulse">
              Λ L V E O
            </div>
          </div>
        )}

        {/* Image */}
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVER_PORT}/${property.path}`}
          alt={property.name}
          width={500} // Adjusted width
          height={800} // Adjusted height
          className="w-full h-[250px] object-cover" // Fixed height for the image
          onLoad={handleImageLoad} // Stop the loader when the image is loaded
          // onError={handleImageError} // Stop the loader even if the image fails
        />

        {/* Content */}
        <div className="p-4 flex flex-col justify-between h-full">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 lg:text-xl xl:text-lg">
            {property.name}
          </h2>
          <p className="text-sm text-gray-600 mb-1 lg:text-base xl:text-sm">
            <strong>Price Range:</strong>{" "}
            {`PHP ${new Intl.NumberFormat("en-PH").format(
              property.price_range.split(" - ")[0]
            )} - PHP ${new Intl.NumberFormat("en-PH").format(
              property.price_range.split(" - ")[1]
            )}`}
          </p>

          <p className="text-sm text-gray-600 mb-1 lg:text-base xl:text-sm">
            <strong>Status:</strong> {property.status}
          </p>
          <p className="text-sm text-gray-600 lg:text-base xl:text-sm">
            <strong>Location:</strong> {property.specific_location}
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/blog/${slug}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch blog post data");
        }
        const fetchedData = await response.json();
        console.log(fetchedData);

        // If fetchedData is an object (single property), wrap it in an array
        if (Array.isArray(fetchedData) && fetchedData.length > 0) {
          setPropertyData(fetchedData); // Directly set the array if it's an array
        } else if (
          fetchedData &&
          typeof fetchedData === "object" &&
          !Array.isArray(fetchedData)
        ) {
          setPropertyData([fetchedData]); // Wrap in array if it's a single object
        } else {
          console.error(
            "Fetched data is not the expected format:",
            fetchedData
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchApi();
  }, [slug]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header /> <Icon />
        <div className="flex-grow">
          <div className="w-full h-full">
            {Object.values(posts).map((post) => (
              <div key={post.key} className="relative mt-1 w-full">
                <Directory
                  currentLocation="LOCATION"
                  specificLocation={`${post.location}`}
                />

                {/* Image */}
                <img
                  src={`${process.env.NEXT_PUBLIC_LOCAL_PORT}${post.path}`} // Try to load from localhost:3000
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop if image fails
                    e.target.src = `${process.env.NEXT_PUBLIC_SERVER_PORT}${post.path}`; // Fallback to localhost:8000 if not found
                  }}
                  alt={post.location}
                  width={2000}
                  height={500}
                  className="w-full object-cover sm:h-60 md:h-80 lg:h-96 xl:h-72"
                  priority
                />

                {/* Title and Subtitle */}
                <div className="bg-customBlue flex flex-col justify-center p-4 sm:p-2 text-white w-full h-24 sm:h-28 lg:h-40">
                  <div className="flex flex-col justify-center p-2">
                    <p className="text-lg sm:text-2xl font-thin mt-4 sm:mt-6">
                      Premium Lots for Sale in {post.location}
                    </p>
                    <p className="text-sm sm:text-lg font-thin mt-2 sm:mt-4">
                      {post.title}
                    </p>
                  </div>
                </div>

                {/* Description Section */}
                <div className="relative border border-black font-thin text-customBlue bg-white text-justify flex justify-center items-center p-4 sm:p-6 mx-4 sm:mx-2 text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-lg">
                  <p className="indent-6 sm:indent-10">{post.intro}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Properties Section */}
          <div className="relative text-center sm:px-10 md:mx-5 justify-center">
            <h1 className="font-thin text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-customBlue border-t-2 w-fit mx-auto border-customBlue whitespace-nowrap mt-4">
              PROPERTIES
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 mt-5 w-full mb-20">
              {propertyData.map((property) => (
                <a
                  key={property.id}
                  href={`/pages/buildings/${property.id}`}
                  className="no-underline"
                >
                  <div className="w-full">
                    <PropertyCard property={property} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
