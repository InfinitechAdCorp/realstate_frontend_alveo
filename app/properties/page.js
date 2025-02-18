import { columns } from "./property";
import { DataTable } from "./data-table";
import { useState, useEffect } from "react";

const fetchProperties = async () => {
  // Get the token from localStorage
  const token = localStorage.getItem("auth_token");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/properties`,
      {
        method: "GET", // Ensure the correct HTTP method (GET)
        headers: {
          Authorization: `Bearer ${token}`, // Add the Authorization header with Bearer token
          "Content-Type": "application/json", // Optionally set the content type if needed
        },
      }
    );

    const data = await response.json();
    return data; // Return fetched properties
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array in case of an error
  }
};

const formatPriceRange = (priceRange) => {
  const [minPrice, maxPrice] = priceRange.split(" - ");
  return `₱${Number(minPrice).toLocaleString()} - ₱${Number(
    maxPrice
  ).toLocaleString()}`;
};

export default function DemoPage(datas) {
  const [data, setData] = useState([]); // State to hold fetched data
  const newData = datas.data; // Access the passed prop `datas.data`

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchProperties();
      console.log("Fetched data:", result);
      // Format the price range for each property
      const formattedData = result.map((property) => ({
        ...property,
        price_range: formatPriceRange(property.price_range),
      }));
      setData(formattedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Datas prop has changed:", newData);
    const fetchData = async () => {
      const result = await fetchProperties();
      console.log("Fetched data for newData change:", result);
      // Format the price range for each property
      const formattedData = result.map((property) => ({
        ...property,
        price_range: formatPriceRange(property.price_range),
      }));
      setData(formattedData);
    };

    fetchData();
  }, [newData]);

  return (
    <div>
      <DataTable columns={columns} data={data} newData={newData} />
    </div>
  );
}
