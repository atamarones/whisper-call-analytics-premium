export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      call_evaluations: {
        Row: {
          conversation_id: string
          created_at: string | null
          criteria_id: string
          id: string
          rationale: string | null
          result: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          criteria_id: string
          id?: string
          rationale?: string | null
          result: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          criteria_id?: string
          id?: string
          rationale?: string | null
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_evaluations_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["conversation_id"]
          },
        ]
      }
      call_transcripts: {
        Row: {
          conversation_id: string
          created_at: string | null
          full_transcript: Json | null
          id: string
          transcript_summary: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          full_transcript?: Json | null
          id?: string
          transcript_summary?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          full_transcript?: Json | null
          id?: string
          transcript_summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_transcripts_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["conversation_id"]
          },
        ]
      }
      calls: {
        Row: {
          accepted_time_unix_secs: number | null
          agent_id: string
          call_duration_secs: number
          call_successful: string | null
          conversation_id: string
          cost_cents: number
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          main_language: string | null
          phone_number: string | null
          start_time_unix_secs: number
          termination_reason: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_time_unix_secs?: number | null
          agent_id: string
          call_duration_secs: number
          call_successful?: string | null
          conversation_id: string
          cost_cents: number
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          main_language?: string | null
          phone_number?: string | null
          start_time_unix_secs: number
          termination_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_time_unix_secs?: number | null
          agent_id?: string
          call_duration_secs?: number
          call_successful?: string | null
          conversation_id?: string
          cost_cents?: number
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          main_language?: string | null
          phone_number?: string | null
          start_time_unix_secs?: number
          termination_reason?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      llm_usage: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          input_price: number
          input_tokens: number
          model_name: string
          output_price: number
          output_tokens: number
          total_price: number
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          input_price: number
          input_tokens: number
          model_name: string
          output_price: number
          output_tokens: number
          total_price: number
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          input_price?: number
          input_tokens?: number
          model_name?: string
          output_price?: number
          output_tokens?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "llm_usage_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["conversation_id"]
          },
        ]
      }
    }
    Views: {
      daily_call_metrics: {
        Row: {
          avg_cost_cents: number | null
          avg_duration_secs: number | null
          call_date: string | null
          total_calls: number | null
          total_cost_cents: number | null
          total_duration_secs: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_percentage_change: {
        Args: { current_value: number; previous_value: number }
        Returns: number
      }
      generate_reservation_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      unix_to_date: {
        Args: { unix_timestamp: number }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
