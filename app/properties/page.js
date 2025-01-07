"use client";

import { columns } from "./property";
import { DataTable } from "./data-table";
import { useState, useEffect } from "react";

const fetchProperties = async () => {
  // Assuming you have this function defined elsewhere
  try {
    const response = await fetch("https://infinitech-testing1.online/api/admin/properties"); // Fetch properties API
    const data = await response.json();
    return data; // Return fetched properties
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array in case of an error
  }
};

export default function DemoPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchProperties(); // Fetch data from API
      setData(result); // Set the fetched data in state
    };

    fetchData(); // Call the fetchData function to fetch data on component mount
  }, []);
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
