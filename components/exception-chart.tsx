"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"

const data = [
  { name: "Vessel Delay", value: 32, color: "#3b82f6" },
  { name: "Customs Delay", value: 28, color: "#8b5cf6" },
  { name: "Bad Weather", value: 18, color: "#6b7280" },
  { name: "Others", value: 15, color: "#06b6d4" },
]

export function ExceptionChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis axisLine={false} tickLine={false} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
