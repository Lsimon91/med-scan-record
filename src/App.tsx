import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ScanPage from "./pages/ScanPage";
import PatientsPage from "./pages/PatientsPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import Navbar from "./components/layout/Navbar";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route 
              path="/" 
              element={<Index />} 
            />
            
            <Route 
              path="/scan" 
              element={
                <>
                  <Navbar />
                  <ScanPage />
                </>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <>
                  <Navbar />
                  <PatientsPage />
                </>
              } 
            />
            <Route 
              path="/patients/:id" 
              element={
                <>
                  <Navbar />
                  <PatientDetailPage />
                </>
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                <>
                  <Navbar />
                  <AdminPanel />
                </>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
