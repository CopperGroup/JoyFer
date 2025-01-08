'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, LineChart, Line, Tooltip, Legend } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Order {
  products: { product: string; amount: number }[];
  userId: string;
  value: number;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  paymentType: string;
  deliveryMethod: string;
  city: string;
  adress: string;
  postalCode: string;
  comment: string | undefined;
  paymentStatus: string;
  deliveryStatus: string;
  data: Date;
}

interface TimePeriod {
  dateName: string;
  orders: Order[];
  totalValue: number;
  totalOrders: number;
}

interface Stats {
  data: TimePeriod[];
  totalValue: number;
  totalOrders: number;
  totalProductsSold: number;
  averageOrderValue: number;
  mostPopularProduct: {
    name: string;
    id: string;
    searchParam: string;
    quantity: number;
  };
  percentageStats: {
    totalValue: number;
    totalOrders: number;
    totalProductsSold: number;
    averageOrderValue: number;
  };
  numericStats: {
    totalValue: number;
    totalOrders: number;
    totalProductsSold: number;
    averageOrderValue: number;
  };
}

interface Data {
  dayStats: Stats;
  weekStats: Stats;
  monthStats: Stats;
  threeMonthsStats: Stats;
  sixMonthsStats: Stats;
  yearStats: Stats;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
}

const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

const CustomTooltip = ({ active, payload, label, timePeriod }: any) => {
  if (active && payload && payload.length) {
    const data = timePeriod.data.find((item: TimePeriod) => item.dateName === label);
    return (
      <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
        <p className="font-bold">{label}</p>
        <p>Orders: {formatNumber(payload[0].value)}</p>
        <p>Revenue: {formatCurrency(data.totalValue)}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = ({ stringifiedData }: { stringifiedData: string }) => {
  const data: Data = JSON.parse(stringifiedData);
  const [timePeriod, setTimePeriod] = useState<Stats>(data.dayStats);
  const [previewMode, setPreviewMode] = useState<"Percentage" | "Numeric">("Percentage");

  const selectTimePeriod = (element: keyof Data) => {
    setTimePeriod(data[element]);
  };

  const statsCards = [
    { title: "Total Revenue", value: timePeriod.totalValue, icon: DollarSign, formatter: formatCurrency },
    { title: "Total Orders", value: timePeriod.totalOrders, icon: ShoppingCart, formatter: formatNumber },
    { title: "Products Sold", value: timePeriod.totalProductsSold, icon: Package, formatter: formatNumber },
    { title: "Avg. Order Value", value: timePeriod.averageOrderValue, icon: Users, formatter: formatCurrency },
  ];

  const chartConfig: ChartConfig = {
    totalOrders: {
      label: "Total Orders",
      color: "hsl(var(--chart-1))",
    },
    totalValue: {
      label: "Total Revenue",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="flex justify-between items-center mb-6">
          <Select onValueChange={(value) => selectTimePeriod(value as keyof Data)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dayStats">Day</SelectItem>
              <SelectItem value="weekStats">Week</SelectItem>
              <SelectItem value="monthStats">Month</SelectItem>
              <SelectItem value="threeMonthsStats">3 Months</SelectItem>
              <SelectItem value="sixMonthsStats">6 Months</SelectItem>
              <SelectItem value="yearStats">Year</SelectItem>
            </SelectContent>
          </Select>

          <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as "Percentage" | "Numeric")}>
            <TabsList>
              <TabsTrigger value="Percentage">Percentage</TabsTrigger>
              <TabsTrigger value="Numeric">Numeric</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const currentValue = previewMode === "Percentage" 
              ? timePeriod.percentageStats[stat.title.toLowerCase().replace(/\s/g, '') as keyof Stats['percentageStats']] 
              : timePeriod.numericStats[stat.title.toLowerCase().replace(/\s/g, '') as keyof Stats['numericStats']];
            const previousValue = previewMode === "Percentage" ? 0 : 0; // You might want to add previous period data to calculate actual change
            const percentageChange = calculatePercentageChange(currentValue, previousValue);

            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.formatter(currentValue)}</div>
                  <p className={`text-xs ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                    {percentageChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {Math.abs(percentageChange).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <BarChart
                    data={timePeriod.data}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dateName" />
                    <ChartTooltip content={<CustomTooltip timePeriod={timePeriod} />} />
                    <Bar dataKey="totalOrders" fill="var(--color-totalOrders)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={timePeriod.data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateName" />
                  <Tooltip content={<CustomTooltip timePeriod={timePeriod} />} />
                  <Legend />
                  <Line type="monotone" dataKey="totalValue" stroke="var(--color-totalValue)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Most Popular Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{timePeriod.mostPopularProduct.name}</h3>
                <p className="text-sm text-gray-500">Product ID: {timePeriod.mostPopularProduct.id}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatNumber(timePeriod.mostPopularProduct.quantity)}</p>
                <p className="text-sm text-gray-500">Units Sold</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

