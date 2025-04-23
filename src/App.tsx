
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
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/" 
              element={
                <>
                  <Navbar />
                  <Index />
                </>
              } 
            />
            <Route 
              path="/scan" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <ScanPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PatientsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patients/:id" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PatientDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <AdminPanel />
                </ProtectedRoute>
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
