import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, ScanQrCode } from 'lucide-react';
import LogoutButton from "@/components/layout/LogoutButton";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <Database className="h-6 w-6" />
              <span>MedScan Record</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/scan">
              <Button variant="ghost" className="flex items-center gap-2">
                <ScanQrCode className="h-5 w-5" />
                <span>Escanear Paciente</span>
              </Button>
            </Link>
            <Link to="/patients">
              <Button variant="ghost" className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <span>Pacientes</span>
              </Button>
            </Link>
            {user ? <LogoutButton /> : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
