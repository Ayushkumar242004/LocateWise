"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@googlemaps/js-api-loader"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface WorldMapProps {
  selectedRegions: string[]
  selectedProduct: string
  shipmentId: string
  onRemoveRegion: (region: string) => void
}

interface ShipmentNode {
  id: string
  lat: number
  lng: number
  status: "delivered" | "delayed" | "blocked"
  location: string
  shipmentIds: string[]
  region: string
  transportMode: "Air" | "Ocean"
}

interface ShipmentDetail {
  id: string
  start: string
  destination: string
  status: "delivered" | "delayed" | "blocked"
  eta: string
  transportMode : string 
}

const shipmentNodes: ShipmentNode[] = [
  {
    id: "1",
    lat: 40.7128,
    lng: -74.0060,
    status: "delivered",
    location: "New York, USA",
    shipmentIds: ["SH001", "SH002", "SH018", "SH001-D", "SH001-L", "SH001-B"],
    region: "north-america",
    transportMode: "Air"
  },
  {
    id: "2",
    lat: 34.0522,
    lng: -118.2437,
    status: "delayed",
    location: "Los Angeles, USA",
    shipmentIds: ["SH003", "SH019", "SH002-D", "SH002-L", "SH002-B"],
    region: "north-america",
    transportMode: "Air"
  },
  {
    id: "3",
    lat: 51.5074,
    lng: -0.1278,
    status: "delivered",
    location: "London, UK",
    shipmentIds: ["SH004", "SH005", "SH020", "SH003-D", "SH003-L", "SH003-B"],
    region: "europe",
    transportMode: "Air"
  },
  {
    id: "4",
    lat: 53.5511,
    lng: 9.9937,
    status: "blocked",
    location: "Hamburg, Germany",
    shipmentIds: ["SH006", "SH021", "SH004-D", "SH004-L", "SH004-B"],
    region: "europe",
    transportMode: "Air"
  },
  {
    id: "5",
    lat: 41.0082,
    lng: 28.9784,
    status: "delayed",
    location: "Istanbul, Turkey",
    shipmentIds: ["SH007", "SH008", "SH022", "SH005-D", "SH005-L", "SH005-B"],
    region: "europe",
    transportMode: "Air"
  },
  {
    id: "6",
    lat: 19.0760,
    lng: 72.8777,
    status: "delivered",
    location: "Mumbai, India",
    shipmentIds: ["SH009", "SH023", "SH006-D", "SH006-L", "SH006-B"],
    region: "asia",
    transportMode: "Air"
  },
  {
    id: "7",
    lat: 31.2304,
    lng: 121.4737,
    status: "delayed",
    location: "Shanghai, China",
    shipmentIds: ["SH010", "SH011", "SH024", "SH007-D", "SH007-L", "SH007-B"],
    region: "asia",
    transportMode: "Air"
  },
  {
    id: "8",
    lat: 35.6762,
    lng: 139.6503,
    status: "delivered",
    location: "Tokyo, Japan",
    shipmentIds: ["SH012", "SH025", "SH008-D", "SH008-L", "SH008-B"],
    region: "asia",
    transportMode: "Air"
  },
  {
    id: "9",
    lat: 6.5244,
    lng: 3.3792,
    status: "blocked",
    location: "Lagos, Nigeria",
    shipmentIds: ["SH013", "SH014", "SH026", "SH009-D", "SH009-L", "SH009-B"],
    region: "africa",
    transportMode: "Air"
  },
  {
    id: "10",
    lat: -23.5505,
    lng: -46.6333,
    status: "delivered",
    location: "São Paulo, Brazil",
    shipmentIds: ["SH015", "SH027", "SH010-D", "SH010-L", "SH010-B"],
    region: "south-america",
    transportMode: "Air"
  },
  {
    id: "11",
    lat: -33.8688,
    lng: 151.2093,
    status: "delayed",
    location: "Sydney, Australia",
    shipmentIds: ["SH016", "SH017", "SH028", "SH011-D", "SH011-L", "SH011-B"],
    region: "oceania",
    transportMode: "Air"
  },
]


