"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@googlemaps/js-api-loader"
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
}

const shipmentNodes: ShipmentNode[] = [
  {
    id: "1",
    lat: 40.7128,
    lng: -74.0060,
    status: "delivered",
    location: "New York, USA",
    shipmentIds: ["SH001", "SH002"],
    region: "north-america",
  },
  {
    id: "2",
    lat: 34.0522,
    lng: -118.2437,
    status: "delayed",
    location: "Los Angeles, USA",
    shipmentIds: ["SH003"],
    region: "north-america",
  },
  {
    id: "3",
    lat: 51.5074,
    lng: -0.1278,
    status: "delivered",
    location: "London, UK",
    shipmentIds: ["SH004", "SH005"],
    region: "europe",
  },
  {
    id: "4",
    lat: 53.5511,
    lng: 9.9937,
    status: "blocked",
    location: "Hamburg, Germany",
    shipmentIds: ["SH006"],
    region: "europe",
  },
  {
    id: "5",
    lat: 41.0082,
    lng: 28.9784,
    status: "delayed",
    location: "Istanbul, Turkey",
    shipmentIds: ["SH007", "SH008"],
    region: "europe",
  },
  {
    id: "6",
    lat: 19.0760,
    lng: 72.8777,
    status: "delivered",
    location: "Mumbai, India",
    shipmentIds: ["SH009"],
    region: "asia",
  },
  {
    id: "7",
    lat: 31.2304,
    lng: 121.4737,
    status: "delayed",
    location: "Shanghai, China",
    shipmentIds: ["SH010", "SH011"],
    region: "asia",
  },
  {
    id: "8",
    lat: 35.6762,
    lng: 139.6503,
    status: "delivered",
    location: "Tokyo, Japan",
    shipmentIds: ["SH012"],
    region: "asia",
  },
  {
    id: "9",
    lat: 6.5244,
    lng: 3.3792,
    status: "blocked",
    location: "Lagos, Nigeria",
    shipmentIds: ["SH013", "SH014"],
    region: "africa",
  },
  {
    id: "10",
    lat: -23.5505,
    lng: -46.6333,
    status: "delivered",
    location: "São Paulo, Brazil",
    shipmentIds: ["SH015"],
    region: "south-america",
  },
  {
    id: "11",
    lat: -33.8688,
    lng: 151.2093,
    status: "delayed",
    location: "Sydney, Australia",
    shipmentIds: ["SH016", "SH017"],
    region: "oceania",
  },
]

const routes = [
  { from: "1", to: "3" }, // NY to London
  { from: "2", to: "4" }, // LA to Hamburg
  { from: "3", to: "5" }, // London to Istanbul
  { from: "4", to: "6" }, // Hamburg to Mumbai
  { from: "5", to: "6" }, // Istanbul to Mumbai
  { from: "6", to: "7" }, // Mumbai to Shanghai
  { from: "7", to: "8" }, // Shanghai to Tokyo
  { from: "3", to: "9" }, // London to Lagos
  { from: "1", to: "10" }, // NY to São Paulo
  { from: "7", to: "11" }, // Shanghai to Sydney
]

export function WorldMap({ selectedRegions, selectedProduct, shipmentId,onRemoveRegion }: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const polylinesRef = useRef<google.maps.Polyline[]>([])
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([])
  const [activeNodesCount, setActiveNodesCount] = useState(0)
const [showFilters, setShowFilters] = useState(true) // <-- Add this line
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
      case "delivered": return "Delivered"
      case "delayed": return "Delayed"
      case "blocked": return "Blocked"
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
          scrollwheel: false, // Disable scroll zoom for slower zooming
          gestureHandling: "cooperative", // Makes zooming less sensitive
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
    // Clear all existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    
    // Clear all existing polylines
    polylinesRef.current.forEach(line => line.setMap(null))
    polylinesRef.current = []
    
    // Close all info windows
    infoWindowsRef.current.forEach(window => window.close())
    infoWindowsRef.current = []
  }, [])

  const updateMapMarkersAndRoutes = useCallback(() => {
    if (!mapInstance.current) return

    clearMapElements()
    const currentNodes = filteredNodes()
    setActiveNodesCount(32)

    // Create markers for filtered nodes
    currentNodes.forEach((node) => {
      const marker = new google.maps.Marker({
        position: { lat: node.lat, lng: node.lng },
        map: mapInstance.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: getStatusColor(node.status),
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 8,
        },
        title: node.location,
      })

      // Create info window for each marker
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2 min-w-[200px]">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-4 h-4 rounded-full" style="background-color: ${getStatusColor(node.status)}"></div>
              <h3 class="font-bold text-lg">${node.location}</h3>
            </div>
            <div class="text-sm mb-2">
              <span class="font-semibold">Status:</span> ${getStatusLabel(node.status)}
            </div>
            <div class="text-sm">
              <p class="font-semibold">Shipments (${node.shipmentIds.length}):</p>
              <div class="flex flex-wrap gap-1 mt-1">
                ${node.shipmentIds.map(id => `<span class="text-xs px-2 py-1 bg-blue-100 rounded-full">${id}</span>`).join('')}
              </div>
            </div>
          </div>
        `,
      })

      // Add click listener to show info window
      marker.addListener("click", () => {
        // Close all other info windows first
        infoWindowsRef.current.forEach(window => window.close())
        infoWindow.open(mapInstance.current, marker)
      })

      // Add hover effects
      marker.addListener("mouseover", () => {
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: getStatusColor(node.status),
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
          scale: 10,
        })
      })

      marker.addListener("mouseout", () => {
        marker.setIcon({
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: getStatusColor(node.status),
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 8,
        })
      })

      markersRef.current.push(marker)
      infoWindowsRef.current.push(infoWindow)
    })

    // Create dashed routes between nodes
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

    // Fit map to bounds of all markers
    if (currentNodes.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      currentNodes.forEach(node => {
        bounds.extend(new google.maps.LatLng(node.lat, node.lng))
      })
      
      // Add padding to the bounds
      mapInstance.current.fitBounds(bounds, {
        top: 50, right: 50, bottom: 50, left: 50
      })
      
      // Don't zoom in too much if only one point
      if (currentNodes.length === 1) {
        mapInstance.current.setZoom(5)
      }
    } else {
      // Default view if no nodes
      mapInstance.current.setCenter({ lat: 20, lng: 0 })
      mapInstance.current.setZoom(2)
    }
  }, [filteredNodes, getStatusColor, getStatusLabel, clearMapElements])

  // Update markers and routes when filters change
  useEffect(() => {
    updateMapMarkersAndRoutes()
  }, [selectedRegions, selectedProduct, shipmentId, updateMapMarkersAndRoutes])

  return (
    <div
      className="relative rounded-xl overflow-hidden border-2 border-white/50 shadow-inner"
      style={{ width: "1000px", height: "600px", minWidth: "1000px", minHeight: "600px", maxWidth: "1000px", maxHeight: "600px" }}
    >
      {/* Google Maps Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Enhanced Legend */}
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

      {/* Active Filters Display */}
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

      {/* Live Stats Overlay */}
      {showStats && (
        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border-2 border-white/50 z-10">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-slate-600">Active Routes</p>
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