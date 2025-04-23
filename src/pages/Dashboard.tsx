
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { useAuth } from "@/hooks/useAuth";

const mockSummary = [
  { title: "Usuarios activos", value: 24 },
  { title: "Pacientes", value: 136 },
  { title: "Registros clínicos", value: 234 },
];

const chartData = [
  { name: "Ene", value: 40 },
  { name: "Feb", value: 55 },
  { name: "Mar", value: 30 },
  { name: "Abr", value: 90 },
  { name: "May", value: 70 },
];

const chartConfig = {
  visitas: { label: "Visitas", color: "#0ea5e9" }
};

const MonthlyVisitsBarChart = () => (
  <ChartContainer config={chartConfig}>
    {({ ResponsiveContainer, BarChart, XAxis, YAxis, Bar }: any) => (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="value" fill="#0ea5e9" name="visitas" />
          <ChartTooltip />
          <ChartLegend />
        </BarChart>
      </ResponsiveContainer>
    )}
  </ChartContainer>
);

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockSummary.map((summary) => (
          <Card key={summary.title}>
            <CardHeader>
              <CardTitle>{summary.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="bg-background rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Visitas mensuales (simuladas)</h3>
        <MonthlyVisitsBarChart />
      </div>
    </div>
  );
};

export default Dashboard;
