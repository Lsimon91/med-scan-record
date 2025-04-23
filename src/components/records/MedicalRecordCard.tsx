
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MedicalRecord } from '@/types';

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({ record }) => {
  // Function to format dates
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP', { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="bg-muted/50">
        <CardTitle>Consulta: {formatDate(record.date)}</CardTitle>
        <CardDescription>Doctor: {record.doctorName}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Diagnóstico</h3>
          <p className="text-base whitespace-pre-line">{record.diagnosis}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Tratamiento</h3>
          <p className="text-base whitespace-pre-line">{record.treatment}</p>
        </div>
        {record.notes && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Notas</h3>
            <p className="text-base whitespace-pre-line">{record.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-4 flex justify-end">
        <span>Registro creado: {formatDate(record.createdAt)}</span>
      </CardFooter>
    </Card>
  );
};

export default MedicalRecordCard;
