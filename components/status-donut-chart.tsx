"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "WIP", value: 30, color: "#3b82f6" },
  { name: "Open", value: 25, color: "#f59e0b" },
  { name: "Addressed", value: 35, color: "#22c55e" },
  { name: "Obsolete", value: 10, color: "#ef4444" }
]

export function StatusDonutChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

