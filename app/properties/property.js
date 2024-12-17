"use client";
import { useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Building Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "development_type",
    header: "Development Type",
  },
  {
    accessorKey: "price_range",
    header: "Price Range",
  },
  {
    accessorKey: "architectural_theme",
    header: "Architectural Theme",
  },
  {
    accessorKey: "lat",
    header: "Lattitude",
  },
  {
    accessorKey: "lng",
    header: "Longitude",
  },

  {
    id: "actions",
    cell: ({ row, viewType }) => {
      const payment = row.original;
      const fetchProperties = async () => {
        // Assuming you have this function defined elsewhere
        try {
          const response = await fetch(
            "http://localhost:8000/api/admin/properties"
          ); // Fetch properties API
          const data = await response.json();
          
          return data; // Return fetched properties
        } catch (error) {
          console.error("Failed to fetch properties:", error);
          return []; // Return an empty array in case of an error
        }
      };
      const fetchBuildings = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/api/admin/buildings"
          ); // Fetch buildings API
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
          const response = await fetch(
            "http://localhost:8000/api/admin/facilities"
          );
          const data = await response.json();
     
          return data; // Return fetched properties
        } catch (error) {
          console.error("Failed to fetch properties:", error);
          return []; // Return an empty array in case of an error
        }
      };
      const fetchFeatures = async () => {
        try {
          const response = await fetch(
            "http://localhost:8000/api/admin/features"
          ); // Fetch features API
          const data = await response.json();
 
          return data; // Return fetched properties
        } catch (error) {
          console.error("Failed to fetch properties:", error);
          return []; // Return an empty array in case of an error
        }
      };
      const handleDelete = async (ids, viewType) => {
        // Log the ids to check if they are in an array format


        // If ids is a single ID (not an array), wrap it in an array
        const idsToDelete = Array.isArray(ids) ? ids : [ids];

        let url;
        if (viewType === "property") {
          url = "http://localhost:8000/api/admin/deleteproperty";
        } else if (viewType === "buildings") {
          url = "http://localhost:8000/api/admin/deletebuilding";
        } else if (viewType === "feature") {
          url = "http://localhost:8000/api/admin/deletefeature";
        } else if (viewType === "facility") {
          url = "http://localhost:8000/api/admin/deletefacility";
        } else {
          console.error("Invalid viewType");
          return;
        }

        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: idsToDelete }), // Always send an array of IDs
          });

          if (!response.ok) {
            throw new Error(`Error deleting items: ${response.statusText}`);
          }

          const result = await response.json();
         

             if (viewType === "property") {
           fetchProperties();
      alert(payment.name + ' ' + viewType+ ' deleted successfully');

        } else if (viewType === "buildings") {
         fetchBuildings();
             alert(payment.name + ' ' + viewType +' deleted successfully');

        } else if (viewType === "feature") {
          fetchFeatures();
            alert(payment.name + ' ' + viewType+ ' deleted successfully');

        } else if (viewType === "facility") {
          fetchFacilities();
             alert(payment.name + ' ' + viewType+ ' deleted successfully');

        } else {  
          console.error("Invalid viewType");
          return;
        }
        } catch (error) {
          console.error("Error:", error);
        }
      };

  const [popups, setPopups] = useState({
    addBuilding: false,
    addOtherBuilding: false,
    addFacilities: false,
    editBuilding: false,
    updateBuilding: false,
    updateProperty: false,
  });
  const [rowData, setRowData] = useState(null);
  const [updatedData, setUpdatedData] = useState(rowData);

 const openPopup = (type, data = null) => {

    setRowData(data);
    setPopups((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  // Close the popup
  const closePopup = (type) => {

    setPopups((prev) => ({
      ...prev,
      [type]: false,
    }));
  };

const [formData, setFormData] = useState({
  otherBuilding: {
    buildingName: '',
    developmentType: '',
    residentialLevels: '',
    basementParkingLevels: '',
    podiumParkingLevels: '',
    commercialUnits: '',
    lowerGroundParkingLevels: '',
  },
  facilities: {
    facilityName: '',
    description: '',
    location: '',
  },
  features: {
    featureCount: 1,
    featureData: [{ featureName: '', featureImage: null }],
  },
  
});
const [currentBuildingIndex, setCurrentBuildingIndex] = useState(0);
const [buildingData, setBuildingData] = useState(null);
const [featureData, setFeatureData] = useState([]);
const [currentFeatureIndex, setCurrentFeatureIndex] = useState(null); // Or a default valid index
const handleInputChange = (e, section, index = null) => {
  const { name, value, type, files } = e.target;

  setFormData((prevData) => {
    if (section === 'features') {
      const updatedFeatures = [...prevData.features.featureData];
      
      if (name === 'featureCount') {
        // Ensure the feature count is updated correctly
        return {
          ...prevData,
          features: {
            ...prevData.features,
            featureCount: value,  // Update the featureCount
            featureData: Array.from({ length: parseInt(value) }).map(() => ({ featureName: '', featureImage: null }))
          },
        };
      }

      if (index !== null) {
        const newValue = type === 'file' ? files[0] : value;
        updatedFeatures[index] = {
          ...updatedFeatures[index],
          [name]: newValue,
        };
      }

      return {
        ...prevData,
        features: {
          ...prevData.features,
          featureData: updatedFeatures,
        },
      };
    }

    return {
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    };
  });
};

const handleAddOtherBuilding = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();
  formDataToSend.append("propertyId", payment.id); // Assuming `payment.id` exists
   formDataToSend.append("propertyName", payment.name);
  formDataToSend.append("buildingName", formData.otherBuilding.buildingName);
  formDataToSend.append("developmentType", formData.otherBuilding.developmentType);
  formDataToSend.append("residentialLevels", formData.otherBuilding.residentialLevels);
  formDataToSend.append("basementParkingLevels", formData.otherBuilding.basementParkingLevels);
  formDataToSend.append("podiumParkingLevels", formData.otherBuilding.podiumParkingLevels);
  formDataToSend.append("commercialUnits", formData.otherBuilding.commercialUnits);
  formDataToSend.append("lowerGroundParkingLevels", formData.otherBuilding.lowerGroundParkingLevels);

  if (formData.buildingImage) {
    formDataToSend.append("buildingView", formData.buildingImage); // Append the image file
  }

  // Log the FormData content
  console.log("FormData Content:");
  for (const [key, value] of formDataToSend.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await fetch("http://localhost:8000/api/admin/addBuildings", {
      method: "POST",
      body: formDataToSend, // Send the FormData directly
    });

    if (response.ok) {
      const responseData = await response.json();
      closePopup("addOtherBuilding");
      alert("Building added successfully!");
    } else {
      console.error("Failed to add building:", response.statusText);
      alert("Failed to add building. Please try again.");
    }
  } catch (error) {
    console.error("Error sending form data:", error);
    alert("Error sending data. Please try again later.");
  }
};

const handleAddFacilities = async (e) => {
  e.preventDefault();

  // Collect all facility names dynamically based on the `facilityCount`
  const facilities = [];
  for (let i = 0; i < formData.facilities.facilityCount; i++) {
    facilities.push({
      property_id: payment.id, // Property ID for each facility
      facilities: formData.facilities[`facilityName${i}`] // Facility name
    });
  }

  // Log the facilities array and the request data
  console.log('Facilities Data:', facilities);

  try {
    const response = await fetch('http://localhost:8000/api/admin/addFacilities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facilities),
    });

    if (response.ok) {
      const responseData = await response.json();

      closePopup('addFacilities');
      alert('Building facility added successfully!');
    } else {
      console.error('Failed to add facility:', response.statusText);
      alert('Failed to add facility. Please try again.');
    }
  } catch (error) {
    console.error('Error sending form data:', error);
    alert('Error sending data. Please try again later.');
  }
};

const handleAddFeature = (e) => {
  e.preventDefault();

  // Log the formData and payment.id to the console to see the submitted values
  if (formData.features && formData.features.featureData) {

    const data = new FormData();
    data.append('propertyId', payment.id);
    data.append('propertyName', payment.name);  // Send the propertyName as well

    formData.features.featureData.forEach((feature, index) => {
      // Append feature name
      if (feature.featureName) {
        data.append(`features[${payment.id}][${index}][featureName]`, feature.featureName);
      }

      // Append feature image if available
      if (feature.featureImage) {
        data.append(`features[${payment.id}][${index}][featureImage]`, feature.featureImage);
      }
    });

    fetch('http://localhost:8000/api/admin/addFeature', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    console.error('Features or featureData is undefined');
  }
};

const handleUpdateProperty = (e) => {
  e.preventDefault(); // Prevent the default form submission

  // Create a copy of rowData and remove the unwanted fields
  const updatedValues = { ...rowData };

  // Prepare the payload for the API request
  const payload = [
    {
      propertyId: updatedValues.id, // Use the property id for identifying the property to update
      item: updatedValues, // Send the updated values of the property
    },
  ];

  // Make the API call to update the property
  fetch('http://localhost:8000/api/admin/update-properties', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload), // Send the data as JSON
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Properties updated successfully.') {
        // Handle success (e.g., show a success message)
        alert('Property updated successfully');
      } else {
        // Handle failure (e.g., show an error message)
        alert('Failed to update property');
      }
    })
    .catch((error) => {
      // Handle network or other errors
      console.error('Error:', error);
    });

  // Close the popup after submission
  closePopup('updateProperty');
};

