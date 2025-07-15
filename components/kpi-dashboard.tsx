"use client"

import { useState } from "react"
import {
  Calendar, Filter, RotateCcw, Package, Truck, Cloud,
  CheckCircle, AlertTriangle, Globe, Clock, Box,
  Warehouse, Ship, Plane, Train
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { DeliveryPieChart } from "@/components/delivery-pie-chart"
import { RevenueBarChart } from "@/components/revenue-bar-chart"
import { ExceptionPieChart } from "@/components/exception-pie-chart"
import { StatusDonutChart } from "@/components/status-donut-chart"
import { TrendBarChart } from "@/components/trend-bar-chart"
import { TransportTable } from "@/components/transport-table"

import { RegionalDistributionChart } from "@/components/regional-distribution-chart"
import { CarrierPerformanceChart } from "@/components/carrier-performance-chart"
import { ShipmentVolumeChart } from "@/components/shipment-volume-chart"
import Image from "next/image"

export function KPIDashboard() {
  const [dateRange, setDateRange] = useState("")
  const [region, setRegion] = useState("")
  const [carrier, setCarrier] = useState("")
  const [mode, setMode] = useState("")

  const handleApply = () => {
    console.log("Applying filters:", { dateRange, region, carrier, mode })
  }

  const handleReset = () => {
    setDateRange("")
    setRegion("")
    setCarrier("")
    setMode("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Grouping LocateWise + Logo */}
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
        </div>
      </div>


      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Filter Panel */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Date Range</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="date"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="pl-10 bg-white border-slate-300 w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Region</label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="bg-white border-slate-300 w-full">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="south-america">South America</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Carrier</label>
                  <Select value={carrier} onValueChange={setCarrier}>
                    <SelectTrigger className="bg-white border-slate-300 w-full">
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhl">DHL</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="maersk">Maersk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Mode</label>
                  <Select value={mode} onValueChange={setMode}>
                    <SelectTrigger className="bg-white border-slate-300 w-full">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air">Air</SelectItem>
                      <SelectItem value="ocean">Ocean</SelectItem>
                      <SelectItem value="rail">Rail</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700 text-white px-6 w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-slate-300 px-6 bg-transparent w-full sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />

                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Summary Cards - Expanded */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left Merged Card: Covers 4/5 columns */}
          <Card className="lg:col-span-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg transition-all duration-300 hover:shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">Total Shipments 44</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Delivered */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-600 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">Delivered</p>
                  <p className="text-xl font-bold text-green-900">5</p>
                  <p className="text-xs text-green-600">89% on time</p>
                </div>
              </div>

              {/* In Transit */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-600 rounded-xl">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">In Transit</p>
                  <p className="text-xl font-bold text-yellow-900">23</p>
                  <p className="text-xs text-yellow-600">12 expected today</p>
                </div>
              </div>

              {/* Delayed */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-600 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">Delayed</p>
                  <p className="text-xl font-bold text-red-900">16</p>
                  <p className="text-xs text-red-600">Avg delay: 2.3 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Card: Avg Transit Time */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6 h-full flex flex-col items-start justify-center">
              <div className="p-3 bg-purple-600 rounded-xl mb-2">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Avg Transit Time</p>
                <p className="text-2xl font-bold text-purple-900">45</p>
                <p className="text-xs text-purple-600">days (-0.5 from avg)</p>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* First Row of Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 hover:shadow-xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Delivery performance
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <RegionalDistributionChart />
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 hover:shadow-xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Box className="h-5 w-5 text-green-600" />
                Shipment Volume Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ShipmentVolumeChart />
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 hover:shadow-xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Truck className="h-5 w-5 text-yellow-600" />
                Carrier Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <CarrierPerformanceChart />
            </CardContent>
          </Card>
        </div>

        {/* Second Row of Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 hover:shadow-xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Delivery Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <DeliveryPieChart />
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 hover:shadow-xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-red-600" />
                Transport Mode Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Plane className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium">Air</p>
                  <p className="text-xl font-bold">32%</p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Ship className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium">Ocean</p>
                  <p className="text-xl font-bold">28%</p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Truck className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-sm font-medium">Truck</p>
                  <p className="text-xl font-bold">25%</p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Train className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium">Rail</p>
                  <p className="text-xl font-bold">15%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Third Row - Detailed Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">Revenue Impact</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 h-full">
              <div className="h-[250px]">
                <RevenueBarChart />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">Alert Reasons</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 h-full">
              <div className="h-[250px]">
                <ExceptionPieChart />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">Alert Status</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 h-full">
              <div className="h-[250px]">
                <StatusDonutChart />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 hover:shadow-xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">
                On-Time Delivery Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
              <TrendBarChart />
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 transition-all duration-300 hover:shadow-xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">Transport Lead Time Details</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] overflow-auto">
              <TransportTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}