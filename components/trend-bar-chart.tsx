"use client"

import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

const data = [
  { week: "M1", deliveries: 45, onTimePercent: 85 },
  { week: "M2", deliveries: 52, onTimePercent: 78 },
  { week: "M3", deliveries: 38, onTimePercent: 92 },
  { week: "M4", deliveries: 61, onTimePercent: 88 },
  { week: "M5", deliveries: 49, onTimePercent: 95 },
]

export function TrendBarChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="week" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Legend />
          <Bar yAxisId="left" dataKey="deliveries" fill="#3b82f6" name="Deliveries" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="onTimePercent"
            stroke="#22c55e"
            strokeWidth={3}
            name="On-Time %"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
