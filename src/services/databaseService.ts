
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
export type MedicalStaff = Tables["medical_staff"]["Row"];
export type Patient = Tables["patients"]["Row"];
export type MedicalRecord = Tables["medical_records"]["Row"];

export const databaseService = {
  // Medical Staff
  async getAllMedicalStaff() {
    const { data, error } = await supabase
      .from('medical_staff')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createMedicalStaff(staffData: Partial<Omit<MedicalStaff, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('medical_staff')
      .insert([staffData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Patients
  async getAllPatients() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getPatientById(id: string) {
    const { data, error } = await supabase
      .from('patients')
      .select('*, medical_records(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createPatient(patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Medical Records
  async getPatientRecords(patientId: string) {
    const { data, error } = await supabase
      .from('medical_records')
      .select('*, medical_staff(first_name, last_name)')
      .eq('patient_id', patientId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createMedicalRecord(recordData: Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('medical_records')
      .insert([recordData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
