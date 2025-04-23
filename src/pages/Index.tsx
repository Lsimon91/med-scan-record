
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, ScanQrCode } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-8">
          <Database className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-4xl font-bold mt-4 mb-2">MedScan Record</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Sistema de gestión de registros médicos y expedientes clínicos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
          <Link to="/scan" className="w-full">
            <Button className="w-full h-14 text-lg" size="lg">
              <ScanQrCode className="mr-2 h-5 w-5" />
              Escanear Paciente
            </Button>
          </Link>
          
          <Link to="/patients" className="w-full">
            <Button variant="outline" className="w-full h-14 text-lg" size="lg">
              <Database className="mr-2 h-5 w-5" />
              Ver Pacientes
            </Button>
          </Link>
        </div>
      </div>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} MedScan Record - Sistema de Gestión Médica
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
