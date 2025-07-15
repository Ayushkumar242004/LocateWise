"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@googlemaps/js-api-loader"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface WorldMapProps {
  selectedRegions: string[]
  selectedTransport: string // Changed from selectedProduct
  shipmentId: string
  onRemoveRegion: (region: string) => void
}

interface ShipmentNode {
  id: string
  lat: number
  lng: number
  status: "On-time" | "delayed" | "major-delay"
  location: string
  shipments: ShipmentDetail[]
  region: string
  transportMode: "Air" | "Ocean"
}

interface ShipmentDetail {
  id: string
  start: string
  destination: string
  status: "On-time" | "delayed" | "major-delay"
  eta: string
  transportMode: string
  product?: string
}

const shipmentNodes: ShipmentNode[] = [
  {
    id: "1",
    lat: 40.7128,
    lng: -74.0060,
    status: "delayed",
    location: "New York, USA",
    region: "north-america",
    transportMode: "Air",
    shipments: [
      { id: "SH001", start: "New York, USA", destination: "London, UK", status: "On-time", eta: "2023-06-15", transportMode: "Air", product: "Electronics"},
      { id: "SH002", start: "New York, USA", destination: "Tokyo, Japan", status: "delayed", eta: "2023-06-18", transportMode: "Air", product: "Pharmaceuticals"},
      { id: "SH101", start: "New York, USA", destination: "Paris, France", status: "On-time", eta: "2023-06-19", transportMode: "Air", product: "Textiles"},
      { id: "SH102", start: "New York, USA", destination: "Berlin, Germany", status: "major-delay", eta: "On Hold", transportMode: "Air", product: "Machinery"},
      { id: "SH018", start: "Shanghai, China", destination: "New York, USA", status: "On-time", eta: "2023-06-20", transportMode: "Air", product: "Automotive Parts"}
    ]
  },
  {
    id: "2",
    lat: 34.0522,
    lng: -118.2437,
    status: "major-delay",
    location: "Los Angeles, USA",
    region: "north-america",
    transportMode: "Air",
    shipments: [
      { id: "SH003", start: "Los Angeles, USA", destination: "Sydney, Australia", status: "delayed", eta: "2023-06-22", transportMode: "Air", product: "Consumer Goods"},
      { id: "SH104", start: "Los Angeles, USA", destination: "Munich, Germany", status: "On-time", eta: "2023-06-23", transportMode: "Air", product: "Pharma"},
      { id: "SH019", start: "Hamburg, Germany", destination: "Los Angeles, USA", status: "major-delay", eta: "On Hold", transportMode: "Air", product: "Industrial Equipment"},
      { id: "SH105", start: "Los Angeles, USA", destination: "Dubai, UAE", status: "On-time", eta: "2023-06-24", transportMode: "Air", product: "Clothing"},
      { id: "SH106", start: "Los Angeles, USA", destination: "Singapore", status: "On-time", eta: "2023-07-01", transportMode: "Air", product: "Electronics"}
    ]
  },
  {
    id: "3",
    lat: 51.5074,
    lng: -0.1278,
    status: "On-time",
    location: "London, UK",
    region: "europe",
    transportMode: "Air",
    shipments: [
      { id: "SH004", start: "London, UK", destination: "New York, USA", status: "On-time", eta: "2023-06-14", transportMode: "Air", product: "Financial Documents"},
      { id: "SH005", start: "London, UK", destination: "Istanbul, Turkey", status: "delayed", eta: "2023-06-16", transportMode: "Air", product: "Textiles"},
      { id: "SH103", start: "London, UK", destination: "Rome, Italy", status: "major-delay", eta: "On Hold", transportMode: "Air", product: "Medical Equipment"},
      { id: "SH107", start: "London, UK", destination: "Cairo, Egypt", status: "On-time", eta: "2023-06-25", transportMode: "Air", product: "Agricultural Products"},
      { id: "SH020", start: "São Paulo, Brazil", destination: "London, UK", status: "On-time", eta: "2023-06-25", transportMode: "Air", product: "Tech Components"}
    ]
  },
  {
    id: "4",
    lat: 53.5511,
    lng: 9.9937,
    status: "major-delay",
    location: "Hamburg, Germany",
    region: "europe",
    transportMode: "Air",
    shipments: [
      { id: "SH006", start: "Hamburg, Germany", destination: "Los Angeles, USA", status: "major-delay", eta: "On Hold", transportMode: "Air", product: "Automotive Vehicles"},
      { id: "SH021", start: "Mumbai, India", destination: "Hamburg, Germany", status: "delayed", eta: "2023-06-28", transportMode: "Air", product: "Textiles"},
      { id: "SH108", start: "Hamburg, Germany", destination: "Amsterdam, NL", status: "On-time", eta: "2023-07-02", transportMode: "Air", product: "Food"},
      { id: "SH109", start: "Hamburg, Germany", destination: "Vienna, Austria", status: "On-time", eta: "2023-07-05", transportMode: "Air", product: "Tech Goods"},
      { id: "SH110", start: "Hamburg, Germany", destination: "London, UK", status: "delayed", eta: "2023-07-10", transportMode: "Air", product: "Pharma"}
    ]
  },
  {
    id: "5",
    lat: 41.0082,
    lng: 28.9784,
    status: "On-time",
    location: "Istanbul, Turkey",
    region: "europe",
    transportMode: "Air",
    shipments: [
      { id: "SH007", start: "Istanbul, Turkey", destination: "Mumbai, India", status: "On-time", eta: "2023-06-19", transportMode: "Air", product: "Electronics"},
      { id: "SH008", start: "Istanbul, Turkey", destination: "Lagos, Nigeria", status: "delayed", eta: "2023-06-17", transportMode: "Air", product: "Construction Materials"},
      { id: "SH022", start: "Tokyo, Japan", destination: "Istanbul, Turkey", status: "major-delay", eta: "2023-06-21", transportMode: "Air", product: "Electronics"},
      { id: "SH111", start: "Istanbul, Turkey", destination: "Moscow, Russia", status: "On-time", eta: "2023-07-03", transportMode: "Air", product: "Food"},
      { id: "SH112", start: "Istanbul, Turkey", destination: "Singapore", status: "delayed", eta: "2023-07-13", transportMode: "Air", product: "Machinery"}
    ]
  },
  {
    id: "6",
    lat: 19.0760,
    lng: 72.8777,
    status: "delayed",
    location: "Mumbai, India",
    region: "asia",
    transportMode: "Air",
    shipments: [
      { id: "SH009", start: "Mumbai, India", destination: "Shanghai, China", status: "On-time", eta: "2023-06-16", transportMode: "Air", product: "Petroleum Products"},
      { id: "SH023", start: "London, UK", destination: "Mumbai, India", status: "delayed", eta: "2023-06-18", transportMode: "Air", product: "Pharmaceuticals"},
      { id: "SH113", start: "Mumbai, India", destination: "Paris, France", status: "On-time", eta: "2023-07-18", transportMode: "Air", product: "Textiles"},
      { id: "SH114", start: "Mumbai, India", destination: "Tokyo, Japan", status: "major-delay", eta: "On Hold", transportMode: "Air", product: "Glassware"},
      { id: "SH115", start: "Mumbai, India", destination: "Cape Town, SA", status: "On-time", eta: "2023-07-10", transportMode: "Air", product: "Fruit"}
    ]
  },
  {
    id: "7",
    lat: 31.2304,
    lng: 121.4737,
    status: "On-time",
    location: "Shanghai, China",
    region: "asia",
    transportMode: "Air",
    shipments: [
      { id: "SH010", start: "Shanghai, China", destination: "Tokyo, Japan", status: "On-time", eta: "2023-06-20", transportMode: "Air", product: "Electronics"},
      { id: "SH011", start: "Shanghai, China", destination: "Sydney, Australia", status: "delayed", eta: "2023-06-22", transportMode: "Air", product: "Consumer Goods"},
      { id: "SH024", start: "Los Angeles, USA", destination: "Shanghai, China", status: "On-time", eta: "2023-06-25", transportMode: "Air", product: "Agricultural Products"},
      { id: "SH116", start: "Shanghai, China", destination: "Bangkok, Thailand", status: "On-time", eta: "2023-06-28", transportMode: "Air", product: "Textiles"},
      { id: "SH117", start: "Shanghai, China", destination: "Mumbai, India", status: "major-delay", eta: "On Hold", transportMode: "Air", product: "Jewelry"}
    ]
  },
  {
    id: "8",
    lat: 35.6762,
    lng: 139.6503,
    status: "major-delay",
    location: "Tokyo, Japan",
    region: "asia",
    transportMode: "Air",
    shipments: [
      { id: "SH012", start: "Tokyo, Japan", destination: "New York, USA", status: "On-time", eta: "2023-06-17", transportMode: "Air", product: "Automotive Parts"},
      { id: "SH025", start: "Sydney, Australia", destination: "Tokyo, Japan", status: "delayed", eta: "2023-06-19", transportMode: "Air", product: "Agricultural Products"},
      { id: "SH118", start: "Tokyo, Japan", destination: "Berlin, Germany", status: "major-delay", eta: "On Hold", transportMode: "Air", product: "Medical Devices"},
      { id: "SH119", start: "Tokyo, Japan", destination: "Mumbai, India", status: "On-time", eta: "2023-07-12", transportMode: "Air", product: "Consumer Electronics"},
      { id: "SH120", start: "Tokyo, Japan", destination: "Seoul, South Korea", status: "On-time", eta: "2023-07-14", transportMode: "Air", product: "Consumer Goods"}
    ]
  },
  {
    id: "9",
    lat: 6.5244,
    lng: 3.3792,
    status: "On-time",
    location: "Lagos, Nigeria",
    region: "africa",
    transportMode: "Air",
    shipments: [
      { id: "SH013", start: "Lagos, Nigeria", destination: "London, UK", status: "delayed", eta: "On Hold", transportMode: "Air", product: "Petroleum Products"},
      { id: "SH014", start: "Lagos, Nigeria", destination: "Hamburg, Germany", status: "On-time", eta: "2023-06-30", transportMode: "Air", product: "Agricultural Products"},
      { id: "SH026", start: "São Paulo, Brazil", destination: "Lagos, Nigeria", status: "major-delay", eta: "2023-06-24", transportMode: "Air", product: "Construction Materials"},
      { id: "SH121", start: "Lagos, Nigeria", destination: "Paris, France", status: "On-time", eta: "2023-07-20", transportMode: "Air", product: "Fruit"},
      { id: "SH122", start: "Lagos, Nigeria", destination: "Nairobi, Kenya", status: "On-time", eta: "2023-08-01", transportMode: "Air", product: "Textiles"}
    ]
  },
  {
    id: "10",
    lat: -23.5505,
    lng: -46.6333,
    status: "major-delay",
    location: "São Paulo, Brazil",
    region: "south-america",
    transportMode: "Air",
    shipments: [
      { id: "SH015", start: "São Paulo, Brazil", destination: "Miami, USA", status: "On-time", eta: "2023-06-15", transportMode: "Air", product: "Agricultural Products"},
      { id: "SH027", start: "Shanghai, China", destination: "São Paulo, Brazil", status: "On-time", eta: "2023-06-27", transportMode: "Air", product: "Electronics"},
      { id: "SH123", start: "São Paulo, Brazil", destination: "Accra, Ghana", status: "major-delay", eta: "On Hold", transportMode: "Air", product: "Tech Goods"},
      { id: "SH124", start: "São Paulo, Brazil", destination: "Dubai, UAE", status: "delayed", eta: "2023-07-30", transportMode: "Air", product: "Machinery"},
      { id: "SH125", start: "São Paulo, Brazil", destination: "Bogota, Colombia", status: "On-time", eta: "2023-07-29", transportMode: "Air", product: "Textiles"}
    ]
  },
  {
    id: "11",
    lat: -33.8688,
    lng: 151.2093,
    status: "delayed",
    location: "Sydney, Australia",
    region: "oceania",
    transportMode: "Air",
    shipments: [
      { id: "SH016", start: "Sydney, Australia", destination: "Tokyo, Japan", status: "delayed", eta: "2023-06-21", transportMode: "Ocean", product: "Agricultural Products"},
      { id: "SH017", start: "Sydney, Australia", destination: "Los Angeles, USA", status: "major-delay", eta: "2023-06-18", transportMode: "Air", product: "Pharmaceuticals"},
      { id: "SH028", start: "London, UK", destination: "Sydney, Australia", status: "On-time", eta: "On Hold", transportMode: "Ocean", product: "Industrial Equipment"},
      { id: "SH126", start: "Sydney, Australia", destination: "Singapore", status: "On-time", eta: "2023-07-10", transportMode: "Air", product: "Tech Goods"},
      { id: "SH127", start: "Sydney, Australia", destination: "Auckland, NZ", status: "On-time", eta: "2023-07-12", transportMode: "Air", product: "Agricultural Products"}
    ]
  }
];


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