const fetchBuildingData = async (buildingId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/buildings/id/${buildingId}`);
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      setBuildingData(data);
      openPopup('updateBuilding', data[0]);
    } else {
      console.error('No building data found.');
    }
  } catch (error) {
    console.error('Failed to fetch building data:', error);
  }
};

const nextBuilding = () => {
  if (buildingData && buildingData.length > 0) {
    setCurrentBuildingIndex((prevIndex) => (prevIndex + 1) % buildingData.length);
  }
};

const prevBuilding = () => {
  if (buildingData && buildingData.length > 0) {
    setCurrentBuildingIndex(
      (prevIndex) => (prevIndex - 1 + buildingData.length) % buildingData.length
    );
  }
};

  const handleUpdateBuildingClick = () => {
   
    // For demonstration, you can replace this with dynamic logic (e.g., from the clicked row)
    fetchBuildingData(payment.id);
  };
const handleUpdateBuilding = async (e) => {
  e.preventDefault();

  // Gather all updated values from the form fields
const updatedBuilding = {
  propertyId : payment.id,
  item: {
    id: buildingData[currentBuildingIndex].id,
    property_id: payment.id,
    name: buildingData[currentBuildingIndex].name,
    development_type: buildingData[currentBuildingIndex].development_type,
    residential_levels: buildingData[currentBuildingIndex].residential_levels,
    basement_parking_levels: Number(buildingData[currentBuildingIndex].basement_parking_levels), // Convert to number
    podium_parking_levels: Number(buildingData[currentBuildingIndex].podium_parking_levels), // Convert to number
    commercial_units: Number(buildingData[currentBuildingIndex].commercial_units), // Convert to number
    lower_ground_floor_parking_levels: Number(buildingData[currentBuildingIndex].lower_ground_floor_parking_levels), // Convert to number
  }
};

  try {
    const response = await fetch(`http://localhost:8000/api/admin/update-buildings`, {
      method: 'POST',  // Change the HTTP method to POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([updatedBuilding]),  // Send it as an array (even if it's just one item)
    });

    if (response.ok) {
      // Handle successful update (you can refresh the data or give feedback to the user)
      alert('Building updated successfully!');
      // Optionally, you can refetch the data here to reflect the update
        closePopup('updateBuilding');
    } else {
      throw new Error('Failed to update building');
    }
  } catch (error) {
    console.error('Error updating building:', error);
    alert('There was an error updating the building.');
  }
};


 const [facilities, setFacilities] = useState([]);
 const getFacilities= async () => {
    try {
       // Replace this with the actual property ID dynamically
      const response = await fetch(`http://localhost:8000/api/facilities/id/${payment.id}`);

      // Check if the response is successful (status 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json(); // Parse JSON response

      // Set the fetched data to state
      setFacilities(data);

      // Call the openPopup function with 'updateFacility' and the fetched data
      openPopup('updateFacility', data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };
  const handleBulkUpdate = () => {
    // Assuming payment.id is available
    // Or retrieve it from wherever payment is stored

    // Update the facilities data by adding the propertyId
 const updatedFacilities = facilities.map(facility => ({
  id: facility.id,  // Add the facility ID
  name: facility.name,  // Add the facility name
  property_id: facility.property_id  // Add the property ID
}));



    fetch('http://localhost:8000/api/admin/update-facilities', {
      method: 'POST',
      body: JSON.stringify(updatedFacilities), // Send the updated facilities array
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Successfully updating facilities '); // Handle the response if necessary
          closePopup('updateFacility');
      })
      .catch((error) => {
       alert('Error updating facilities:', error); // Handle any errors
      });
  };




const handleFacilityNameChange = (e, facilityId) => {
    const updatedFacilities = facilities.map((facility) =>
      facility.id === facilityId
        ? { ...facility, name: e.target.value }
        : facility
    );
    setFacilities(updatedFacilities); // Update the facilities list in the parent state
  };
const handleUpdateFeatureClick = (payment) => {
  const features = parseFeatures(payment.features); // Parse features before opening the popup
  setRowData({ ...payment, features }); // Set the parsed features to rowData
  openPopup("updateFeature", payment); // Open the popup
};

const parseFeatures = (features) => {
  try {
    if (features) {
      if (typeof features === "string") {
        // If features is a string, parse it into an object
        return JSON.parse(features);
      } else if (Array.isArray(features)) {
        // If features is already an array, return it directly
        return features;
      } else if (typeof features === "object") {
        // If features is already an object, return it directly
        return features;
      } else {
        console.warn("Unexpected data type for features:", features);
        return [];  // Return empty array in case of unexpected type
      }
    }
    return []; // Return empty array if no features are present
  } catch (error) {
    console.error("Error parsing features:", error);
    return []; // Return empty array in case of error during parsing
  }
};
const handleOtherBuildingImageChange = (e) => {
  const { files } = e.target;

  if (!files || files.length === 0) return;

  const file = files[0];

  // Update the formData directly with the selected file
  setFormData((prevFormData) => ({
    ...prevFormData,
    buildingImage: file,
  }));
};


  const handleImageChange = (e, index) => {
    const { files } = e.target;

    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const updatedFeatures = [...JSON.parse(rowData.features)];
      updatedFeatures[index].image = reader.result; // Store the base64 image

      // Update the row data with the new feature image
      setRowData({ ...rowData, features: JSON.stringify(updatedFeatures) });
    };

    // Read the file as a data URL (Base64)
    reader.readAsDataURL(file);
  };

const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  try {
    // Parse the updated features from rowData
    const updatedFeatures = JSON.parse(rowData.features);

    // Prepare FormData to handle both file uploads and other fields
    const formData = new FormData();
    formData.append('propertyId', rowData.id); // Assuming rowData has the propertyId
    formData.append('propertyName', rowData.name); // Assuming rowData has the propertyId

    // Loop through updated features to add files dynamically
    updatedFeatures.forEach((feature, index) => {
      Object.entries(feature).forEach(([key, value]) => {
        if (value instanceof File) {
          // Append file entries dynamically
          formData.append(`features[${index}][${key}]`, value);
        } else {
          // Append other non-file feature values
          formData.append(`features[${index}][${key}]`, value);
        }
      });
    });

    // Log the FormData for debugging
    console.log('FormData content:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Send the request to update the features
    const response = await fetch('http://localhost:8000/api/admin/update-features', {
      method: 'POST', // Use POST since you're sending FormData
      body: formData, // FormData automatically sets the correct Content-Type (multipart/form-data)
    });

    // Handle the response
    if (response.ok) {
      const data = await response.json();
      console.log('Updated features response:', data); // Log the response data
      alert('Features updated successfully!');
      closePopup('updateFeature'); // Close the popup after successful update
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || 'Something went wrong'}`);
    }
  } catch (error) {
    console.error('Error updating features:', error);
    alert('An error occurred while updating the features.');
  }
};
const handleFeatureInputChange = (e, index) => {
  const { name, value, type, files } = e.target;

  setFormData((prevData) => {
    // Make a copy of the featureData
    const updatedFeatures = [...prevData.features.featureData];

    // If the input is for a specific feature, update that feature's data
    if (index !== null) {
      const newValue = type === 'file' ? files[0] : value;
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        [name]: newValue,
      };
    }

    return {
      ...prevData,
      features: {
        ...prevData.features,
        featureData: updatedFeatures,
      },
    };
  });
};

const handleFeatureImageChange = (e, index) => {
  const { files } = e.target;

  if (!files || files.length === 0) return;

  const file = files[0];

  // Update the feature data with the selected image
  const updatedFeatures = [...formData.features.featureData];
  updatedFeatures[index].featureImage = file; // Store the file itself

  // Update the form data state
  setFormData({
    ...formData,
    features: {
      ...formData.features,
      featureData: updatedFeatures,
    },
  });
};


      return (
        <div>
<DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>Copy Property ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openPopup('addOtherBuilding')}>Add Other Building</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openPopup('addFacilities')}>Add Building Facilities</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openPopup('addFeature')}>Add Building Feature</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openPopup('updateProperty', payment)}>Update Property</DropdownMenuItem>
              <DropdownMenuItem onClick={handleUpdateBuildingClick}>Update Other Building</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateFeatureClick(payment)}>Update Features</DropdownMenuItem>
              <DropdownMenuItem onClick={getFacilities}>Update Facilities</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(payment.id, "property")}>Delete Property</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(payment.id, "buildings")}>Delete Other Buildings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(payment.id, "feature")}> Delete Feature </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(payment.id, "facility")}> Delete Facilities </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
 {popups.updateFacility && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-auto shadow-xl">
      <button
        onClick={() => closePopup('updateFacility')}
        className="absolute top-4 right-4 bg-gray-500 text-white rounded-full p-2 focus:outline-none hover:bg-gray-600"
      >
        <span className="text-2xl">&times;</span>
      </button>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Update Facility
      </h2>

      {/* Facilities List or No Facility Message */}
      <div className="space-y-6 max-h-[400px] overflow-y-auto">
        {facilities.length === 0 ? (
          <div className="text-center text-gray-500 font-medium">
            No facility found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {facilities.map((facility, index) => (
              <div
                key={facility.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 pt-2">
                    {index + 1}.
                  </span> 
                  {/* Numbering */}
                  <input
                    type="text"
                    value={facility.name}
                    onChange={(e) => handleFacilityNameChange(e, facility.id)} // Function to update facility name
                    className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Facility Name"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update and Cancel Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleBulkUpdate} // Trigger bulk update function
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-200"
        >
          Update Selected
        </button>
        <button
          onClick={() => closePopup('updateFacility')}
          className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition duration-200"
        >
          Cancel
        </button>
      </div>    
    </div>
  </div>
)}

{popups.updateFeature && rowData && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[80vh]">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Update Features for: {rowData.name}
      </h2>
      <form className="w-full" onSubmit={handleSubmit}>
        {/* Render Features Dynamically */}
        {rowData.features ? (
          JSON.parse(rowData.features).map((feature, index) => {
            // Fix the backslashes in image path
            const fixedImagePath = feature.image ? feature.image.replace(/\\/g, '/') : '';

            return (
              <div key={index} className="grid grid-cols-2 gap-4 mb-4 border-b pb-4">
                {/* Feature Name and Image on the left side */}
                <div className="space-y-4 p-4 bg-gray-50 border rounded-lg">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Feature Name
                    </label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={feature.name}
                      onChange={(e) => {
                        const updatedFeatures = [...JSON.parse(rowData.features)];
                        updatedFeatures[index].name = e.target.value;
                        setRowData({ ...rowData, features: JSON.stringify(updatedFeatures) });
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Feature Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="image"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                  </div>
                </div>

                {/* Display Image */}
            <div className="flex justify-center items-center p-4 bg-gray-50 border rounded-lg">
{feature.image && feature.image !== 'null' ? (
  feature.image.startsWith('data:image') ? (
    // Base64 image handling
    <img
      src={feature.image} // Base64 string for the image preview
      alt={feature.name || 'Feature Image'}
      className="w-32 h-32 object-cover rounded-md"
    />
  ) : (
    // Path-based image handling (URL or path)
    <img
      src={`http://localhost:8000${feature.image.replace(/\\/g, '/')}`} // Ensure the path is fixed
      alt={feature.name || 'Feature Image'}
      className="w-32 h-32 object-cover rounded-md"
    />
  )
) : (
  <div className="text-gray-500">No Image Available</div>
)}

