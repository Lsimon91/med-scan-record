
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '@/services/mockDbService';
import QRScanner from '@/components/scanner/QRScanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Patient } from '@/types';
import PatientForm from '@/components/patients/PatientForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScanQrCode, UserPlus } from 'lucide-react';

const ScanPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleScanSuccess = async (decodedText: string) => {
    setScannedId(decodedText);
    setIsSearching(true);
    
    try {
      // Attempt to find the patient with the scanned ID
      const foundPatient = await dbService.getPatientByIdentification(decodedText);
      
      if (foundPatient) {
        setPatient(foundPatient);
        toast({
          title: "Paciente encontrado",
          description: `${foundPatient.firstName} ${foundPatient.lastName} ha sido identificado.`,
        });
        
        // Navigate to patient details
        navigate(`/patients/${foundPatient.id}`);
      } else {
        setPatient(null);
        toast({
          title: "Paciente no encontrado",
          description: "No existe un paciente con este código de identificación.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al buscar el paciente.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleScanError = (errorMessage: string) => {
    toast({
      variant: "destructive",
      title: "Error de escaneo",
      description: errorMessage,
    });
  };

  const handleCreatePatient = async (data: any) => {
    setIsRegistering(true);
    
    try {
      // Ensure the identification number from the scan is used
      const newPatient = await dbService.addPatient({
        ...data,
        identificationNumber: scannedId || data.identificationNumber,
      });
      
      toast({
        title: "Paciente registrado",
        description: `${newPatient.firstName} ${newPatient.lastName} ha sido registrado correctamente.`,
      });
      
      // Navigate to patient details
      navigate(`/patients/${newPatient.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al registrar el paciente.",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Escanear Paciente</h1>
      
      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <ScanQrCode className="h-4 w-4" />
            Escanear QR
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Registro Manual
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan">
          <div className="grid gap-6">
            <QRScanner 
              onScanSuccess={handleScanSuccess} 
              onScanError={handleScanError} 
            />
            
            {scannedId && !patient && !isSearching && (
              <Card>
                <CardHeader>
                  <CardTitle>Paciente no encontrado</CardTitle>
                  <CardDescription>
                    No se encontró ningún paciente con el código: {scannedId}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center mb-4">
                    ¿Desea registrar un nuevo paciente con este código de identificación?
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    onClick={() => document.getElementById('manual-tab')?.click()}
                  >
                    Registrar Nuevo Paciente
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="manual" id="manual-tab">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Nuevo Paciente</CardTitle>
              <CardDescription>
                Complete el formulario para registrar un nuevo paciente
                {scannedId ? ` con el código: ${scannedId}` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientForm 
                onSubmit={handleCreatePatient}
                initialData={scannedId ? { identificationNumber: scannedId } : {}}
                isLoading={isRegistering}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanPage;
