
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dbService } from '@/services/mockDbService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { MedicalRecord, Patient } from '@/types';
import PatientDetailCard from '@/components/patients/PatientDetailCard';
import MedicalRecordCard from '@/components/records/MedicalRecordCard';
import MedicalRecordForm from '@/components/records/MedicalRecordForm';
import { ArrowLeft, FilePlus, FileText, UserRound } from 'lucide-react';

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const allPatients = await dbService.getAllPatients();
        const foundPatient = allPatients.find(p => p.id === id);
        
        if (foundPatient) {
          setPatient(foundPatient);
          const records = await dbService.getPatientRecords(id);
          setMedicalRecords(records);
        } else {
          toast({
            variant: "destructive",
            title: "Paciente no encontrado",
            description: "No se encontró el paciente solicitado.",
          });
          navigate('/patients');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al cargar los datos del paciente.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id, navigate, toast]);

  const handleAddMedicalRecord = async (data: any) => {
    if (!patient) return;
    
    setIsSubmitting(true);
    try {
      const newRecord = await dbService.addMedicalRecord(data);
      setMedicalRecords(prev => [newRecord, ...prev]);
      
      toast({
        title: "Registro médico creado",
        description: "El registro médico ha sido añadido correctamente.",
      });
      
      // Switch to the records tab
      document.getElementById('records-tab')?.click();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al guardar el registro médico.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded-md"></div>
          <div className="h-64 bg-muted rounded-md"></div>
          <div className="h-8 w-48 bg-muted rounded-md"></div>
          <div className="h-64 bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Paciente no encontrado</h1>
        <Button onClick={() => navigate('/patients')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la lista de pacientes
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/patients')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{`${patient.firstName} ${patient.lastName}`}</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="records" id="records-tab" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Registros médicos
          </TabsTrigger>
          <TabsTrigger value="new-record" className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            Nuevo registro
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <PatientDetailCard patient={patient} />
        </TabsContent>
        
        <TabsContent value="records">
          {medicalRecords.length > 0 ? (
            <div className="grid gap-6">
              {medicalRecords.map(record => (
                <MedicalRecordCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sin registros médicos</CardTitle>
                <CardDescription>
                  Este paciente no tiene registros médicos todavía.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button onClick={() => document.getElementById('new-record-tab')?.click()}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Crear Nuevo Registro
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="new-record" id="new-record-tab">
          <Card>
            <CardHeader>
              <CardTitle>Nuevo Registro Médico</CardTitle>
              <CardDescription>
                Añada un nuevo registro médico para {`${patient.firstName} ${patient.lastName}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MedicalRecordForm
                patientId={patient.id}
                onSubmit={handleAddMedicalRecord}
                isLoading={isSubmitting}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetailPage;
