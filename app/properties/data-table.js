"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import React, { useState, useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const fetchProperties = async () => {
  // Assuming you have this function defined elsewhere
  try {
    const response = await fetch("http://localhost:8000/api/admin/properties"); // Fetch properties API
    const data = await response.json();
    return data; // Return fetched properties
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array in case of an error
  }
};
const fetchBuildings = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/admin/buildings"); // Fetch buildings API
    // Fetch properties API
    const data = await response.json();

    return data; // Return fetched properties
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array in case of an error
  }
};
const fetchFacilities = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/admin/facilities");
    const data = await response.json();
 
    return data; // Return fetched properties
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array in case of an error
  }
};
const fetchFeatures = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/admin/features"); // Fetch features API
    const data = await response.json();
  
    return data; // Return fetched properties
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return []; // Return an empty array in case of an error
  }
};
// DataTable Component
export function DataTable({ columns, data }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [expandedRow, setExpandedRow] = useState(null); // Track expanded row
  const [otherBuildingsdata, setotherBuildingsData] = useState([]);
  const [facilityData, setFacilities] = useState([]);
  const [featureData, setFeatures] = useState([]);
const [propertyData, setPropertyData] = useState({
  name: '',
  status: '',
  location: '',
  specific_location: '',
  price_range: '',
  lat:'',
  lng:'',
  units: '',
  land_area: '',
  development_type: '',
  architectural_theme: '',
  key:'',
  path: null, // Store file object for path
  view: null,  // Store file object for view
});

const fillableFields = [
  { label: 'Name', value: 'name' },
  { label: 'Status', value: 'status' },
  { label: 'Location', value: 'location' },
    { label: 'Lattitude', value: 'lat' },
      { label: 'Longtitude', value: 'lng' },
  { label: 'Specific Location', value: 'specific_location' },
  { label: 'Price Range', value: 'price_range' },
  { label: 'Units', value: 'units' },
  { label: 'Land Area', value: 'land_area' },
  { label: 'Development Type', value: 'development_type' },
  { label: 'Architectural Theme', value: 'architectural_theme' },
];
const pathAndViewFeatures = [
  { label: 'Building Image', value: 'path', type: 'file' },
  { label: 'Master Plan', value: 'view', type: 'file' }, // Use type 'file'
];
const handleChange = (event) => {
  const { name, value } = event.target;
  setPropertyData({ ...propertyData, [name]: value });
};



  // Toggle expanded state when a row is clicked
  const handleRowClick = (rowId, value) => {
    setExpandedRow((prev) => (prev === rowId ? null : rowId)); // Toggle expanded state

  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      const buildingresult = await fetchBuildings();
      setotherBuildingsData(buildingresult);

      const facilityresult = await fetchFacilities();
      setFacilities(facilityresult);

      const featureresult = await fetchFeatures(); // Fetch data from API


      // Check if the features field is a string and parse it
      const parsedFeatures = featureresult.map((feature) => {
        try {
          return {
            ...feature,
            features: feature.features ? JSON.parse(feature.features) : [],
          };
        } catch (error) {
          console.error("Error parsing features:", error);
          return feature; // Return as is in case of error
        }
      });

      // Set the parsed features into the state
      setFeatures(parsedFeatures);
    };

    fetchData();
  }, []);
    const [isAddPropertyOpen, setisAddPropertyOpen] = useState(false);
  const openAddProperty = () => {
    // Trigger the popup opening logic, potentially updating state or making API calls
    setisAddPropertyOpen(true);
  };
