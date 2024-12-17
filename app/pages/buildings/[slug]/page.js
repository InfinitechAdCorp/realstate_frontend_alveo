"use client"; // If you're using client-side components
import { useEffect, useState } from "react";
import Image from "next/image";
import Directory from "../../pathDirectory";
import Header from "../../header";
import Footer from "./../../footer";
import SEO from "./../../../seo/page"
export default function BlogPost({ params }) {
  const { slug } = params; // Extract slug from params
  const [property, setProperty] = useState(null); // State to hold property data
  const [loading, setLoading] = useState(true); // State for loading
  const [facilities, setFacilities] = useState([]);
  const [buildings, setBuildings] = useState([]);
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/property/id/${slug}`
        ); // Use the new endpoint for fetching by ID
        const data = await res.json();

        if (res.ok) {
          setProperty(data);
  
          await fetchFacilities(slug);
          await fetchBuildings(slug);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFacilities = async (propertyId) => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/facilities/id/${propertyId}`
        ); // Fetch facilities
        const data = await res.json();

        if (res.ok) {
          setFacilities(data);

        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };

    const fetchBuildings = async (propertyId) => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/buildings/id/${propertyId}`
        ); // Fetch buildings
        const data = await res.json();

        if (res.ok) {
          setBuildings(data); // Ensure you're setting buildings, not facilities

        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching buildings:", error);
      }
    };

    fetchProperty();
  }, [slug]);
  const parseFeatures = (features) => {
    try {
      return JSON.parse(features);
    } catch (error) {
      console.error("Error parsing features:", error);
      return [];
    }
  };

  if (loading) return <div></div>;

  if (!property) return <div>Property not found</div>;
  const parsedFeatures = parseFeatures(property.features);
  return (
    <>
     <SEO
  title="REAL ESTATE"
  description="Discover contemporary homes in vibrant neighborhoods designed to match your lifestyle. From chic urban apartments to serene suburban retreats, we offer the perfect setting for your next chapter.."
  keywords="alveo, real estate, luxury property, property features, building information, property information, building features, condominium features"
  canonical="http://localhost:3000"
/>
      <Header />
      <div className=" p-4 md:p-8 mt-2 w-full mb-20">
        <h1 className="text-2xl font-bold mb-4 text-center">{property.name}</h1>
        <div className="grid gap-4 lg:flex justify-center items-center text-center w-full 2xl:w-8/12 mx-auto">
          <img
            src={
              property.path.startsWith("http://localhost:8000/storage/")
                ? property.path
                : `http://localhost:8000/assets/Location/${encodeURIComponent(
                    property.path.replace("assets/Location/", "")
                  )}`
            }
            alt={property.name}
            className="w-full max-h-96 h-auto xl:max-h-72 mx-auto mb-4 rounded-lg shadow-md"
          />
          <img
            src={
              property.view.startsWith("http://localhost:8000/storage/")
                ? property.view
                : `http://localhost:8000/assets/Location/${encodeURIComponent(
                    property.view.replace("assets/Location/", "")
                  )}`
            }
            alt={property.name}
            className="w-full max-h-96 h-auto xl:max-h-72 mx-auto mb-4 rounded-lg shadow-md"
          />
        </div>

        <div className="property-info mb-4">
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <p>
            <strong>Location:</strong> {property.location}
          </p>
          <p>
            <strong>Price Range:</strong> {property.price_range}
          </p>
          <p>
            <strong>Status:</strong> {property.status}
          </p>
          <p>
            <strong>Development Type:</strong> {property.development_type}
          </p>
          <p>
            <strong>Units:</strong> {property.units}
          </p>
          <p>
            <strong>Specific Location:</strong> {property.specific_location}
          </p>
        </div>

        <div className="features mb-4">
          <h2 className="text-xl font-semibold mb-2">Features</h2>
          {parsedFeatures.length === 0 ? (
            <p>No features available for this property.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 text-center">
              {parsedFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="border rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                  <h4>{feature.name}</h4>
                  <img
                    src={
                      feature.image.startsWith("http://localhost:8000/storage/")
                        ? feature.image
                        : `http://localhost:8000/assets/Location/${encodeURIComponent(
                            feature.image
                              .replace(/\\/g, "/")
                              .replace("assets/Location/", "")
                          )}`
                    }
                    alt={feature.name}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="facilities mb-4 p-2 bg-gray-100 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-center mb-4">Facilities</h2>
          <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 text-center justify-center -ml-9">
            {facilities.map((facility) => (
              <li
                key={facility.id}
                className="bg-white p-4 rounded-lg shadow hover:-translate-y-1 transition "
              >
                <span className="text-lg text-gray-700">{facility.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-xl font-semibold mt-4 mb-4 text-center justify-center sm:text-4xl">
          Buildings
        </h2>
        <div className="buildings grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {buildings.length === 0 ? (
            <p>No buildings available for this property.</p>
          ) : (
            buildings.map((building) => (
              <div
                key={building.id}
                className="flex flex-col items-center p-6 rounded-lg bg-gray-100 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-center mb-6">
                  {building.name}
                </h3>
                <img
                  src={
                    building.path.startsWith("http://localhost:8000/storage/")
                      ? building.path
                      : `http://localhost:8000/assets/Location/${encodeURIComponent(
                          building.path.replace("assets/Location/", "")
                        )}`
                  }
                  alt={building.name}
                  className="w-full h-60 rounded-lg mb-6"
                />
                <div className="text-base">
                  <p>
                    <strong>Residential Levels:</strong>{" "}
                    {building.residential_levels}
                  </p>
                  <p>
                    <strong>Basement Parking Levels:</strong>{" "}
                    {building.basement_parking_levels}
                  </p>
                  <p>
                    <strong>Podium Parking Levels:</strong>{" "}
                    {building.podium_parking_levels || "N/A"}
                  </p>
                  <p>
                    <strong>Commercial Units:</strong>{" "}
                    {building.commercial_units || "N/A"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
