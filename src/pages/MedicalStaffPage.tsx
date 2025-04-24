
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { databaseService, type MedicalStaff } from '@/services/databaseService';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, UserRound } from 'lucide-react';

const MedicalStaffPage = () => {
  const [staff, setStaff] = useState<MedicalStaff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await databaseService.getAllMedicalStaff();
        setStaff(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el personal médico.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Personal Médico</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Personal
        </Button>
      </div>

      {staff.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Especialización</TableHead>
              <TableHead>Licencia</TableHead>
              <TableHead>Contacto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <UserRound className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      {member.first_name} {member.last_name}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.specialization}</TableCell>
                <TableCell>{member.license_number}</TableCell>
                <TableCell>{member.phone_number || member.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No hay personal médico registrado</h3>
          <p className="text-muted-foreground">Agregue personal médico para comenzar</p>
        </div>
      )}
    </div>
  );
};

export default MedicalStaffPage;
