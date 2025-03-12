import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
  FaFilePdf,
  FaFileExcel,
  FaPlus,
  FaEllipsisV,
  FaTrash,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import exportToPDF from "@/app/admin/components/export/exportPDF";
import exportToExcel from "@/app/admin/components/export/exportExcel";
import AddFacility from "@/app/admin/components/modal/facility/addFacility";
import UpdateFacility from "@/app/admin/components/modal/facility/updateFacility";
import { showToast } from "@/components/alert/page";

const FacilitiesTable = ({ properties, loading }) => {
  const [groupedFacilities, setGroupedFacilities] = useState({});
  const [isAddFacilityOpen, setIsAddFacilityOpen] = useState(false);
  const [isUpdateFacilityOpen, setIsUpdateFacilityOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // Confirmation state

  useEffect(() => {
    const fetchFacilities = async () => {
      setFetching(true);
      const token = localStorage.getItem("auth_token");

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/facilities`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch facilities");

        const data = await response.json();
        console.log("Fetched Facilities Data:", data);

        // ✅ Ensure facility names are stored correctly
        const grouped = data.reduce((acc, facility) => {
          // ✅ Try to find the corresponding property in the `properties` list
          const property = properties.find(
            (prop) => prop.id === facility.property_id
          );

          const propertyId = property ? property.id : facility.property_id; // ✅ Ensure ID comes from properties first
          const propertyName = property ? property.name : "Unknown"; // ✅ Ensure the name comes from properties

          if (!acc[propertyId]) {
            acc[propertyId] = {
              property_id: propertyId, // ✅ Now correctly assigned from `properties`
              property_name: propertyName,
              facilities: [],
            };
          }

          acc[propertyId].facilities.push(facility.name);
          return acc;
        }, {});

        setGroupedFacilities(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };

    fetchFacilities();
  }, [properties]);

  if (fetching) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Convert object to array before filtering
  const filteredFacilities = Object.values(groupedFacilities).filter(
    (property) =>
      property.property_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleDeleteClick = (propertyId, propertyName) => {
    console.log("Delete Clicked:", propertyId, propertyName);
    setConfirmDelete({ propertyId, propertyName });
  };
  const confirmDeletion = async () => {
    if (!confirmDelete) return;

    const { propertyId, propertyName } = confirmDelete;
    const token = localStorage.getItem("auth_token");

    console.log("Deleting:", propertyId, propertyName);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/deletefacility`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: [propertyId] }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast(
          `All facilities under ${propertyName} deleted successfully!`,
          "success"
        );

        // ✅ Update the state **immediately** to remove the deleted entry
        setGroupedFacilities((prev) => {
          const updatedFacilities = { ...prev };
          delete updatedFacilities[propertyId]; // ✅ Ensures an immediate UI update
          return { ...updatedFacilities }; // ✅ React detects the state change
        });
      } else {
        showToast(data.message || "Failed to delete facilities.", "error");
      }
    } catch (error) {
      showToast("Error deleting facilities.", "error");
    } finally {
      setConfirmDelete(null);
    }
  };
  const onSubmit = ({ propertyId, facilities }) => {
    // Update the facilities list in the state, ensuring no duplicates
    setGroupedFacilities((prevGroupedFacilities) => {
      const updatedGroupedFacilities = { ...prevGroupedFacilities };

      // Check if the property already exists
      if (updatedGroupedFacilities[propertyId]) {
        // Add the new facilities to the existing ones, ensuring no duplicates
        updatedGroupedFacilities[propertyId].facilities = [
          ...new Set([
            ...updatedGroupedFacilities[propertyId].facilities, // Existing facilities
            ...facilities, // New facilities
          ]),
        ];
      } else {
        // If the property doesn't exist, add the new property and facilities
        updatedGroupedFacilities[propertyId] = {
          property_id: propertyId,
          property_name: facilities[0], // Assuming the first facility is the property name
          facilities: facilities,
        };
      }

      return updatedGroupedFacilities;
    });

    showToast("Facility added successfully!", "success");
  };

  const handleUpdateClick = (property) => {
    setSelectedFacility(property);
    setIsUpdateFacilityOpen(true);
  };

  const toggleExpand = (propertyName) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.has(propertyName)
        ? newSet.delete(propertyName)
        : newSet.add(propertyName);
      return newSet;
    });
  };

  const columns = [
    {
      name: "Property Name",
      selector: (row) => row.property_name,
      sortable: true,
    },
    {
      name: "Facility Names",
      cell: (row) => {
        const isExpanded = expandedRows.has(row.property_name);
        const displayedFacilities = isExpanded
          ? row.facilities.join("\n- ") // Show as a list when expanded
          : row.facilities.slice(0, 2).join(" • "); // Show first 2 facilities when collapsed

        return (
          <div className="text-sm">
            <div className="whitespace-pre-line">{displayedFacilities}</div>
            {row.facilities.length > 2 && (
              <button
                className="text-blue-500 text-xs mt-1 underline"
                onClick={() => toggleExpand(row.property_name)}
              >
                {isExpanded ? "See Less" : "See More"}
              </button>
            )}
          </div>
        );
      },
      sortable: false,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="relative">
          <button
            onClick={() =>
              setIsActionMenuOpen(
                isActionMenuOpen === row.property_name
                  ? null
                  : row.property_name
              )
            }
            className="text-gray-600 hover:text-gray-800"
          >
            <FaEllipsisV />
          </button>
          {isActionMenuOpen === row.property_name && (
            <div className="fixed right-4 bg-white shadow-md rounded-md w-24 mr-16 -mt-10 z-50">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  handleUpdateClick(row);
                  setIsActionMenuOpen(null);
                }}
              >
                Update
              </button>
              <button
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 flex items-center gap-2"
                onClick={() =>
                  handleDeleteClick(row.property_id, row.property_name)
                }
              >
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];
  return (
    <div className="p-4">
      <div className="bg-white shadow-md p-4 rounded-md">
        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                Delete Confirmation
              </h3>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Are you sure you want to delete the following facilities?
              </p>
              <p className="text-md font-medium text-gray-700 mb-6 text-center">
                <span className="block mb-2">
                  Property: {confirmDelete.propertyName}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                <button
                  onClick={confirmDeletion}
                  className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 w-full sm:w-auto"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-5 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200 w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header & Search Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold">Facilities</h2>
            <input
              type="text"
              placeholder="Search by property name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border rounded-md text-sm mt-2 md:mt-0"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2 md:mt-0">
            <button
              onClick={() => setIsAddFacilityOpen(true)}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center w-full sm:w-auto"
            >
              <FaPlus className="mr-2" /> Add Facility
            </button>
            <button
              onClick={() =>
                exportToPDF("Facilities Report", filteredFacilities)
              }
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center w-full sm:w-auto"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <button
              onClick={() =>
                exportToExcel("Facilities Report", filteredFacilities)
              }
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center w-full sm:w-auto"
            >
              <FaFileExcel className="mr-2" /> Export Excel
            </button>
          </div>
        </div>

        {/* Facilities Data Table */}
        <DataTable
          columns={columns}
          data={filteredFacilities}
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>

      {/* Add Facility Modal */}
      {isAddFacilityOpen && (
        <AddFacility
          isOpen={isAddFacilityOpen}
          closePopup={() => setIsAddFacilityOpen(false)}
          facilitiesData={groupedFacilities}
          onSubmit={onSubmit}
          properties={properties}
        />
      )}

      {/* Update Facility Modal */}
      {isUpdateFacilityOpen && selectedFacility && (
        <UpdateFacility
          isOpen={isUpdateFacilityOpen}
          closePopup={() => setIsUpdateFacilityOpen(false)}
          facility={selectedFacility}
          setFacilities={setGroupedFacilities}
        />
      )}
    </div>
  );
};

export default FacilitiesTable;
