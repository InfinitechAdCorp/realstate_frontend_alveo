import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";

export default function CardCharts(data) {
  const [requestViewingData, setRequestViewingData] = useState([]);
  const [propertyInquiryData, setPropertyInquiryData] = useState([]);
  const [submtitedProperty, setSubmittedProperty] = useState([]);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    console.log("Data received in CardCharts:", data);

    if (data.data === true) {
      const token = localStorage.getItem("auth_token");
      const log = localStorage.getItem("isLoggedIn");

      console.log("Token:", token, "Login status:", log);

      // Check if the token exists and if the user is logged in
      if (!token || log !== "true") {
        console.error("Token not found or user not logged in.");
        setError("Token not found or user not logged in.");
        return;
      }

      // Check if data is already fetched, if so, skip fetching
      if (fetched) return; // `fetched` is a state variable to track fetching status

      const fetchData = async (endpoint, setState) => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_PORT}/api/${endpoint}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            setState(Array.isArray(data) ? data : []);
          } else {
            console.error(`Error fetching ${endpoint} data:`, data);
            setError(data.error || "An error occurred while fetching data.");
          }
        } catch (error) {
          console.error(`Error fetching ${endpoint} data:`, error);
          setError("An error occurred while fetching data.");
        }
      };

      // Fetch data if user is logged in
      if (log === "true") {
        setFetched(true); // Set `fetched` to true to prevent re-fetching
        fetchData("count-properties-monthly", setSubmittedProperty);
        fetchData("count-request-viewing", setRequestViewingData);
        fetchData("count-property-inquiry", setPropertyInquiryData);
      }
    }
  }, [data, fetched]); // Add `fetched` as a dependency to prevent multiple fetches

  const getPieChartData = (data) => {
    // Make sure data is an array before mapping
    return Array.isArray(data)
      ? data.map((item) => ({
          name: item.property,
          value: item.total,
        }))
      : []; // Return an empty array if data is invalid
  };

  const getStackedAreaChartData = () => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const currentYearData = Array(12).fill(0);
    const lastYearData = Array(12).fill(0);

    submtitedProperty.forEach((entry) => {
      const { year, month, total } = entry;
      if (year === currentYear) {
        currentYearData[month - 1] = total; // month - 1 for zero-based index
      }
      if (year === lastYear) {
        lastYearData[month - 1] = total;
      }
    });

    return [
      {
        name: "January",
        currentYear: currentYearData[0],
        lastYear: lastYearData[0],
      },
      {
        name: "February",
        currentYear: currentYearData[1],
        lastYear: lastYearData[1],
      },
      {
        name: "March",
        currentYear: currentYearData[2],
        lastYear: lastYearData[2],
      },
      {
        name: "April",
        currentYear: currentYearData[3],
        lastYear: lastYearData[3],
      },
      {
        name: "May",
        currentYear: currentYearData[4],
        lastYear: lastYearData[4],
      },
      {
        name: "June",
        currentYear: currentYearData[5],
        lastYear: lastYearData[5],
      },
      {
        name: "July",
        currentYear: currentYearData[6],
        lastYear: lastYearData[6],
      },
      {
        name: "August",
        currentYear: currentYearData[7],
        lastYear: lastYearData[7],
      },
      {
        name: "September",
        currentYear: currentYearData[8],
        lastYear: lastYearData[8],
      },
      {
        name: "October",
        currentYear: currentYearData[9],
        lastYear: lastYearData[9],
      },
      {
        name: "November",
        currentYear: currentYearData[10],
        lastYear: lastYearData[10],
      },
      {
        name: "December",
        currentYear: currentYearData[11],
        lastYear: lastYearData[11],
      },
    ];
  };

  return (
    <div className="">
      {/* Pie Chart 1 */}
      <div className="flex">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700 left-0 mt-6">
          <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full max-w-full flex-grow flex-1">
                <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                  Most Property Inquired
                </h6>
              </div>
            </div>
          </div>
          <div className="p-4 flex justify-center items-center">
            {/* Pie Chart 1 */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={getPieChartData(propertyInquiryData)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                >
                  {propertyInquiryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart 2 */}
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700 left-0 mt-6">
          <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full max-w-full flex-grow flex-1">
                <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                  Most Viewed Property
                </h6>
              </div>
            </div>
          </div>
          <div className="p-4 flex justify-center items-center">
            {/* Pie Chart 2 */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={getPieChartData(requestViewingData)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {requestViewingData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700 left-0">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                INSERTED CLIENT PROPERTY
              </h6>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Stacked Area Chart */}
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={getStackedAreaChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <RechartsLegend />
              <Area
                type="monotone"
                dataKey="currentYear"
                stackId="1"
                stroke="#3182ce"
                fill="#3182ce"
              />
              <Area
                type="monotone"
                dataKey="lastYear"
                stackId="1"
                stroke="#edf2f7"
                fill="#edf2f7"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
