
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  identificationNumber: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock database service
export interface DbService {
  getPatientByIdentification(id: string): Promise<Patient | null>;
  getAllPatients(): Promise<Patient[]>;
  addPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient>;
  getPatientRecords(patientId: string): Promise<MedicalRecord[]>;
  addMedicalRecord(record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalRecord>;
}