const generateShipmentDetails = (node: ShipmentNode): ShipmentDetail[] => {
  const statuses: ("delivered" | "delayed" | "blocked")[] = ["delivered", "delayed", "blocked"]
  const cities = [
    "New York", "Los Angeles", "London", "Hamburg", "Istanbul", 
    "Mumbai", "Shanghai", "Tokyo", "Lagos", "São Paulo", "Sydney"
  ]
  
  return node.shipmentIds.map((id, index) => {
    const otherCities = cities.filter(city => 
      !node.location.toLowerCase().includes(city.toLowerCase())
    )
    const randomCity = otherCities[Math.floor(Math.random() * otherCities.length)]
    
    const useNodeAsStart = Math.random() > 0.5
    const start = useNodeAsStart 
      ? node.location 
      : `${randomCity}, ${randomCity === "New York" || randomCity === "Los Angeles" ? "USA" : 
         randomCity === "London" ? "UK" : 
         randomCity === "Hamburg" ? "Germany" :
         randomCity === "Istanbul" ? "Turkey" :
         randomCity === "Mumbai" ? "India" :
         randomCity === "Shanghai" || randomCity === "Tokyo" ? "China" :
         randomCity === "Lagos" ? "Nigeria" :
         randomCity === "São Paulo" ? "Brazil" : "Australia"}`
    
    const destination = useNodeAsStart
  ? `${randomCity}, ${
      randomCity === "New York" || randomCity === "Los Angeles"
        ? "USA"
        : randomCity === "London"
        ? "UK"
        : randomCity === "Hamburg"
        ? "Germany"
        : randomCity === "Istanbul"
        ? "Turkey"
        : randomCity === "Mumbai"
        ? "India"
        : randomCity === "Shanghai"
        ? "China"
        : randomCity === "Tokyo"
        ? "Japan"
        : randomCity === "Lagos"
        ? "Nigeria"
        : randomCity === "São Paulo"
        ? "Brazil"
        : "Australia"
    }`
  : node.location

    
    const useNodeStatus = Math.random() > 0.3
    const status = useNodeStatus ? node.status : statuses[index % statuses.length]
    
    const days = Math.floor(Math.random() * 10) + 1
    const etaDate = new Date()
    etaDate.setDate(etaDate.getDate() + days)
    
    const eta = status === "delivered" 
      ? "Delivered"
      : status === "blocked"
      ? "On Hold"
      : `${etaDate.toLocaleDateString()}`
    
    const transportMode = Math.random() < 0.8 ? "Air" : "Ocean"  

    return {
      id,
      start,
      destination,
      status,
      eta, 
      transportMode
    }
  })
}

const routes = [
  { from: "1", to: "3" },
  { from: "2", to: "4" },
  { from: "3", to: "5" },
  { from: "4", to: "6" },
  { from: "5", to: "6" },
  { from: "6", to: "7" },
  { from: "7", to: "8" },
  { from: "3", to: "9" },
  { from: "1", to: "10" },
  { from: "7", to: "11" },
]

