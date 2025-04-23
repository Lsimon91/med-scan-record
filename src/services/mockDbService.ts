
import { Patient, MedicalRecord, DbService } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Mock data
const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    identificationNumber: '12345678',
    birthDate: '1980-05-15',
    gender: 'male',
    phoneNumber: '555-1234-567',
    email: 'juan.perez@example.com',
    address: 'Calle Principal 123, Ciudad',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T10:30:00Z'
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'González',
    identificationNumber: '87654321',
    birthDate: '1992-09-23',
    gender: 'female',
    phoneNumber: '555-7654-321',
    email: 'maria.gonzalez@example.com',
    address: 'Avenida Central 456, Ciudad',
    createdAt: '2023-02-20T14:45:00Z',
    updatedAt: '2023-02-20T14:45:00Z'
  }
];

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    date: '2023-03-10T09:15:00Z',
    doctorName: 'Dr. Rodríguez',
    diagnosis: 'Hipertensión',
    treatment: 'Losartán 50mg diario',
    notes: 'Seguimiento en 3 meses',
    createdAt: '2023-03-10T09:30:00Z',
    updatedAt: '2023-03-10T09:30:00Z'
  },
  {
    id: '2',
    patientId: '1',
    date: '2023-06-15T11:00:00Z',
    doctorName: 'Dr. Rodríguez',
    diagnosis: 'Control de Hipertensión',
    treatment: 'Continuar con Losartán 50mg diario',
    notes: 'Presión arterial estable',
    createdAt: '2023-06-15T11:20:00Z',
    updatedAt: '2023-06-15T11:20:00Z'
  },
  {
    id: '3',
    patientId: '2',
    date: '2023-04-05T10:00:00Z',
    doctorName: 'Dra. Martínez',
    diagnosis: 'Resfriado común',
    treatment: 'Paracetamol 500mg cada 8 horas',
    notes: 'Reposo por 3 días',
    createdAt: '2023-04-05T10:15:00Z',
    updatedAt: '2023-04-05T10:15:00Z'
  }
];

// Local storage keys
const PATIENTS_KEY = 'med_scan_patients';
const MEDICAL_RECORDS_KEY = 'med_scan_records';

// Helper function to initialize local storage with mock data
const initializeLocalStorage = () => {
  if (!localStorage.getItem(PATIENTS_KEY)) {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(mockPatients));
  }
  
  if (!localStorage.getItem(MEDICAL_RECORDS_KEY)) {
    localStorage.setItem(MEDICAL_RECORDS_KEY, JSON.stringify(mockMedicalRecords));
  }
};

// Mock database service implementation
export class MockDbService implements DbService {
  constructor() {
    initializeLocalStorage();
  }

  private getPatients(): Patient[] {
    const data = localStorage.getItem(PATIENTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private setPatients(patients: Patient[]): void {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  }

  private getMedicalRecords(): MedicalRecord[] {
    const data = localStorage.getItem(MEDICAL_RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private setMedicalRecords(records: MedicalRecord[]): void {
    localStorage.setItem(MEDICAL_RECORDS_KEY, JSON.stringify(records));
  }

  async getPatientByIdentification(id: string): Promise<Patient | null> {
    try {
      const patients = this.getPatients();
      const patient = patients.find(p => p.identificationNumber === id);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return patient || null;
    } catch (error) {
      console.error('Error fetching patient:', error);
      toast({
        title: "Error",
        description: "No se pudo obtener la información del paciente",
        variant: "destructive"
      });
      return null;
    }
  }

  async getAllPatients(): Promise<Patient[]> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return this.getPatients();
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los pacientes",
        variant: "destructive"
      });
      return [];
    }
  }

  async addPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    try {
      const patients = this.getPatients();
      
      // Check if patient already exists
      if (patients.some(p => p.identificationNumber === patientData.identificationNumber)) {
        throw new Error('Ya existe un paciente con este número de identificación');
      }
      
      const now = new Date().toISOString();
      const newPatient: Patient = {
        ...patientData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      
      this.setPatients([...patients, newPatient]);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newPatient;
    } catch (error) {
      console.error('Error adding patient:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo agregar el paciente",
        variant: "destructive"
      });
      throw error;
    }
  }

  async getPatientRecords(patientId: string): Promise<MedicalRecord[]> {
    try {
      const records = this.getMedicalRecords();
      const patientRecords = records.filter(r => r.patientId === patientId);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return patientRecords;
    } catch (error) {
      console.error('Error fetching patient records:', error);
      toast({
        title: "Error",
        description: "No se pudieron obtener los registros médicos",
        variant: "destructive"
      });
      return [];
    }
  }

  async addMedicalRecord(recordData: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalRecord> {
    try {
      const records = this.getMedicalRecords();
      
      const now = new Date().toISOString();
      const newRecord: MedicalRecord = {
        ...recordData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      
      this.setMedicalRecords([...records, newRecord]);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newRecord;
    } catch (error) {
      console.error('Error adding medical record:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el registro médico",
        variant: "destructive"
      });
      throw error;
    }
  }
}

// Create and export a singleton instance
export const dbService = new MockDbService();