</div>

              </div>
            );
          })
        ) : (
          <p>No features available</p>
        )}

        {/* Save Button to capture the updated values */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={() => closePopup('updateFeature')}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}






       {popups.updateBuilding && buildingData && buildingData.length > 0 && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Update Building for '{buildingData[currentBuildingIndex].name}' in {payment.name}
      </h2>

      <form className="grid grid-cols-2 gap-4 w-full" onSubmit={handleUpdateBuilding}>
        {/* Dynamically render building details */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Building Name</label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={buildingData[currentBuildingIndex].name || ''}
            onChange={(e) =>
              setBuildingData((prevData) =>
                prevData.map((building, index) =>
                  index === currentBuildingIndex
                    ? { ...building, name: e.target.value }
                    : building
                )
              )
            }
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Development Type</label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={buildingData[currentBuildingIndex].development_type || ''}
            onChange={(e) =>
              setBuildingData((prevData) =>
                prevData.map((building, index) =>
                  index === currentBuildingIndex
                    ? { ...building, development_type: e.target.value }
                    : building
                )
              )
            }
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Residential Levels</label>
          <input
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={buildingData[currentBuildingIndex].residential_levels || ''}
            onChange={(e) =>
              setBuildingData((prevData) =>
                prevData.map((building, index) =>
                  index === currentBuildingIndex
                    ? { ...building, residential_levels: e.target.value }
                    : building
                )
              )
            }
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Basement Parking Levels</label>
          <input
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={buildingData[currentBuildingIndex].basement_parking_levels || ''}
            onChange={(e) =>
              setBuildingData((prevData) =>
                prevData.map((building, index) =>
                  index === currentBuildingIndex
                    ? { ...building, basement_parking_levels: e.target.value }
                    : building
                )
              )
            }
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Podium Parking Levels</label>
          <input
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={buildingData[currentBuildingIndex].podium_parking_levels || ''}
            onChange={(e) =>
              setBuildingData((prevData) =>
                prevData.map((building, index) =>
                  index === currentBuildingIndex
                    ? { ...building, podium_parking_levels: e.target.value }
                    : building
                )
              )
            }
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Commercial Units</label>
          <input
            type="number"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={buildingData[currentBuildingIndex].commercial_units || ''}
            onChange={(e) =>
              setBuildingData((prevData) =>
                prevData.map((building, index) =>
                  index === currentBuildingIndex
                    ? { ...building, commercial_units: e.target.value }
                    : building
                )
              )
            }
          />
        </div>
        
        <input
  type="number"
  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  value={buildingData[currentBuildingIndex].lower_ground_floor_parking_levels || ''}  // Ensure it's either a valid number or an empty string
  onChange={(e) => {

    setBuildingData((prevData) =>
      prevData.map((building, index) =>
        index === currentBuildingIndex
          ? { ...building, lower_ground_floor_parking_levels: e.target.value }
          : building
      )
    );
  }}
/>


        {/* Update and Cancel Buttons */}
        <div className="flex justify-end space-x-2 mt-4 col-span-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={(e) => handleUpdateBuilding(e)}
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => closePopup('updateBuilding')}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={prevBuilding}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextBuilding}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  </div>
)}


 {popups.updateProperty && rowData && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Update Property: {rowData.name}
      </h2>
      <form className="grid grid-cols-2 gap-4 w-full" onSubmit={handleUpdateProperty}>
        {/* Dynamically Render Fields, excluding certain keys */}
        {Object.keys(rowData)
          .filter((key) => !['created_at', 'updated_at', 'features', 'path', 'view', 'key'].includes(key)) // Exclude specific keys
          .map((key) => (
            <div key={key} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {key.replace(/_/g, ' ').toUpperCase()}
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={rowData[key] || ''} // Shows current value
                onChange={(e) => setRowData({ ...rowData, [key]: e.target.value })} // Updates state
                disabled={['id', 'created_at', 'updated_at', 'features'].includes(key)}
              />
            </div>
          ))}
        {/* Cancel and Update Buttons */}
        <div className="flex justify-end space-x-2 mt-4 col-span-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Update
          </button>
          <button
            type="button"
            onClick={() => closePopup('updateProperty')}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}





