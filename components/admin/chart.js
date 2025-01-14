import React, { useEffect } from "react";
import { Chart } from "chart.js";

export default function CardCharts() {
  useEffect(() => {
    // Line Chart Config
    const lineChartConfig = {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: new Date().getFullYear(),
            backgroundColor: "#3182ce",
            borderColor: "#3182ce",
            data: [65, 78, 66, 44, 56, 67, 75],
            fill: false,
          },
          {
            label: new Date().getFullYear() - 1,
            fill: false,
            backgroundColor: "#edf2f7",
            borderColor: "#edf2f7",
            data: [40, 68, 86, 74, 56, 60, 87],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Sales Charts",
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end", // Set the alignment to the end
          position: "bottom", // Move the legend to the bottom
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          x: {
            ticks: {
              fontColor: "rgba(255,255,255,.7)",
            },
            grid: {
              display: false,
              borderDash: [2],
              borderDashOffset: [2],
              color: "rgba(33, 37, 41, 0.3)",
            },
          },
          y: {
            ticks: {
              fontColor: "rgba(255,255,255,.7)",
            },
            grid: {
              borderDash: [3],
              color: "rgba(255, 255, 255, 0.15)",
            },
          },
        },
      },
    };

    // Pie Chart 1 Config
    const pieChart1Config = {
      type: "pie",
      data: {
        labels: [
          "Category 1",
          "Category 2",
          "Category 3",
          "Category 4",
          "Category 5",
        ],
        datasets: [
          {
            data: [200, 100, 300, 150, 250],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom", // Aligns the legend to the bottom
            labels: {
              fontColor: "white", // Changes the font color of the labels
            },
          },
          tooltip: {
            backgroundColor: "#333",
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
          },
        },
      },
    };

    // Pie Chart 2 Config
    const pieChart2Config = {
      type: "pie",
      data: {
        labels: [
          "Property 1",
          "Property 2",
          "Property 3",
          "Property 4",
          "Property 5",
        ],
        datasets: [
          {
            data: [500, 300, 400, 200, 600],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom", // Aligns the legend to the bottom
            labels: {
              fontColor: "white", // Changes the font color of the labels
            },
          },
          tooltip: {
            backgroundColor: "#333",
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
          },
        },
      },
    };

    // Create Line Chart
    const lineChartCanvas = document
      .getElementById("line-chart")
      .getContext("2d");
    const lineChart = new Chart(lineChartCanvas, lineChartConfig);

    // Create Pie Chart 1
    const pieChart1Canvas = document
      .getElementById("pie-chart1")
      .getContext("2d");
    const pieChart1 = new Chart(pieChart1Canvas, pieChart1Config);

    // Create Pie Chart 2
    const pieChart2Canvas = document
      .getElementById("pie-chart2")
      .getContext("2d");
    const pieChart2 = new Chart(pieChart2Canvas, pieChart2Config);

    return () => {
      // Cleanup charts when component unmounts
      if (lineChart) {
        lineChart.destroy();
      }
      if (pieChart1) {
        pieChart1.destroy();
      }
      if (pieChart2) {
        pieChart2.destroy();
      }
    };
  }, []);

  return (
    <div>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700 left-0">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                ADDED CLIENTS
              </h6>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Line Chart */}
          <div className="relative h-350-px">
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>

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
          <div className="p-4 flex-auto">
            {/* Pie Chart 1 */}
            <div className="relative h-350-px">
              <canvas id="pie-chart1"></canvas>
            </div>
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
          <div className="p-4 flex-auto">
            {/* Pie Chart 2 */}
            <div className="relative h-350-px">
              <canvas id="pie-chart2"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
