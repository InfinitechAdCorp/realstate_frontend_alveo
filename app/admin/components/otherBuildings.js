import { useState, useEffect } from "react";
import { FaFilePdf, FaFileExcel, FaPlus, FaEllipsisV } from "react-icons/fa";
import { showToast } from "@/components/alert/page";
import exportToPDF from "@/app/admin/components/export/exportPDF";
import exportToExcel from "@/app/admin/components/export/exportExcel";
import DataTable from "react-data-table-component";
import UpdateBuilding from "@/app/admin/components/modal/building/updateBuilding";
import AddBuilding from "@/app/admin/components/modal/building/addBuilding";

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
    fetchBuildings();
    fetchDevelopmentTypes(); // ✅ Fetch development types
  }, [properties]);

  useEffect(() => {
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
  }, [properties]);

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
      showToast("Failed to load buildings.", "error");
    }
  };

  const fetchDevelopmentTypes = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/admin/development-types`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch development types");

      const data = await response.json();
      setDevelopmentTypes(data);
    } catch (error) {
      showToast("Failed to load development types.", "error");
    }
  };

  const handleDeleteClick = (building) => {
    setSelectedBuilding(building);
    setIsDeleteModalOpen(true);
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
                  setSelectedBuilding(row);
                  setIsUpdateModalOpen(true);
                }}
              >
                Update
              </button>
              <button
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                onClick={() => handleDeleteClick(row)}
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
        {/* Title & Search Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="w-full md:w-auto">
            <h2 className="text-lg font-semibold">Other Buildings</h2>
            <input
              type="text"
              placeholder="Search by feature name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border rounded-md text-sm mt-2 md:mt-0"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2 md:mt-0">
            <button
              onClick={() => setIsAddBuildingOpen(true)}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 flex items-center w-full sm:w-auto"
            >
              <FaPlus className="mr-2" /> Add Building
            </button>
            <button
              onClick={() => exportToPDF("Buildings Report", filteredBuildings)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center w-full sm:w-auto"
            >
              <FaFilePdf className="mr-2" /> Export PDF
            </button>
            <button
              onClick={() =>
                exportToExcel("Buildings Report", filteredBuildings)
              }
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 flex items-center w-full sm:w-auto"
            >
              <FaFileExcel className="mr-2" /> Export Excel
            </button>
          </div>
        </div>

        {/* Data Table */}
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
        <AddBuilding
          isOpen={isAddBuildingOpen}
          closePopup={() => setIsAddBuildingOpen(false)}
          properties={properties}
          developmentTypes={developmentTypes}
          setBuildingData={setBuildings} // Pass state updater
        />
      )}

      {/* Update Building Modal */}
      {isUpdateModalOpen && selectedBuilding && (
        <UpdateBuilding
          isOpen={isUpdateModalOpen}
          closePopup={() => setIsUpdateModalOpen(false)}
          building={selectedBuilding}
          setBuildingData={setBuildings}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this building?
            </p>
            <p className="text-md font-medium text-gray-700 mb-6">
              <span className="block mb-2">
                Building Name: {selectedBuilding?.name}
              </span>
            </p>

            {/* Buttons with responsiveness */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 w-full sm:w-auto"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200 w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherBuildingsTable;