{popups.addOtherBuilding && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Other Building for {payment.name}</h2>
      <form onSubmit={handleAddOtherBuilding} className="space-y-4">
        {/* Building Name */}
        <div className="space-y-1">
          <label className="text-lg font-medium text-gray-700">Building Name</label>
          <input
            type="text"
            name="buildingName"
            value={formData.buildingName}
            onChange={(e) => handleInputChange(e, 'otherBuilding')}
            className="border px-4 py-3 rounded-lg w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-10"
            required
          />
        </div>

        {/* Development Type */}
        <div className="space-y-1">
          <label className="text-lg font-medium text-gray-700">Development Type</label>
          <input
            type="text"
            name="developmentType"
            value={formData.developmentType}
            onChange={(e) => handleInputChange(e, 'otherBuilding')}
            className="border px-4 py-3 rounded-lg w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
            required
          />
        </div>

        {/* Levels - Using Grid for Five Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Residential Levels */}
          <div className="space-y-1">
            <label className="text-lg font-medium text-gray-700">Residential Levels</label>
            <input
              type="number"
              name="residentialLevels"
              value={formData.residentialLevels}
              onChange={(e) => handleInputChange(e, 'otherBuilding')}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Basement Parking Levels */}
          <div className="space-y-1">
            <label className="text-lg font-medium text-gray-700">Basement Parking Levels</label>
            <input
              type="number"
              name="basementParkingLevels"
              value={formData.basementParkingLevels}
              onChange={(e) => handleInputChange(e, 'otherBuilding')}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Podium Parking Levels */}
          <div className="space-y-1">
            <label className="text-lg font-medium text-gray-700">Podium Parking Levels</label>
            <input
              type="number"
              name="podiumParkingLevels"
              value={formData.podiumParkingLevels}
              onChange={(e) => handleInputChange(e, 'otherBuilding')}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Commercial Units */}
          <div className="space-y-1">
            <label className="text-lg font-medium text-gray-700">Commercial Units</label>
            <input
              type="number"
              name="commercialUnits"
              value={formData.commercialUnits}
              onChange={(e) => handleInputChange(e, 'otherBuilding')}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Lower Ground Parking Levels */}
          <div className="space-y-1">
            <label className="text-lg font-medium text-gray-700">Lower Ground Parking Levels</label>
            <input
              type="number"
              name="lowerGroundParkingLevels"
              value={formData.lowerGroundParkingLevels}
              onChange={(e) => handleInputChange(e, 'otherBuilding')}
              className="border px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Image Input */}
       <div className="space-y-1">
  <label className="text-lg font-medium text-gray-700">Building Image</label>
