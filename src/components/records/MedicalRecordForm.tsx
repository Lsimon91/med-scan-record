
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const medicalRecordSchema = z.object({
  doctorName: z.string().min(2, { message: 'El nombre del doctor debe tener al menos 2 caracteres' }),
  diagnosis: z.string().min(2, { message: 'El diagnóstico debe tener al menos 2 caracteres' }),
  treatment: z.string().min(2, { message: 'El tratamiento debe tener al menos 2 caracteres' }),
  notes: z.string().optional(),
});

type MedicalRecordFormValues = z.infer<typeof medicalRecordSchema>;

interface MedicalRecordFormProps {
  patientId: string;
  onSubmit: (data: MedicalRecordFormValues & { patientId: string, date: string }) => void;
  isLoading?: boolean;
}

const MedicalRecordForm: React.FC<MedicalRecordFormProps> = ({ 
  patientId, 
  onSubmit, 
  isLoading = false 
}) => {
  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      doctorName: '',
      diagnosis: '',
      treatment: '',
      notes: '',
    },
  });

  const handleSubmit = (values: MedicalRecordFormValues) => {
    onSubmit({
      ...values,
      patientId,
      date: new Date().toISOString()
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="doctorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Doctor</FormLabel>
              <FormControl>
                <Input placeholder="Dr. Apellido" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnóstico</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descripción del diagnóstico"
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="treatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tratamiento</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descripción del tratamiento recomendado"
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas Adicionales (Opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Notas adicionales"
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Registro Médico'}
        </Button>
      </form>
    </Form>
  );
};

export default MedicalRecordForm;