export function WorldMap({ selectedRegions, selectedProduct, shipmentId, onRemoveRegion }: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const polylinesRef = useRef<google.maps.Polyline[]>([])
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([])
  const [activeNodesCount, setActiveNodesCount] = useState(0)
  const [showFilters, setShowFilters] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [showStats, setShowStats] = useState(true)

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "delivered": return "#22c55e"
      case "delayed": return "#eab308"
      case "blocked": return "#ef4444"
      default: return "#6b7280"
    }
  }, [])

  const getStatusLabel = useCallback((status: string) => {
    switch (status) {
      case "delivered": return "On-time"
      case "delayed": return "Delayed"
      case "blocked": return "major-delay"
      default: return "Unknown"
    }
  }, [])

  const filteredNodes = useCallback(() => {
    return shipmentNodes.filter((node) => {
      if (selectedRegions.length > 0 && !selectedRegions.includes(node.region)) {
        return false
      }
      if (shipmentId && !node.shipmentIds.some((id) => id.toLowerCase().includes(shipmentId.toLowerCase()))) {
        return false
      }
      return true
    })
  }, [selectedRegions, shipmentId])

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
    })

    loader.load().then(() => {
      if (mapRef.current && !mapInstance.current) {
        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 0 },
          zoom: 2,
          styles: [
            {
              featureType: "landscape",
              stylers: [{ hue: "#00FF00" }, { saturation: -50 }, { lightness: 50 }],
            },
            {
              featureType: "water",
              stylers: [{ color: "#dbeafe" }],
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [{ color: "#9ca3af" }, { weight: 1 }],
            },
          ],
          disableDefaultUI: false,
          zoomControl: true,
          scrollwheel: false,
          gestureHandling: "cooperative",
        })

        mapInstance.current = newMap
        updateMapMarkersAndRoutes()
      }
    })

    return () => {
      if (mapInstance.current) {
        clearMapElements()
        mapInstance.current = null
      }
    }
  }, [])

  const clearMapElements = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    
    polylinesRef.current.forEach(line => line.setMap(null))
    polylinesRef.current = []
    
    infoWindowsRef.current.forEach(window => window.close())
    infoWindowsRef.current = []
  }, [])

  const updateMapMarkersAndRoutes = useCallback(() => {
    if (!mapInstance.current) return

    clearMapElements()
    const currentNodes = filteredNodes()
    setActiveNodesCount(currentNodes.length)

    currentNodes.forEach((node) => {
      const marker = new google.maps.Marker({
        position: { lat: node.lat, lng: node.lng },
        map: mapInstance.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#ffffff",
          fillOpacity: 1,
          strokeColor: getStatusColor(node.status),
          strokeWeight: 2,
          scale: 8,
        },
        title: node.location,
      })

      const shipmentDetails = generateShipmentDetails(node)
      
      const statusCounts = shipmentDetails.reduce((acc, detail) => {
        acc[detail.status] = (acc[detail.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const pieData = [
        { name: "On-Time", value: statusCounts.delivered || 0, color: "#22c55e" },
        { name: "Delayed", value: statusCounts.delayed || 0, color: "#eab308" },
        { name: "major-delay", value: statusCounts.blocked || 0, color: "#ef4444" },
      ].filter(item => item.value > 0)

      const total = pieData.reduce((sum, item) => sum + item.value, 0)
      let cumulativePercent = 0

      const infoWindowContent = document.createElement("div")
infoWindowContent.className = "min-w-[1000px]" // Increased width
infoWindowContent.innerHTML = `
  <div class="flex justify-between items-center mb-4">
    <h3 class="font-bold text-xl">${node.location}</h3>
    <div class="flex items-center gap-1">
      <div class="w-3 h-3 rounded-full" style="background-color: ${getStatusColor(node.status)}"></div>
      <span class="text-sm">${getStatusLabel(node.status)}</span>
    </div>
  </div>
  <div class="flex gap-6">
    <div class="w-1/3">
      <h4 class="font-semibold text-sm mb-4 text-center">Shipment Status</h4>
      <div class="h-64 flex flex-col items-center">
        ${total > 0 ? (() => {
          cumulativePercent = 0 // reset for pie slices
          const pieSlices = pieData.map((entry) => {
            const startPercent = cumulativePercent
            cumulativePercent += entry.value / total
            const endPercent = cumulativePercent
            const startAngle = startPercent * 2 * Math.PI
            const endAngle = endPercent * 2 * Math.PI
            const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0
            const startX = 100 + Math.sin(startAngle) * 80
            const startY = 100 - Math.cos(startAngle) * 80
            const endX = 100 + Math.sin(endAngle) * 80
            const endY = 100 - Math.cos(endAngle) * 80
            const pathData = [
              `M 100 100`,
              `L ${startX} ${startY}`,
              `A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `Z`
            ].join(' ')
            return `<path d="${pathData}" fill="${entry.color}" stroke="#fff" stroke-width="1"/>`
          }).join('')

          // Reset for label positions
          cumulativePercent = 0
          const labels = pieData.map((entry) => {
            const midPercent = cumulativePercent + (entry.value / total) / 2
            const angle = midPercent * 2 * Math.PI
            const x = 100 + Math.sin(angle) * 50
            const y = 100 - Math.cos(angle) * 50
            cumulativePercent += entry.value / total
            return `
              <text 
                x="${x}" 
                y="${y}" 
                text-anchor="middle" 
                dominant-baseline="central"
                fill="#333"
                font-size="12"
              >
                ${entry.value}
              </text>`
          }).join('')

          return `
            <svg width="200" height="200" viewBox="0 0 200 200">
              ${pieSlices}
              ${labels}
            </svg>
            <div class="flex gap-4 mt-4">
              ${pieData.map(entry => `
                <div class="flex items-center gap-1">
                  <div class="w-3 h-3 rounded-full" style="background-color: ${entry.color}"></div>
                  <span class="text-xs">${entry.name}</span>
                </div>
              `).join('')}
            </div>`
        })() : `
          <div class="flex items-center justify-center h-full text-gray-400">
            No shipment data available
          </div>
        `}
      </div>
    </div>
    <div class="w-2/3">
      <h4 class="font-semibold text-sm mb-2">Shipment Details</h4>
      <div class="overflow-y-auto max-h-64">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transport mode</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${shipmentDetails.map((detail, index) => `
              <tr key="${detail.id}" class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">${detail.id}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${detail.start}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${detail.destination}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm" style="color: ${getStatusColor(detail.status)}">${getStatusLabel(detail.status)}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${detail.transportMode}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${detail.eta}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
`



      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent,
        maxWidth: 650,
      })

      marker.addListener("click", () => {
        infoWindowsRef.current.forEach(window => window.close())
        infoWindow.open(mapInstance.current, marker)
      })

      marker.addListener("mouseover", () => {
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#ffffff",
          fillOpacity: 1,
          strokeColor: getStatusColor(node.status),
          strokeWeight: 3,
          scale: 10,
        })
      })

      marker.addListener("mouseout", () => {
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#ffffff",
          fillOpacity: 1,
          strokeColor: getStatusColor(node.status),
          strokeWeight: 2,
          scale: 8,
        })
      })

      markersRef.current.push(marker)
      infoWindowsRef.current.push(infoWindow)
    })

    routes.forEach((route) => {
      const fromNode = currentNodes.find(n => n.id === route.from)
      const toNode = currentNodes.find(n => n.id === route.to)
      
      if (fromNode && toNode) {
        const line = new google.maps.Polyline({
          path: [
            { lat: fromNode.lat, lng: fromNode.lng },
            { lat: toNode.lat, lng: toNode.lng },
          ],
          geodesic: true,
          strokeColor: "#3b82f6",
          strokeOpacity: 0.7,
          strokeWeight: 2,
          strokeDashArray: [10, 5],
          map: mapInstance.current,
        })

        polylinesRef.current.push(line)
      }
    })

    if (currentNodes.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      currentNodes.forEach(node => {
        bounds.extend(new google.maps.LatLng(node.lat, node.lng))
      })
      
      mapInstance.current.fitBounds(bounds, {
        top: 50, right: 50, bottom: 50, left: 50
      })
      
      if (currentNodes.length === 1) {
        mapInstance.current.setZoom(5)
      }
    } else {
      mapInstance.current.setCenter({ lat: 20, lng: 0 })
      mapInstance.current.setZoom(2)
    }
  }, [filteredNodes, getStatusColor, getStatusLabel, clearMapElements])

  useEffect(() => {
    updateMapMarkersAndRoutes()
  }, [selectedRegions, selectedProduct, shipmentId, updateMapMarkersAndRoutes])

  return (
    <div
      className="relative rounded-xl overflow-hidden border-2 border-white/50 shadow-inner"
      style={{ width: "1000px", height: "600px", minWidth: "1000px", minHeight: "600px", maxWidth: "1000px", maxHeight: "600px" }}
    >
      <div ref={mapRef} className="w-full h-full" />

      {showLegend && (
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-2xl border-2 border-white/50 z-10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-slate-800">Shipment Status</h4>
            <button
              onClick={() => setShowLegend(false)}
              className="text-slate-400 hover:text-slate-700 transition-colors text-xl"
              aria-label="Close"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-lg"></div>
              <span className="font-medium text-slate-700">Delivered</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-white shadow-lg"></div>
              <span className="font-medium text-slate-700">Delayed</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-lg"></div>
              <span className="font-medium text-slate-700">Blocked</span>
            </div>
          </div>
        </div>
      )}

      {showFilters && (selectedRegions.length > 0 || selectedProduct || shipmentId) && (
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-2xl border-2 border-white/50 max-w-sm z-10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold text-slate-800">Active Filters</h4>
            <button
              onClick={() => setShowFilters(false)}
              className="text-slate-400 hover:text-slate-700 transition-colors text-xl"
              aria-label="Close"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            {selectedRegions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Regions:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRegions.map((region) => (
                    <Badge
                      key={region}
                      variant="outline"
                      className="text-xs capitalize bg-blue-50 text-blue-800 border-blue-200"
                    >
                      {region.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {selectedProduct && (
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Product:</p>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-800 border-green-200">
                  {selectedProduct}
                </Badge>
              </div>
            )}
            {shipmentId && (
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Shipment ID:</p>
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-800 border-purple-200">
                  {shipmentId}
                </Badge>
              </div>
            )}
          </div>
        </div>
      )}

      {showStats && (
        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border-2 border-white/50 z-10">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-slate-600">Active Nodes</p>
            <button
              onClick={() => setShowStats(false)}
              className="text-slate-400 hover:text-slate-700 transition-colors text-xl"
              aria-label="Close"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{activeNodesCount}</p>
            <p className="text-xs text-slate-500">nodes displayed</p>
          </div>
        </div>
      )}
    </div>
  )
}