const closeAddProperty = () => {
  // Set isAddPropertyOpen to false to close the popup
  setisAddPropertyOpen(false);
};
function addproperty() {
  // ... (existing functionality for adding a property)
openAddProperty()
}
const handleFileChange = (e) => {
  const { name, files } = e.target;

  if (!files || files.length === 0) return;

  const file = files[0];

  // Update the property data with the File object
  setPropertyData({
    ...propertyData,
    [name]: file,
  });
};
const handleSubmit = async (e) => {
  e.preventDefault();

  // Ensure that all required fields are filled

  const formData = new FormData();

  // Reassign 'key' to be the lowercase version of 'location'
  if (propertyData.location) {
    propertyData.key = propertyData.location.toLowerCase();
  }

  // Log property data before appending
  console.log('Property Data before appending:', propertyData);

  // Append all property fields
  Object.keys(propertyData).forEach((key) => {
    // Ensure that files are appended correctly
    if (key === 'path' || key === 'view') {
      if (propertyData[key] instanceof File) {
        console.log(`Appending file for key ${key}:`, propertyData[key]);
        formData.append(key, propertyData[key]);
      }
    } else {
      console.log(`Appending regular data for key ${key}:`, propertyData[key]);
      formData.append(key, propertyData[key]);
    }
  });

  // Log the formData to see what is being appended
  formData.forEach((value, key) => {
    console.log('Form Data:', key, value);
  });

  try {
    const response = await fetch('http://localhost:8000/api/admin/addproperty', {
      method: 'POST',
      body: formData, // No need to set headers, Fetch will handle it
    });

    // Check if the response is JSON
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      // Log the response data
      console.log('Response Data:', data);

      if (response.ok) {
        
        console.log('Property created successfully');
        closeAddProperty()
      } else {
        console.error('Error creating property:', data);
      }
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Error:', error); 
  }
};




  return (
    
    <div    className="max-h-20 ">
{isAddPropertyOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-auto shadow-xl">
      <button
        onClick={() => closePopup('addProperty')}
        className="absolute top-4 right-4 bg-gray-500 text-white rounded-full p-2 focus:outline-none hover:bg-gray-600"
      >
        <span className="text-2xl">&times;</span>
      </button>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add Property
      </h2>

      <div className="space-y-6 overflow-y-auto max-h-screen">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6" encType="multipart/form-data">
             {fillableFields.map((field) => (
            <div key={field.value} className="flex flex-col space-y-2">
              <label htmlFor={field.value} className="text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type="text"
                id={field.value}
                name={field.value}
                value={propertyData[field.value]}
                onChange={handleChange}
                className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}

{pathAndViewFeatures.map((field) => (
  <div key={field.value} className="flex flex-col space-y-2 col-span-full md:col-span-1">
    <label htmlFor={field.value} className="text-sm font-medium text-gray-700">
      {field.label}
    </label>
    <input
      type="file"
      id={field.value}
      name={field.value}
      onChange={handleFileChange}
      accept={field.value === 'path' ? 'image/*' : '*'}
      className="rounded-md border border-gray-300 p-2 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
    />
  </div>
))}

      
        </form>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-200"
            onClick={handleSubmit}
          // Trigger bulk update function
        >
              Submit
        </button>
        <button
  onClick={closeAddProperty} // Call the function here
  className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition duration-200"
>
  Cancel
</button>
      </div>
    </div>
  </div>
)}

      <div className="flex mb-5 ">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <button onClick={addproperty}>
  <img src="/addbutton.png" className="w-8 h-8 " alt="Add Button"/>
</button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-10 bg-white">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <div >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    {/* Main Table Row */}
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                       
                        handleRowClick(row.id, row.original); // Toggle expanded state
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Content Row (Accordion) */}
                    {expandedRow === row.id && (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="p-4 bg-white-100"
                        >
                          <Accordion type="single" collapsible>
                            <AccordionItem value={row.id.toString()}>
                              <AccordionTrigger>
                                Other Buildings
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Building Name</TableHead>
                                        <TableHead>Development Type</TableHead>
                                        <TableHead>
                                          Residential Levels
                                        </TableHead>
                                        <TableHead>
                                          Basement Parking Levels
                                        </TableHead>
                                        <TableHead>
                                          Podium Parking Levels
                                        </TableHead>
                                        <TableHead>Commercial Units</TableHead>
                                        <TableHead>
                                          Lower Ground Parking Levels
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {/* Filter the otherBuildingsdata to show only buildings that match the current row's ID */}
                                      {otherBuildingsdata.length > 0 ? (
                                        otherBuildingsdata
                                          .filter(
                                            (building) =>
                                              building.property_id ===
                                              row.original.id // Match the property_id with the row's id
                                          )
                                          .map((building) => (
                                            <TableRow key={building.id}>
                                              <TableCell>
                                                {building.name}
                                              </TableCell>
                                              <TableCell>
                                                {building.development_type}
                                              </TableCell>
                                              <TableCell>
                                                {building.residential_levels}
                                              </TableCell>
                                              <TableCell>
                                                {building.basement_parking_levels ||
                                                  "N/A"}
                                              </TableCell>
                                              <TableCell>
                                                {building.podium_parking_levels ||
                                                  "N/A"}
                                              </TableCell>
                                              <TableCell>
                                                {building.commercial_units ||
                                                  "N/A"}
                                              </TableCell>
                                              <TableCell>
                                                {building.lower_ground_floor_parking_levels ||
                                                  "N/A"}
                                              </TableCell>
                                            </TableRow>
                                          ))
                                      ) : (
                                        <TableRow>
                                          <TableCell colSpan={7}>
                                            No buildings found
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value={`building-details-${row.id}`}>
                              <AccordionTrigger>
                                Building Details
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="rounded-md border p-4 overflow-y-auto ">
                                  <div className="flex space-x-6">
                                    {/* Building Features Table */}
                                    <div className="w-1/2  max-h-60 overflow-y-auto">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Feature</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {featureData.length > 0 ? (
                                            featureData
                                              .filter(
                                                (feature) =>
                                                  feature.id === row.original.id
                                              ) // Match feature by id
                                              .map((featureItem) =>
                                                featureItem.features.map(
                                                  (feature, index) => (
                                                    <TableRow key={index}>
                                                      {" "}
                                                      {/* Use index as the key for each feature */}
                                                      <TableCell>
                                                        {feature.name}
                                                      </TableCell>
                                                    </TableRow>
                                                  )
                                                )
                                              )
                                          ) : (
                                            <TableRow>
                                              <TableCell
                                                colSpan={2}
                                                className="text-center"
                                              >
                                                No features found
                                              </TableCell>
                                            </TableRow>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>

                                    {/* Building Facilities Table */}
                                    <div className="w-1/2 max-h-60 overflow-y-auto">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Facilities</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {facilityData
                                            .filter(
                                              (facility) =>
                                                facility.property_id ===
                                                row.original.id
                                            ) // Filter by property_id
                                            .map((facility, index) => {
                                              const correspondingFeature =
                                                featureData
                                                  .filter(
                                                    (feature) =>
                                                      feature.property_id ===
                                                      row.original.id
                                                  )
                                                  .map((feature) => {
                                                    const features = JSON.parse(
                                                      feature.features
                                                    ); // Parse the features JSON string
                                                    return features.find(
                                                      (f) =>
                                                        f.name === facility.name
                                                    ); // Find the matching feature
                                                  })[0];

                                              return (
                                                <TableRow key={facility.id}>
                                                  <TableCell>
                                                    {facility.name}
                                                  </TableCell>
                                                </TableRow>
                                              );
                                            })}

                                          {facilityData.filter(
                                            (facility) =>
                                              facility.property_id ===
                                              row.original.id
                                          ).length === 0 && (
                                            <TableRow>
                                              <TableCell colSpan={3}>
                                                No facilities found
                                              </TableCell>
                                            </TableRow>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

    </div>
  );
}
