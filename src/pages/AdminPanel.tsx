
import React from "react";
import UserManagement from "@/components/admin/UserManagement";
import SystemEventsTable from "@/components/admin/SystemEventsTable";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminPanel = () => {
  useAdminGuard(); // Solo admin puede acceder

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      <Tabs defaultValue="usuarios">
        <TabsList className="mb-6">
          <TabsTrigger value="usuarios">Gestión de Usuarios</TabsTrigger>
          <TabsTrigger value="eventos">Eventos del sistema</TabsTrigger>
        </TabsList>
        <TabsContent value="usuarios">
          <UserManagement />
        </TabsContent>
        <TabsContent value="eventos">
          <SystemEventsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
