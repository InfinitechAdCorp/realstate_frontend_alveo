"use client";

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

export default function DemoPage(datas) {
  const [data, setData] = useState([]); // State to hold fetched data
  const newData = datas.data; // Access the passed prop `datas.data`

  useEffect(() => {
    // This useEffect will run when the component mounts or when `datas` changes.
    const fetchData = async () => {
      const result = await fetchProperties(); // Fetch data from API
      setData(result); // Set the fetched data in state
    };

    fetchData(); // Call the fetchData function to fetch data on component mount
  }, []); // Empty dependency array ensures this only runs on mount

  // This useEffect will run when `newData` (from `datas`) changes
  useEffect(() => {
    console.log("Datas prop has changed:", newData);
    const fetchData = async () => {
      const result = await fetchProperties(); // Fetch data from API
      setData(result); // Set the fetched data in state
    };

    fetchData();
  }, [newData]); // Dependency array watches `newData` for changes

  return (
    <div>
      <DataTable columns={columns} data={data} newData={newData} />
    </div>
  );
}
