"use client";

import { Plane, Ship, Train, Truck } from "lucide-react";

const transportData = [
  {
    metric: "Transport Lead Time Details",
    air: "4 days",
    ocean: "19 days",
    rail: "12 days",
    truck: "7 days",
  },
  {
    metric: "Average Delay",
    air: "1.2 days",
    ocean: "3.5 days",
    rail: "2.1 days",
    truck: "1.8 days",
  },
  {
    metric: "Missed SLA %",
    air: "8%",
    ocean: "15%",
    rail: "12%",
    truck: "10%",
  },
];

export function TransportTable() {
  return (
    <div className="grid gap-4 h-auto">
      {transportData.map((row, idx) => (
        <div
          key={idx}
          className="rounded-lg border bg-white shadow-sm p-4 transition hover:shadow-md"
        >
          <h3 className="text-md font-semibold text-slate-800 mb-3">
            {row.metric}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Air:</span> {row.air}
            </div>
            <div className="flex items-center gap-2">
              <Ship className="h-4 w-4 text-blue-800" />
              <span className="font-medium">Ocean:</span> {row.ocean}
            </div>
            <div className="flex items-center gap-2">
              <Train className="h-4 w-4 text-green-600" />
              <span className="font-medium">Rail:</span> {row.rail}
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-orange-600" />
              <span className="font-medium">Truck:</span> {row.truck}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
