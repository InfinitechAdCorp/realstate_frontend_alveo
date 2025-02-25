import { useState, useEffect } from "react";
import { FaFilePdf, FaFileExcel, FaPlus, FaEllipsisV } from "react-icons/fa";
import { showToast } from "@/components/alert/page";
import exportToPDF from "@/app/test/components/export/exportPDF";
import exportToExcel from "@/app/test/components/export/exportExcel";
import DataTable from "react-data-table-component";
import UpdateBuilding from "@/app/test/components/modal/building/updateBuilding";
import AddBuilding from "@/app/test/components/modal/building/addBuilding";
const OtherBuildingsTable = ({ properties, loading }) => {
  const [buildings, setBuildings] = useState([]);
  const [developmentTypes, setDevelopmentTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    console.log("Received properties:", properties);
    fetchBuildings();
    fetchDevelopmentTypes(); // ✅ Fetch development types
  }, [properties]);

  useEffect(() => {
    // ✅ Ensure property name stays updated when properties change
    setBuildings((prevBuildings) =>
      prevBuildings.map((building) => {
        const matchedProperty = properties.find(
          (prop) => prop.id === building.property_id
        );
        return {
          ...building,
          property_name: matchedProperty ? matchedProperty.name : "Unknown",
        };
      })
    );
  }, [properties]); // ✅ Re-run when properties list changes

  const fetchBuildings = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/buildings`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      console.log("Fetched buildings:", data);

      // ✅ Always update property names dynamically
      setBuildings(
        data.map((building) => {
          const matchedProperty = properties.find(
            (prop) => prop.id === building.property_id
          );
          return {
            ...building,
            property_name: matchedProperty ? matchedProperty.name : "Unknown",
          };
        })
      );
    } catch (error) {
      console.error("Failed to fetch buildings:", error);
      showToast("Failed to load buildings.", "error");
    }
  };

  // ✅ Fetch Development Types with Token
  const fetchDevelopmentTypes = async () => {
    const token = localStorage.getItem("auth_token"); // ✅ Get token
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/development-types`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Include token in headers
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch development types");

      const data = await response.json();
      console.log("Fetched development types:", data);
      setDevelopmentTypes(data); // ✅ Store in state
    } catch (error) {
      console.error("Failed to fetch development types:", error);
      showToast("Failed to load development types.", "error");
    }
  };

  const handleDeleteClick = (building) => {
    setSelectedBuilding(building);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateClick = (building) => {
    setSelectedBuilding(building);
    setIsUpdateModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBuilding) return;

    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/deletebuilding`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: [selectedBuilding.id] }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setBuildings((prevBuildings) =>
          prevBuildings.filter(
            (building) => building.id !== selectedBuilding.id
          )
        );
        showToast(data.message || "Building deleted successfully!", "success");
        setIsDeleteModalOpen(false);
      } else {
        showToast(data.message || "Failed to delete building.", "error");
      }
    } catch (error) {
      showToast("Error occurred while deleting building.", "error");
    }
  };

  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      name: "Property Name",
      selector: (row) => row.property_name,
      sortable: true,
    },
    { name: "Building Name", selector: (row) => row.name, sortable: true },

    {
      name: "Development Type",
      selector: (row) => row.development_type,
      sortable: true,
    },
    {
      name: "Residential Levels",
      selector: (row) => row.residential_levels,
      sortable: true,
    },
    {
      name: "Basement Parking",
      selector: (row) => row.basement_parking_levels || "N/A",
      sortable: true,
    },
    {
      name: "Podium Parking",
      selector: (row) => row.podium_parking_levels || "N/A",
      sortable: true,
    },
    {
      name: "Commercial Units",
      selector: (row) => row.commercial_units || "N/A",
      sortable: true,
    },
    {
      name: "Lower Ground Parking",
      selector: (row) => row.lower_ground_floor_parking_levels || "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="relative">
          <button
            onClick={() =>
              setIsActionMenuOpen(isActionMenuOpen === row.id ? null : row.id)
            }
            className="text-gray-600 hover:text-gray-800"
          >
            <FaEllipsisV />
          </button>
          {isActionMenuOpen === row.id && (
            <div className="absolute right-0 bg-white border shadow-md rounded-md w-32 z-50">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                onClick={() => {
                  handleUpdateClick(row); // Open update modal
                  console.log(row);
                  setIsActionMenuOpen(null);
                }}
              >
                Update
              </button>
              <button
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                onClick={() => {
                  handleDeleteClick(row);
                  setIsActionMenuOpen(null);
                }}
              >
                Delete
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
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="bg-white shadow-md p-4 rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold">Buildings</h2>
          </div>

          <div className="flex gap-3 mt-2 md:mt-0">
            <button
              onClick={() => setIsAddBuildingOpen(true)}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Building
            </button>
            <button
              onClick={() => exportToPDF("Buildings Report", buildings)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <button
              onClick={() => exportToExcel("Buildings Report", buildings)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFileExcel className="mr-2" /> Export Excel
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredBuildings}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15]}
          highlightOnHover
          responsive
          striped
        />
      </div>
      {isAddBuildingOpen && (
        <AddBuilding
          isOpen={isAddBuildingOpen}
          closePopup={() => setIsAddBuildingOpen(false)}
          properties={properties}
          developmentTypes={developmentTypes}
          setBuildingData={setBuildings} // ✅ Pass state updater
        />
      )}

      {isUpdateModalOpen && selectedBuilding && (
        <UpdateBuilding
          isOpen={isUpdateModalOpen}
          closePopup={() => setIsUpdateModalOpen(false)}
          building={selectedBuilding}
          setBuildingData={setBuildings}
        />
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this building?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherBuildingsTable;
