
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 bg-muted/20">{children}</main>
        <Footer />
      </div>
    </div>
    <SidebarTrigger className="fixed left-2 top-2 z-50" />
  </SidebarProvider>
);

export default AppLayout;
