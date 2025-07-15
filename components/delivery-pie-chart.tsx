"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Delivery Performance",
    onTime: 50,
    delayed: 25,
    majorDelayed: 25,
  },
];

const COLORS = {
  onTime: "#3b82f6",       // Blue
  delayed: "#f59e0b",      // Amber
  majorDelayed: "#ef4444", // Dark Red
};

export function DeliveryPieChart() {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip />
          <Bar dataKey="onTime" stackId="a" fill={COLORS.onTime} radius={[6, 0, 0, 6]} />
          <Bar dataKey="delayed" stackId="a" fill={COLORS.delayed} />
          <Bar dataKey="majorDelayed" stackId="a" fill={COLORS.majorDelayed} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 flex justify-between text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span>On-Time: 50%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded" />
          <span>Delayed: 25%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span>Major Delayed: 25%</span>
        </div>
      </div>
    </div>
  );
}
