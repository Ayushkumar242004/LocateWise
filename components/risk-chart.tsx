"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"

const data = [
  { name: "High Risk", value: 23, color: "#ef4444" },
  { name: "Medium Risk", value: 45, color: "#f97316" },
  { name: "Low Risk", value: 60, color: "#22c55e" },
]

export function RiskChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={80} fontSize={12} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
