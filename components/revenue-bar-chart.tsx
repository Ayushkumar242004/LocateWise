"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Cost Impact", value: 0.15, color: "#3b82f6" },
  { name: "Revenue Saved", value: 0.8, color: "#1e40af" },
];

export function RevenueBarChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }} // left: 0
        >
          <XAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={(v) => `$${v}M`}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={80} // reduced from 120
            fontSize={12}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

   
    </div>
  );
}
