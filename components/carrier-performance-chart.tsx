"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

const data = [
  { name: "FedEx", value: 0.7, color: "#3b82f6" },
  { name: "DHL", value: 0.6, color: "#10b981" },
  { name: "UPS", value: 0.8, color: "#f59e0b" },
  { name: "BlueDart", value: 0.5, color: "#ef4444" },
]

export function CarrierPerformanceChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${v * 100}%`} />
          <YAxis type="category" dataKey="name" width={100} fontSize={12} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
