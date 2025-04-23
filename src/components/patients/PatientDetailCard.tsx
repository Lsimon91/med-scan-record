
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Patient } from '@/types';

interface PatientDetailCardProps {
  patient: Patient;
}

const PatientDetailCard: React.FC<PatientDetailCardProps> = ({ patient }) => {
  // Function to format dates
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  // Function to format gender
  const formatGender = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Masculino';
      case 'female':
        return 'Femenino';
      case 'other':
        return 'Otro';
      default:
        return gender;
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="bg-muted/50">
        <CardTitle>{`${patient.firstName} ${patient.lastName}`}</CardTitle>
        <CardDescription>ID: {patient.identificationNumber}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</h3>
            <p className="text-base">{formatDate(patient.birthDate)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Género</h3>
            <p className="text-base">{formatGender(patient.gender)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
            <p className="text-base">{patient.phoneNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Correo Electrónico</h3>
            <p className="text-base">{patient.email || 'No registrado'}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">Dirección</h3>
          <p className="text-base">{patient.address || 'No registrada'}</p>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-6 pt-4 border-t">
          <span>Registrado: {formatDate(patient.createdAt)}</span>
          <span>Actualizado: {formatDate(patient.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDetailCard;
