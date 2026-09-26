export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      consultation_intakes: {
        Row: {
          chief_complaint: string | null
          consultation_goal_other: string | null
          consultation_goals: string[] | null
          consultation_id: string
          created_at: string
          current_issue_trend: string | null
          current_symptoms: string[] | null
          current_symptoms_other: string | null
          discomfort_severity: number | null
          emergency_symptoms: string[] | null
          emergency_symptoms_other: string | null
          general_health_today: string | null
          id: string
          is_pregnant: boolean | null
          longitudinal_trend: string | null
          primary_concern: string | null
          red_flag_symptoms: string[] | null
          speed_of_change: string | null
          symptom_onset: string | null
          updated_at: string
        }
        Insert: {
          chief_complaint?: string | null
          consultation_goal_other?: string | null
          consultation_goals?: string[] | null
          consultation_id: string
          created_at?: string
          current_issue_trend?: string | null
          current_symptoms?: string[] | null
          current_symptoms_other?: string | null
          discomfort_severity?: number | null
          emergency_symptoms?: string[] | null
          emergency_symptoms_other?: string | null
          general_health_today?: string | null
          id?: string
          is_pregnant?: boolean | null
          longitudinal_trend?: string | null
          primary_concern?: string | null
          red_flag_symptoms?: string[] | null
          speed_of_change?: string | null
          symptom_onset?: string | null
          updated_at?: string
        }
        Update: {
          chief_complaint?: string | null
          consultation_goal_other?: string | null
          consultation_goals?: string[] | null
          consultation_id?: string
          created_at?: string
          current_issue_trend?: string | null
          current_symptoms?: string[] | null
          current_symptoms_other?: string | null
          discomfort_severity?: number | null
          emergency_symptoms?: string[] | null
          emergency_symptoms_other?: string | null
          general_health_today?: string | null
          id?: string
          is_pregnant?: boolean | null
          longitudinal_trend?: string | null
          primary_concern?: string | null
          red_flag_symptoms?: string[] | null
          speed_of_change?: string | null
          symptom_onset?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_intakes_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: true
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          completed_at: string | null
          created_at: string
          doctor_id: string | null
          id: string
          patient_id: string
          status: string
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          doctor_id?: string | null
          id?: string
          patient_id: string
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          doctor_id?: string | null
          id?: string
          patient_id?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_profiles: {
        Row: {
          created_at: string
          specialty: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          specialty?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          specialty?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          consultation_id: string
          created_at: string
          document_type: string | null
          file_size: number | null
          id: string
          mime_type: string | null
          original_filename: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          consultation_id: string
          created_at?: string
          document_type?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          original_filename: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          consultation_id?: string
          created_at?: string
          document_type?: string | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          original_filename?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lifestyle_assessments: {
        Row: {
          additional_health_information: string | null
          alcohol_use: string | null
          consultation_id: string
          created_at: string
          dietary_restrictions: string | null
          id: string
          major_life_changes: string | null
          other_health_factors: string | null
          recent_significant_weight_change: boolean | null
          smoking_status: string | null
          updated_at: string
        }
        Insert: {
          additional_health_information?: string | null
          alcohol_use?: string | null
          consultation_id: string
          created_at?: string
          dietary_restrictions?: string | null
          id?: string
          major_life_changes?: string | null
          other_health_factors?: string | null
          recent_significant_weight_change?: boolean | null
          smoking_status?: string | null
          updated_at?: string
        }
        Update: {
          additional_health_information?: string | null
          alcohol_use?: string | null
          consultation_id?: string
          created_at?: string
          dietary_restrictions?: string | null
          id?: string
          major_life_changes?: string | null
          other_health_factors?: string | null
          recent_significant_weight_change?: boolean | null
          smoking_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lifestyle_assessments_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: true
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_allergies: {
        Row: {
          allergy_name: string
          consultation_id: string
          created_at: string
          details: string | null
          id: string
        }
        Insert: {
          allergy_name: string
          consultation_id: string
          created_at?: string
          details?: string | null
          id?: string
        }
        Update: {
          allergy_name?: string
          consultation_id?: string
          created_at?: string
          details?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_allergies_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_measurements: {
        Row: {
          consultation_id: string
          created_at: string
          diastolic_bp: number | null
          id: string
          measured_at: string | null
          patient_id: string
          systolic_bp: number | null
          weight_kg: number | null
        }
        Insert: {
          consultation_id: string
          created_at?: string
          diastolic_bp?: number | null
          id?: string
          measured_at?: string | null
          patient_id: string
          systolic_bp?: number | null
          weight_kg?: number | null
        }
        Update: {
          consultation_id?: string
          created_at?: string
          diastolic_bp?: number | null
          id?: string
          measured_at?: string | null
          patient_id?: string
          systolic_bp?: number | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_measurements_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_measurements_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      patient_medical_history: {
        Row: {
          consultation_id: string
          created_at: string
          current_health_issues: string[] | null
          existing_conditions: string[] | null
          id: string
          updated_at: string
        }
        Insert: {
          consultation_id: string
          created_at?: string
          current_health_issues?: string[] | null
          existing_conditions?: string[] | null
          id?: string
          updated_at?: string
        }
        Update: {
          consultation_id?: string
          created_at?: string
          current_health_issues?: string[] | null
          existing_conditions?: string[] | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_medical_history_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: true
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_medications: {
        Row: {
          consultation_id: string
          created_at: string
          frequency: string | null
          id: string
          medication_name: string
          quantity: string | null
          strength: string | null
        }
        Insert: {
          consultation_id: string
          created_at?: string
          frequency?: string | null
          id?: string
          medication_name: string
          quantity?: string | null
          strength?: string | null
        }
        Update: {
          consultation_id?: string
          created_at?: string
          frequency?: string | null
          id?: string
          medication_name?: string
          quantity?: string | null
          strength?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_medications_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_profiles: {
        Row: {
          date_of_birth: string
          display_name_preference:
            | Database["public"]["Enums"]["display_name_preference"]
            | null
          height_cm: number | null
          nickname: string | null
          sex: string | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          date_of_birth: string
          display_name_preference?:
            | Database["public"]["Enums"]["display_name_preference"]
            | null
          height_cm?: number | null
          nickname?: string | null
          sex?: string | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          date_of_birth?: string
          display_name_preference?:
            | Database["public"]["Enums"]["display_name_preference"]
            | null
          height_cm?: number | null
          nickname?: string | null
          sex?: string | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      save_patient_allergies: {
        Args: { p_allergies: Json; p_consultation_id: string }
        Returns: undefined
      }
      save_patient_medications: {
        Args: { p_consultation_id: string; p_medications: Json }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "patient" | "consultant" | "admin"
      display_name_preference: "full_name" | "nickname"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["patient", "consultant", "admin"],
      display_name_preference: ["full_name", "nickname"],
    },
  },
} as const
