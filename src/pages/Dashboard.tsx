
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend
} from "recharts";

// Types for our summary data
interface DashboardSummary {
  activeUsers: number;
  totalPatients: number;
  totalRecords: number;
}

const chartData = [
  { name: "Ene", value: 40 },
  { name: "Feb", value: 55 },
  { name: "Mar", value: 30 },
  { name: "Abr", value: 90 },
  { name: "May", value: 70 },
];

const MonthlyVisitsBarChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#0ea5e9" name="Visitas" />
    </BarChart>
  </ResponsiveContainer>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary>({
    activeUsers: 0,
    totalPatients: 0,
    totalRecords: 0
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [patientsCount, recordsCount, staffCount] = await Promise.all([
          supabase.from('patients').select('id', { count: 'exact', head: true }),
          supabase.from('medical_records').select('id', { count: 'exact', head: true }),
          supabase.from('medical_staff').select('id', { count: 'exact', head: true })
        ]);

        setSummary({
          activeUsers: staffCount.count || 0,
          totalPatients: patientsCount.count || 0,
          totalRecords: recordsCount.count || 0
        });
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal médico activo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.totalPatients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Registros clínicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.totalRecords}</div>
          </CardContent>
        </Card>
      </div>
      <div className="bg-background rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Visitas mensuales</h3>
        <MonthlyVisitsBarChart />
      </div>
    </div>
  );
};

export default Dashboard;
