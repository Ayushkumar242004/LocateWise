"use client"

import { useState } from "react"
import { Search, Package, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KPIDashboard } from "@/components/kpi-dashboard"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { RiskStackedBar } from "@/components/risk-stacked-bar"
import { ExceptionStackedBar } from "@/components/exception-stacked-bar"
import { WorldMap } from "@/components/world-map"
import { MultiSelect } from "@/components/multi-select"
import { useRouter } from "next/navigation"
import Image from "next/image"

const regions = [
  { value: "asia", label: "Asia" },
  { value: "europe", label: "Europe" },
  { value: "north-america", label: "North America" },
  { value: "south-america", label: "South America" },
  { value: "africa", label: "Africa" },
  { value: "oceania", label: "Oceania" },
]

const products = [
  { value: "Ocean", label: "Ocean" },
  { value: "Air", label: "Air" },
  { value: "Road", label: "Road" },
  { value: "Rail", label: "Rail" },
  
]

function DashboardContent() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["asia", "europe"])
  const [selectedProduct, setSelectedProduct] = useState<string>("Air")
  const [shipmentId, setShipmentId] = useState<string>("")
  const { state } = useSidebar()
   const [activeTab, setActiveTab] = useState<"overview" | "kpi">("overview")
 const router = useRouter()

 const handleRemoveRegion = (region: string) => {
    setSelectedRegions((prev) => prev.filter((r) => r !== region))
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex">
      
      <Sidebar className="border-r shadow-xl transition-all duration-300 ease-in-out w-[280px] xl:w-[320px] fixed h-full z-10">
        <SidebarHeader className="border-b bg-white/60 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-4">
           
            <div className="flex items-center space-x-3">
                         <Package className="h-6 w-6 text-blue-600" />
                         <h1 className="text-xl font-bold text-slate-800">LocateWise</h1>
                         <Image
                           src="/techM.png"
                           alt="TechMahindra Logo"
                           width={60}
                           height={40}
                           className="h-6 w-auto object-contain"
                           priority
                         />
                       </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-white/40 backdrop-blur-md h-[calc(100%-80px)] overflow-y-auto">
         <div className="px-4 py-4 border-b">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "overview"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white/60 text-slate-700 hover:bg-white/80"
                }`}
              >
                Overview
              </button>
              <button
               onClick={() => {
                  setActiveTab("kpi")
                  router.push("/kpi") // Add this line
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === "kpi"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white/60 text-slate-700 hover:bg-white/80"
                }`}
              >
                KPI Dashboard
              </button>
            </div>
          </div>
          <SidebarGroup className="px-4 py-4">
            <SidebarGroupLabel className="text-slate-800 font-semibold text-sm mb-3">Region Filter</SidebarGroupLabel>
            <SidebarGroupContent>
              <MultiSelect
                options={regions}
                selected={selectedRegions}
                onChange={setSelectedRegions}
                placeholder="Select regions..."
              />
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="px-4 py-4">
            <SidebarGroupLabel className="text-slate-800 font-semibold text-sm mb-3"> Transport Mode</SidebarGroupLabel>
            <SidebarGroupContent>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="bg-white/80 border-slate-300 shadow-sm">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.value} value={product.value}>
                      {product.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="px-4 py-4">
            <SidebarGroupLabel className="text-slate-800 font-semibold text-sm mb-3">Shipment ID</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  placeholder="Enter shipment ID..."
                  value={shipmentId}
                  onChange={(e) => setShipmentId(e.target.value)}
                  className="pl-10 bg-white/80 border-slate-300 shadow-sm"
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="px-4 py-4">
            <SidebarGroupLabel className="text-slate-800 font-semibold text-sm mb-3">Key Metrics</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Shipments In-transit</p>
                      <p className="text-3xl font-bold text-blue-900">128</p>
                    </div>
                    <Package className="h-10 w-10 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Value Impact</p>
                      <p className="text-3xl font-bold text-green-900">$1.2M</p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-800">Average Lead Time</p>
                      <p className="text-3xl font-bold text-orange-900">32 days</p>
                    </div>
                    <Clock className="h-10 w-10 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className="flex-1 ml-[100px] xl:ml-[80px] min-w-0">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6 shadow-sm sticky top-0 z-10">

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">LocateWise</h1>
            <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">
              Live Data
            </Badge>
          </div>
        </header>
       

        <div className="flex-1 p-6 space-y-6 max-w-[calc(100vw-280px)] xl:max-w-[calc(100vw-320px)]">
          {/* Top Two Horizontal Components - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk by Severity Card */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800 text-lg">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                  </div>
                  Risk Level
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Shipments categorized by risk level distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <RiskStackedBar />
              </CardContent>
            </Card>

            {/* Top Exception Reasons Card */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800 text-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  Delay Reasons
                </CardTitle>
                <CardDescription className="text-slate-600">Most common causes of shipment delays</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ExceptionStackedBar />
              </CardContent>
            </Card>
          </div>

          {/* World Map Section - Full Width Below */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 text-xl">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                Global Shipment Overview
              </CardTitle>
              <CardDescription className="text-slate-600">
                Real-time tracking of shipments across the globe with interactive route visualization
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 h-[600px] min-h-[400px]">
              <WorldMap selectedRegions={selectedRegions} selectedProduct={selectedProduct} shipmentId={shipmentId} onRemoveRegion={handleRemoveRegion}/>
            </CardContent>
          </Card>
        </div>
      </div>
      
    </div>
  )
}

export default function Dashboard() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  )
}