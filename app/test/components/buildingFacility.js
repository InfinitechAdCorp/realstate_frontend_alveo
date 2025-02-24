import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";

const FacilitiesTable = ({ properties, loading }) => {
  const [facilities, setFacilities] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  // If the properties are passed as props (from the parent), we don't need to fetch data
  if (properties) {
    console.log("Properties passed down from parent:", properties);
    return (
      <DataTable
        title="Facilities"
        columns={[
          {
            name: "Facility Name",
            selector: (row) => row.name,
            sortable: true,
          },
          {
            name: "Created At",
            selector: (row) => row.created_at,
            sortable: true,
          },
          {
            name: "Facility ID",
            selector: (row) => row.id,
            sortable: true,
          },
        ]}
        data={properties}
        progressPending={loading}
      />
    );
  }

  // If properties are not passed, fetch data locally
  useEffect(() => {
    const fetchFacilities = async () => {
      setFetching(true);
      const token = localStorage.getItem("auth_token");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/facilities`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch facilities");
        }

        const data = await response.json();

        console.log("Fetched Facilities Data:", data); // Log fetched data

        // Format the date
        const formattedData = data.map((facility) => ({
          ...facility,
          created_at: new Date(facility.created_at).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          ),
        }));

        setFacilities(formattedData); // Set fetched data to state
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setFetching(false); // Set fetching to false when data is fetched
      }
    };

    fetchFacilities();
  }, []); // Only run on mount

  if (fetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (facilities.length === 0) {
    return <div>No facilities available.</div>;
  }

  return (
    <DataTable
      title="Facilities"
      columns={[
        {
          name: "Facility Name",
          selector: (row) => row.name,
          sortable: true,
        },
        {
          name: "Created At",
          selector: (row) => row.created_at,
          sortable: true,
        },
        {
          name: "Facility ID",
          selector: (row) => row.id,
          sortable: true,
        },
      ]}
      data={facilities}
      progressPending={fetching}
    />
  );
};

export default FacilitiesTable;