export function WorldMap({ selectedRegions, selectedTransport, shipmentId, onRemoveRegion }: WorldMapProps) {
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
      case "On-time": return "#22c55e"
      case "delayed": return "#eab308"
      case "major-delay": return "#ef4444"
      default: return "#6b7280"
    }
  }, [])

  const getStatusLabel = useCallback((status: string) => {
    switch (status) {
      case "On-time": return "On-time"
      case "delayed": return "Delayed"
      case "major-delay": return "Major Delay"
      default: return "Unknown"
    }
  }, [])

  const filteredNodes = useCallback(() => {
  return shipmentNodes.filter((node) => {
    // Filter by region
    if (selectedRegions.length > 0 && !selectedRegions.includes(node.region)) {
      return false
    }
    
    // Filter by shipment ID
    if (shipmentId && !node.shipments.some(s => s.id.toLowerCase().includes(shipmentId.toLowerCase()))) {
      return false
    }
    
    // Filter by transport mode
    if (selectedTransport && !node.shipments.some(s => s.transportMode.toLowerCase().includes(selectedTransport.toLowerCase()))) {
      return false
    }
    
    return true
  })
}, [selectedRegions, selectedTransport, shipmentId]) // Changed from selectedProduct

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
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        { visibility: "on" },
        { color: "#000000" },
        { weight: 1 }
      ]
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }]
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }]
    }
  ],
  disableDefaultUI: true,
  zoomControl: true,
  scrollwheel: false,
  gestureHandling: "cooperative",
});


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

      const shipmentDetails = node.shipments
      
      const statusCounts = shipmentDetails.reduce((acc, detail) => {
        acc[detail.status] = (acc[detail.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const pieData = [
        { name: "On-Time", value: statusCounts["On-time"] || 0, color: "#22c55e" },
        { name: "Delayed", value: statusCounts.delayed || 0, color: "#eab308" },
        { name: "Major Delay", value: statusCounts["major-delay"] || 0, color: "#ef4444" },
      ].filter(item => item.value > 0)

      const total = pieData.reduce((sum, item) => sum + item.value, 0)
      let cumulativePercent = 0

      const infoWindowContent = document.createElement("div")
      infoWindowContent.className = "min-w-[1000px]"
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
                cumulativePercent = 0
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
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment ID</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transport</th>
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
  }, [selectedRegions, selectedTransport , shipmentId, updateMapMarkersAndRoutes])

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
              <span className="font-medium text-slate-700">On-time</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-5 h-5 rounded-full bg-yellow-500 border-2 border-white shadow-lg"></div>
              <span className="font-medium text-slate-700">Delayed</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-lg"></div>
              <span className="font-medium text-slate-700">Major Delay</span>
            </div>
          </div>
        </div>
      )}

      {showFilters && (selectedRegions.length > 0 || selectedTransport || shipmentId) && (
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
      {selectedTransport && (
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">Transport:</p>
          <Badge variant="outline" className="text-xs bg-green-50 text-green-800 border-green-200">
            {selectedTransport}
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