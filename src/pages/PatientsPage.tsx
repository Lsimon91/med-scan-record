
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '@/services/mockDbService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Patient } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Database, Search, User } from 'lucide-react';

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await dbService.getAllPatients();
        setPatients(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los pacientes.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [toast]);

  // Function to format dates
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    const query = searchQuery.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query) ||
      patient.identificationNumber.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Pacientes</h1>
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar pacientes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link to="/scan">
            <Button>Nuevo Paciente</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-pulse flex flex-col space-y-4 w-full">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 bg-muted rounded-md"></div>
            ))}
          </div>
        </div>
      ) : filteredPatients.length > 0 ? (
        <div className="grid gap-4">
          {filteredPatients.map((patient) => (
            <Link key={patient.id} to={`/patients/${patient.id}`}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{`${patient.firstName} ${patient.lastName}`}</h3>
                    <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
                      <span>ID: {patient.identificationNumber}</span>
                      <span>Nacimiento: {formatDate(patient.birthDate)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="my-8">
          <CardHeader>
            <CardTitle className="text-center">No hay pacientes</CardTitle>
            <CardDescription className="text-center">
              {searchQuery 
                ? 'No se encontraron pacientes con ese criterio de búsqueda' 
                : 'No hay pacientes registrados en el sistema'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link to="/scan">
              <Button>
                <Database className="mr-2 h-4 w-4" />
                Registrar Paciente
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientsPage;
