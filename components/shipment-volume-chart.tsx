"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const data = [
  { week: "W15", volume: 120 },
  { week: "W18", volume: 150 },
  { week: "W21", volume: 140 },
  { week: "W24", volume: 130 },
  { week: "W27", volume: 160 },
]

export function ShipmentVolumeChart() {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="volume" radius={[4, 4, 0, 0]} fill="#6366f1">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
