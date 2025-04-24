
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { databaseService } from '@/services/databaseService';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  first_name: z.string().min(2, 'El nombre es requerido'),
  last_name: z.string().min(2, 'El apellido es requerido'),
  specialization: z.string().min(2, 'La especialización es requerida'),
  license_number: z.string().min(2, 'El número de licencia es requerido'),
  phone_number: z.string().optional(),
  email: z.string().email('Correo electrónico inválido').optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface CreateMedicalStaffFormProps {
  onSuccess: () => void;
}

export function CreateMedicalStaffForm({ onSuccess }: CreateMedicalStaffFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      specialization: '',
      license_number: '',
      phone_number: '',
      email: '',
    },
  });

  const onSubmit = async (data: FormSchema) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe iniciar sesión para realizar esta acción.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await databaseService.createMedicalStaff({
        ...data,
        user_id: user.id,
      });
      
      toast({
        title: "Personal médico creado",
        description: "El miembro del personal médico ha sido agregado exitosamente.",
      });
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el personal médico.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellidos</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Especialización</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="license_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Licencia</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </form>
    </Form>
  );
}
