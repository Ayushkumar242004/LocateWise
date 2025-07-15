"use client"

const exceptionData = [
  { label: "In-transit Delay", value: 32, color: "#3b82f6", percentage: 34 },
  { label: "Port Strike", value: 28, color: "#8b5cf6", percentage: 30 },
  { label: "Bad Weather", value: 18, color: "#6b7280", percentage: 19 },
  { label: "Others", value: 15, color: "#06b6d4", percentage: 17 },
]

export function ExceptionStackedBar() {
  const total = exceptionData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      {/* Main Horizontal Stacked Bar */}
      <div className="relative">
        <div className="flex h-16 w-full overflow-hidden rounded-xl shadow-lg border-2 border-white/50">
          {exceptionData.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center justify-center text-white font-bold text-lg transition-all duration-500 hover:brightness-110 cursor-pointer relative group"
              style={{
                backgroundColor: item.color,
                width: `${item.percentage}%`,
                animation: `slideIn 0.8s ease-out ${index * 0.2}s both`,
              }}
            >
              <span className="drop-shadow-lg">{item.value}</span>

              {/* Hover Tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-10">
                <div className="text-center">
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-xs">
                    {item.value} cases ({Math.round((item.value / total) * 100)}%)
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {exceptionData.map((item, index) => (
          <div
            key={item.label}
            className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-slate-200 transition-all duration-300 hover:bg-white/80 hover:scale-105"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className="w-4 h-4 rounded-full shadow-sm border-2 border-white"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <div className="text-sm font-medium text-slate-800">{item.label}</div>
              <div className="text-xs text-slate-600">{item.value} cases</div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0%;
            opacity: 0;
          }
          to {
            width: ${exceptionData.map((item) => item.percentage + "%")};
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
