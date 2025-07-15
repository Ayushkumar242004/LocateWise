"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Status categories with associated colors
const statusColors = {
  WIP: "#3b82f6",        // Blue
  Open: "#f59e0b",       // Amber
  Addressed: "#22c55e",  // Green
  Obsolete: "#ef4444",   // Red
};

const data = [
  { status: "WIP", WIP: 30 },
  { status: "Open", Open: 25 },
  { status: "Addressed", Addressed: 35 },
  { status: "Obsolete", Obsolete: 10 },
];

export function StatusDonutChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="status"
            tick={({ payload, x, y, textAnchor }) => {
              const color = statusColors[payload.value] || "#334155"; // default slate
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fill={color}
                  fontSize={12}
                  fontWeight={500}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 40]} />
          <Radar
            name="WIP"
            dataKey="WIP"
            stroke={statusColors.WIP}
            fill={statusColors.WIP}
            fillOpacity={0.4}
          />
          <Radar
            name="Open"
            dataKey="Open"
            stroke={statusColors.Open}
            fill={statusColors.Open}
            fillOpacity={0.4}
          />
          <Radar
            name="Addressed"
            dataKey="Addressed"
            stroke={statusColors.Addressed}
            fill={statusColors.Addressed}
            fillOpacity={0.4}
          />
          <Radar
            name="Obsolete"
            dataKey="Obsolete"
            stroke={statusColors.Obsolete}
            fill={statusColors.Obsolete}
            fillOpacity={0.4}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
