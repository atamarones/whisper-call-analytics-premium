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
      customers: {
        Row: {
          created_at: string | null
          email: string
          id: number
          last_visit: string | null
          name: string
          notes: string | null
          phone: string
          total_reservations: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          last_visit?: string | null
          name: string
          notes?: string | null
          phone: string
          total_reservations?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          last_visit?: string | null
          name?: string
          notes?: string | null
          phone?: string
          total_reservations?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          message: string | null
          reservation_id: number | null
          sent_at: string | null
          status: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          message?: string | null
          reservation_id?: number | null
          sent_at?: string | null
          status?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string | null
          reservation_id?: number | null
          sent_at?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations_with_table"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          confirmed: boolean | null
          created_at: string | null
          date: string
          email: string
          guests: number
          id: number
          name: string
          notes: string | null
          phone: string
          reservation_code: string | null
          status: string | null
          table_assigned: string | null
          time: string
          updated_at: string | null
        }
        Insert: {
          confirmed?: boolean | null
          created_at?: string | null
          date: string
          email: string
          guests: number
          id?: number
          name: string
          notes?: string | null
          phone: string
          reservation_code?: string | null
          status?: string | null
          table_assigned?: string | null
          time: string
          updated_at?: string | null
        }
        Update: {
          confirmed?: boolean | null
          created_at?: string | null
          date?: string
          email?: string
          guests?: number
          id?: number
          name?: string
          notes?: string | null
          phone?: string
          reservation_code?: string | null
          status?: string | null
          table_assigned?: string | null
          time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_table_assigned_fkey"
            columns: ["table_assigned"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      system_config: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      table_availability: {
        Row: {
          created_at: string | null
          date: string
          id: number
          reservation_id: number | null
          status: string | null
          table_id: string | null
          time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: number
          reservation_id?: number | null
          status?: string | null
          table_id?: string | null
          time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: number
          reservation_id?: number | null
          status?: string | null
          table_id?: string | null
          time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_availability_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_availability_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations_with_table"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_availability_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          capacity: number
          created_at: string | null
          id: string
          is_active: boolean | null
          location: string | null
          updated_at: string | null
        }
        Insert: {
          capacity: number
          created_at?: string | null
          id: string
          is_active?: boolean | null
          location?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      daily_availability: {
        Row: {
          available_tables: number | null
          date: string | null
          occupied_tables: number | null
          time: string | null
          total_slots: number | null
        }
        Relationships: []
      }
      daily_reservation_stats: {
        Row: {
          cancelled_count: number | null
          confirmed_count: number | null
          date: string | null
          pending_count: number | null
          total_guests: number | null
          total_reservations: number | null
        }
        Relationships: []
      }
      reservations_with_table: {
        Row: {
          confirmed: boolean | null
          created_at: string | null
          date: string | null
          email: string | null
          guests: number | null
          id: number | null
          name: string | null
          notes: string | null
          phone: string | null
          reservation_code: string | null
          status: string | null
          table_assigned: string | null
          table_capacity: number | null
          table_location: string | null
          time: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_table_assigned_fkey"
            columns: ["table_assigned"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      table_availability_summary: {
        Row: {
          capacity: number | null
          customer_name: string | null
          date: string | null
          guests: number | null
          location: string | null
          reservation_code: string | null
          status: string | null
          table_id: string | null
          time: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_availability_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      tables_occupancy: {
        Row: {
          available_tables: number | null
          date: string | null
          occupancy_percentage: number | null
          occupied_tables: number | null
          time: string | null
          total_tables: number | null
        }
        Relationships: []
      }
      today_stats: {
        Row: {
          cancelled_today: number | null
          confirmed_today: number | null
          pending_today: number | null
          total_guests_today: number | null
          total_reservations_today: number | null
          yesterday_guests: number | null
          yesterday_total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_reservation_code: {
        Args: Record<PropertyKey, never>
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
