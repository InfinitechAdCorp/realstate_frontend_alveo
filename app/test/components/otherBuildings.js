import { useState, useEffect } from "react";
import { FaFilePdf, FaFileExcel, FaPlus, FaEllipsisV } from "react-icons/fa";
import { showToast } from "@/components/alert/page";
import exportToPDF from "@/app/test/components/export/exportPDF";
import exportToExcel from "@/app/test/components/export/exportExcel";
import DataTable from "react-data-table-component"; // Using react-data-table-component

const OtherBuildingsTable = () => {
  const [buildings, setBuildings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch buildings from the API
  const fetchBuildings = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/buildings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Add token to the Authorization header
          },
        }
      );
      const data = await response.json();
      setBuildings(data); // Set buildings data
    } catch (error) {
      console.error("Failed to fetch buildings:", error);
      showToast("Failed to load buildings.", "error");
    }
  };

  useEffect(() => {
    fetchBuildings(); // Fetch buildings on component mount
  }, []);

  const handleExportPDF = () => {
    if (buildings.length === 0) {
      console.error("No data available for export.");
      return;
    }

    const exportData = buildings.map((building) => ({
      Name: building.name,
      DevelopmentType: building.development_type,
      ResidentialLevels: building.residential_levels,
      BasementParking: building.basement_parking_levels || "N/A",
      PodiumParking: building.podium_parking_levels || "N/A",
      CommercialUnits: building.commercial_units || "N/A",
      LowerGroundParking: building.lower_ground_floor_parking_levels || "N/A",
    }));

    exportToPDF("Buildings Report", exportData);
  };

  const handleExportExcel = () => {
    if (buildings.length === 0) {
      console.error("No data available for export.");
      return;
    }

    const exportData = buildings.map((building) => ({
      name: building.name,
      development_type: building.development_type,
      residential_levels: building.residential_levels,
      basement_parking_levels: building.basement_parking_levels || "N/A",
      podium_parking_levels: building.podium_parking_levels || "N/A",
      commercial_units: building.commercial_units || "N/A",
      lower_ground_floor_parking_levels:
        building.lower_ground_floor_parking_levels || "N/A",
    }));

    exportToExcel("Buildings Report", exportData);
  };

  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
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
                  setSelectedBuilding(row); // Open update modal
                  setIsActionMenuOpen(null);
                }}
              >
                Update
              </button>
              <button
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                onClick={() => {
                  setSelectedBuilding(row);
                  setIsDeleteModalOpen(true);
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

  return (
    <div className="h-full overflow-y-auto mt-10 p-4 font-thin">
      <div className="bg-white shadow-md p-4 rounded-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold">Buildings</h2>
            <input
              type="text"
              placeholder="Search by building name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border rounded-md text-sm mt-2 md:mt-0"
            />
          </div>

          <div className="flex gap-3 mt-2 md:mt-0">
            <button
              onClick={() => setIsAddBuildingOpen(true)} // Opens the Add Building modal
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Building
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <button
              onClick={handleExportExcel}
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

      {/* Add Building Modal */}
      {isAddBuildingOpen && (
        <AddPropertyModal
          isOpen={isAddBuildingOpen}
          closePopup={setIsAddBuildingOpen} // Pass setIsAddBuildingOpen function
        />
      )}

      {/* Delete Confirmation Modal */}
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
