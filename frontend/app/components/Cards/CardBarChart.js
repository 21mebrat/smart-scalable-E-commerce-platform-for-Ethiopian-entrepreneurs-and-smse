"use client";
import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function CardBarChart({ orderData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!orderData) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    const labels = orderData.map(item => item.month.trim());
    const currentYearData = orderData.map(item => item.current_year || 0);
    const previousYearData = orderData.map(item => item.previous_year || 0);

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: new Date().getFullYear(),
            backgroundColor: "#ed64a6",
            borderColor: "#ed64a6",
            data: currentYearData,
            fill: false,
            barThickness: 8,
          },
          {
            label: new Date().getFullYear() - 1,
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: previousYearData,
            fill: false,
            barThickness: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "rgba(0,0,0,.4)",
            },
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: "rgba(33, 37, 41, 0.3)",
            },
          },
          y: {
            display: true,
            grid: {
              color: "rgba(33, 37, 41, 0.2)",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [orderData]);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
              Performance
            </h6>
            <h2 className="text-blueGray-700 text-xl font-semibold">
              Total orders
            </h2>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-[350px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}












// "use client";
// import React, { useEffect, useRef } from "react";
// import { Chart, registerables } from "chart.js";

// Chart.register(...registerables);

// export default function CardBarChart() {
//   const chartRef = useRef(null);
//   const chartInstance = useRef(null);

//   useEffect(() => {
//     if (chartInstance.current) {
//       chartInstance.current.destroy();
//     }

//     const ctx = chartRef.current.getContext("2d");

//     chartInstance.current = new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: ["January", "February", "March", "April", "May", "June", "July"],
//         datasets: [
//           {
//             label: new Date().getFullYear(),
//             backgroundColor: "#ed64a6",
//             borderColor: "#ed64a6",
//             data: [30, 78, 56, 34, 100, 45, 13],
//             fill: false,
//             barThickness: 8,
//           },
//           {
//             label: new Date().getFullYear() - 1,
//             backgroundColor: "#4c51bf",
//             borderColor: "#4c51bf",
//             data: [27, 68, 86, 74, 10, 4, 87],
//             fill: false,
//             barThickness: 8,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           legend: {
//             position: "bottom",
//             labels: {
//               color: "rgba(0,0,0,.4)",
//             },
//           },
//         },
//         scales: {
//           x: {
//             display: true,
//             grid: {
//               color: "rgba(33, 37, 41, 0.3)",
//             },
//           },
//           y: {
//             display: true,
//             grid: {
//               color: "rgba(33, 37, 41, 0.2)",
//             },
//           },
//         },
//       },
//     });

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
//       <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
//         <div className="flex flex-wrap items-center">
//           <div className="relative w-full max-w-full flex-grow flex-1">
//             <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
//               Performance
//             </h6>
//             <h2 className="text-blueGray-700 text-xl font-semibold">
//               Total orders
//             </h2>
//           </div>
//         </div>
//       </div>
//       <div className="p-4 flex-auto">
//         <div className="relative h-[350px]">
//           <canvas ref={chartRef}></canvas>
//         </div>
//       </div>
//     </div>
//   );
// }