<input
  type="file"
  name="buildingImage"
  onChange={(e) => handleOtherBuildingImageChange(e)} // Use the new function
  className="border px-4 py-3 rounded-lg w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

          {formData.buildingImage && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(formData.buildingImage)}
                alt="Building Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Building
          </button>
          <button
            type="button"
            onClick={() => closePopup('addOtherBuilding')} // Pass the correct popup name/key
            className="bg-gray-400 text-black px-6 py-3 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{popups.addFacilities && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded-lg w-full max-w-md"> {/* Reduced padding and width */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Building Facility for {payment.name}</h2> {/* Smaller text */}
      <form onSubmit={handleAddFacilities} className="space-y-3"> {/* Reduced spacing */}
        {/* Number of Facility Names */}
        <div className="space-y-1">
          <label className="text-lg font-medium text-gray-700">How many Facility Names?</label>
          <input
            type="number"
            name="facilityCount"
            value={formData.facilities.facilityCount}
            onChange={(e) => handleInputChange(e, 'facilities')} // Specify the section here
            className="border px-3 py-2 rounded-lg w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-10"
            min="1"
            required
          />
        </div>

        {/* Facility Name Inputs */}
        {Array.from({ length: formData.facilities.facilityCount || 0 }).map((_, index) => (
          <div key={index} className="space-y-1">
            <label className="text-lg font-medium text-gray-700">Facility Name {index + 1}</label>
            <input
              type="text"
              name={`facilityName${index}`}
              value={formData.facilities[`facilityName${index}`] || ''}
              onChange={(e) => handleInputChange(e, 'facilities')}
              className="border px-3 py-2 rounded-lg w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-10"
              required
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="space-y-1">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Facility
          </button>
          <button
            type="button"
            onClick={() => closePopup('addFacilities')} // Pass the correct popup name/key
            className="bg-gray-400 text-black px-4 py-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{popups.addFeature && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-4 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">  {/* Added max height and scrollable */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Building Feature for {payment.name}</h2>
      <form onSubmit={handleAddFeature} className="space-y-3">

        {/* Number of Feature Names */}
        <div className="space-y-1">
          <label className="text-lg font-medium text-gray-700">How many Feature Names?</label>
          <input
            type="number"
            name="featureCount"
            value={formData.features.featureCount}
            onChange={(e) => handleInputChange(e, 'features')}
            className="border px-3 py-2 rounded-lg w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-10"
            min="1"
            required
          />
        </div>

        {/* Dynamically render Feature Name Inputs based on featureCount */}
        {Array.from({ length: parseInt(formData.features.featureCount) }).map((_, index) => (
          <div key={index} className="space-y-4">
            {/* Feature Name Input */}
            <div className="space-y-1">
              <label className="text-lg font-medium text-gray-700">Feature Name {index + 1}</label>
              <input
                type="text"
                name="featureName"
                value={formData.features.featureData[index]?.featureName || ''}
                onChange={(e) => handleFeatureInputChange(e, index)}  // Update to use new handler
                className="border px-3 py-2 rounded-lg w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-10"
                required
              />
            </div>

            {/* Feature Image Input */}
            <div className="space-y-1">
              <label className="text-lg font-medium text-gray-700">Feature Image {index + 1}</label>
              <input
                type="file"
                name="featureImage"
                onChange={(e) => handleFeatureInputChange(e, index)}  // Update to use new handler
                className="border px-3 py-2 rounded-lg w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-10"
              />
              {formData.features.featureData[index]?.featureImage && (
                <img
                  src={URL.createObjectURL(formData.features.featureData[index]?.featureImage)}
                  alt={`Feature Image ${index + 1}`}
                  className="mt-2 max-w-full h-auto"
                />
              )}
            </div>
          </div>
        ))}

        {/* Submit and Cancel Buttons */}
        <div className="space-y-1">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Feature
          </button>
          <button
            type="button"
            onClick={() => closePopup('addFeature')}
            className="bg-gray-400 text-black px-4 py-2 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}




          
        </div>
      );
    },
  },

  // other columns...
];
