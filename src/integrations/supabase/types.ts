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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agent_tools: {
        Row: {
          agent_id: string
          created_at: string | null
          id: number
          input_schema: Json | null
          is_active: boolean | null
          output_schema: Json | null
          retry_attempts: number | null
          timeout_seconds: number | null
          tool_config: Json
          tool_description: string | null
          tool_name: string
          tool_type: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          id?: number
          input_schema?: Json | null
          is_active?: boolean | null
          output_schema?: Json | null
          retry_attempts?: number | null
          timeout_seconds?: number | null
          tool_config: Json
          tool_description?: string | null
          tool_name: string
          tool_type?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          id?: number
          input_schema?: Json | null
          is_active?: boolean | null
          output_schema?: Json | null
          retry_attempts?: number | null
          timeout_seconds?: number | null
          tool_config?: Json
          tool_description?: string | null
          tool_name?: string
          tool_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          audio_format: string | null
          authentication_config: Json | null
          authentication_enabled: boolean | null
          conversation_config: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          hipaa_compliance: boolean | null
          id: string
          interruption_threshold: number | null
          is_active: boolean | null
          llm_max_tokens: number | null
          llm_model: string | null
          llm_provider: string | null
          llm_system_prompt: string | null
          llm_temperature: number | null
          max_concurrent_conversations: number | null
          max_conversation_duration_seconds: number | null
          name: string
          pii_redaction: boolean | null
          platform_settings: Json | null
          post_call_analysis_enabled: boolean | null
          response_delay_ms: number | null
          tools_config: Json | null
          tools_enabled: boolean | null
          turn_detection_mode: string | null
          updated_at: string | null
          use_speaker_boost: boolean | null
          voice_category: string | null
          voice_id: string | null
          voice_name: string | null
          voice_similarity_boost: number | null
          voice_stability: number | null
          voice_style: number | null
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          audio_format?: string | null
          authentication_config?: Json | null
          authentication_enabled?: boolean | null
          conversation_config?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hipaa_compliance?: boolean | null
          id: string
          interruption_threshold?: number | null
          is_active?: boolean | null
          llm_max_tokens?: number | null
          llm_model?: string | null
          llm_provider?: string | null
          llm_system_prompt?: string | null
          llm_temperature?: number | null
          max_concurrent_conversations?: number | null
          max_conversation_duration_seconds?: number | null
          name: string
          pii_redaction?: boolean | null
          platform_settings?: Json | null
          post_call_analysis_enabled?: boolean | null
          response_delay_ms?: number | null
          tools_config?: Json | null
          tools_enabled?: boolean | null
          turn_detection_mode?: string | null
          updated_at?: string | null
          use_speaker_boost?: boolean | null
          voice_category?: string | null
          voice_id?: string | null
          voice_name?: string | null
          voice_similarity_boost?: number | null
          voice_stability?: number | null
          voice_style?: number | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          audio_format?: string | null
          authentication_config?: Json | null
          authentication_enabled?: boolean | null
          conversation_config?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hipaa_compliance?: boolean | null
          id?: string
          interruption_threshold?: number | null
          is_active?: boolean | null
          llm_max_tokens?: number | null
          llm_model?: string | null
          llm_provider?: string | null
          llm_system_prompt?: string | null
          llm_temperature?: number | null
          max_concurrent_conversations?: number | null
          max_conversation_duration_seconds?: number | null
          name?: string
          pii_redaction?: boolean | null
          platform_settings?: Json | null
          post_call_analysis_enabled?: boolean | null
          response_delay_ms?: number | null
          tools_config?: Json | null
          tools_enabled?: boolean | null
          turn_detection_mode?: string | null
          updated_at?: string | null
          use_speaker_boost?: boolean | null
          voice_category?: string | null
          voice_id?: string | null
          voice_name?: string | null
          voice_similarity_boost?: number | null
          voice_stability?: number | null
          voice_style?: number | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      audio_segments: {
        Row: {
          audio_file_path: string | null
          audio_file_size: number | null
          audio_file_url: string | null
          audio_format: string | null
          conversation_id: string
          created_at: string | null
          duration_ms: number
          end_time_ms: number
          id: number
          language_detected: string | null
          message_id: number | null
          noise_level: number | null
          segment_type: string | null
          speech_clarity_score: number | null
          start_time_ms: number
          transcription: string | null
          transcription_confidence: number | null
          volume_level: number | null
        }
        Insert: {
          audio_file_path?: string | null
          audio_file_size?: number | null
          audio_file_url?: string | null
          audio_format?: string | null
          conversation_id: string
          created_at?: string | null
          duration_ms: number
          end_time_ms: number
          id?: number
          language_detected?: string | null
          message_id?: number | null
          noise_level?: number | null
          segment_type?: string | null
          speech_clarity_score?: number | null
          start_time_ms: number
          transcription?: string | null
          transcription_confidence?: number | null
          volume_level?: number | null
        }
        Update: {
          audio_file_path?: string | null
          audio_file_size?: number | null
          audio_file_url?: string | null
          audio_format?: string | null
          conversation_id?: string
          created_at?: string | null
          duration_ms?: number
          end_time_ms?: number
          id?: number
          language_detected?: string | null
          message_id?: number | null
          noise_level?: number | null
          segment_type?: string | null
          speech_clarity_score?: number | null
          start_time_ms?: number
          transcription?: string | null
          transcription_confidence?: number | null
          volume_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_segments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "conversation_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_calls: {
        Row: {
          agent_id: string
          batch_description: string | null
          batch_name: string
          call_config: Json | null
          call_list: Json
          completed_at: string | null
          completed_calls: number | null
          created_at: string | null
          created_by: string | null
          estimated_completion: string | null
          failed_calls: number | null
          id: string
          schedule_time: string | null
          started_at: string | null
          status: string
          successful_calls: number | null
          total_calls: number
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          batch_description?: string | null
          batch_name: string
          call_config?: Json | null
          call_list: Json
          completed_at?: string | null
          completed_calls?: number | null
          created_at?: string | null
          created_by?: string | null
          estimated_completion?: string | null
          failed_calls?: number | null
          id: string
          schedule_time?: string | null
          started_at?: string | null
          status: string
          successful_calls?: number | null
          total_calls: number
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          batch_description?: string | null
          batch_name?: string
          call_config?: Json | null
          call_list?: Json
          completed_at?: string | null
          completed_calls?: number | null
          created_at?: string | null
          created_by?: string | null
          estimated_completion?: string | null
          failed_calls?: number | null
          id?: string
          schedule_time?: string | null
          started_at?: string | null
          status?: string
          successful_calls?: number | null
          total_calls?: number
          updated_at?: string | null
        }
        Relationships: []
      }
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
          audio_noise_reduction: boolean | null
          audio_normalized: boolean | null
          audio_processing_status: string | null
          audio_quality_score: number | null
          audio_received_bytes: number | null
          audio_sent_bytes: number | null
          audio_transcription_status: string | null
          audio_waveform_data: Json | null
          average_response_latency_ms: number | null
          call_direction: string | null
          call_duration_secs: number
          call_successful: string | null
          call_type: string | null
          channel_id: string | null
          client_id: string | null
          connection_id: string | null
          connection_type: string | null
          conversation_config: Json | null
          conversation_id: string
          cost_cents: number
          created_at: string | null
          custom_llm_extra_body: Json | null
          duration_seconds: number | null
          email: string | null
          end_time: string | null
          error_code: string | null
          error_details: Json | null
          error_message: string | null
          first_name: string | null
          first_response_latency_ms: number | null
          full_recording_duration_ms: number | null
          full_recording_file_path: string | null
          full_recording_file_size: number | null
          full_recording_format: string | null
          full_recording_url: string | null
          id: string
          ip_address: string | null
          llm_cost_credits: number | null
          main_language: string | null
          phone_number: string | null
          session_id: string | null
          start_time: string | null
          start_time_unix: number | null
          start_time_unix_secs: number
          status: string | null
          stt_cost_credits: number | null
          termination_reason: string | null
          total_cost_credits: number | null
          total_processing_time_ms: number | null
          tts_cost_credits: number | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          accepted_time_unix_secs?: number | null
          agent_id: string
          audio_noise_reduction?: boolean | null
          audio_normalized?: boolean | null
          audio_processing_status?: string | null
          audio_quality_score?: number | null
          audio_received_bytes?: number | null
          audio_sent_bytes?: number | null
          audio_transcription_status?: string | null
          audio_waveform_data?: Json | null
          average_response_latency_ms?: number | null
          call_direction?: string | null
          call_duration_secs: number
          call_successful?: string | null
          call_type?: string | null
          channel_id?: string | null
          client_id?: string | null
          connection_id?: string | null
          connection_type?: string | null
          conversation_config?: Json | null
          conversation_id: string
          cost_cents: number
          created_at?: string | null
          custom_llm_extra_body?: Json | null
          duration_seconds?: number | null
          email?: string | null
          end_time?: string | null
          error_code?: string | null
          error_details?: Json | null
          error_message?: string | null
          first_name?: string | null
          first_response_latency_ms?: number | null
          full_recording_duration_ms?: number | null
          full_recording_file_path?: string | null
          full_recording_file_size?: number | null
          full_recording_format?: string | null
          full_recording_url?: string | null
          id?: string
          ip_address?: string | null
          llm_cost_credits?: number | null
          main_language?: string | null
          phone_number?: string | null
          session_id?: string | null
          start_time?: string | null
          start_time_unix?: number | null
          start_time_unix_secs: number
          status?: string | null
          stt_cost_credits?: number | null
          termination_reason?: string | null
          total_cost_credits?: number | null
          total_processing_time_ms?: number | null
          tts_cost_credits?: number | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          accepted_time_unix_secs?: number | null
          agent_id?: string
          audio_noise_reduction?: boolean | null
          audio_normalized?: boolean | null
          audio_processing_status?: string | null
          audio_quality_score?: number | null
          audio_received_bytes?: number | null
          audio_sent_bytes?: number | null
          audio_transcription_status?: string | null
          audio_waveform_data?: Json | null
          average_response_latency_ms?: number | null
          call_direction?: string | null
          call_duration_secs?: number
          call_successful?: string | null
          call_type?: string | null
          channel_id?: string | null
          client_id?: string | null
          connection_id?: string | null
          connection_type?: string | null
          conversation_config?: Json | null
          conversation_id?: string
          cost_cents?: number
          created_at?: string | null
          custom_llm_extra_body?: Json | null
          duration_seconds?: number | null
          email?: string | null
          end_time?: string | null
          error_code?: string | null
          error_details?: Json | null
          error_message?: string | null
          first_name?: string | null
          first_response_latency_ms?: number | null
          full_recording_duration_ms?: number | null
          full_recording_file_path?: string | null
          full_recording_file_size?: number | null
          full_recording_format?: string | null
          full_recording_url?: string | null
          id?: string
          ip_address?: string | null
          llm_cost_credits?: number | null
          main_language?: string | null
          phone_number?: string | null
          session_id?: string | null
          start_time?: string | null
          start_time_unix?: number | null
          start_time_unix_secs?: number
          status?: string | null
          stt_cost_credits?: number | null
          termination_reason?: string | null
          total_cost_credits?: number | null
          total_processing_time_ms?: number | null
          tts_cost_credits?: number | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_metrics: {
        Row: {
          agent_id: string
          avg_conversation_duration_seconds: number | null
          avg_response_time_seconds: number | null
          avg_satisfaction_score: number | null
          channel_id: string
          created_at: string | null
          date: string
          failed_conversations: number | null
          id: string
          successful_conversations: number | null
          total_conversations: number | null
          total_cost_cents: number | null
          total_messages: number | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          avg_conversation_duration_seconds?: number | null
          avg_response_time_seconds?: number | null
          avg_satisfaction_score?: number | null
          channel_id: string
          created_at?: string | null
          date: string
          failed_conversations?: number | null
          id?: string
          successful_conversations?: number | null
          total_conversations?: number | null
          total_cost_cents?: number | null
          total_messages?: number | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          avg_conversation_duration_seconds?: number | null
          avg_response_time_seconds?: number | null
          avg_satisfaction_score?: number | null
          channel_id?: string
          created_at?: string | null
          date?: string
          failed_conversations?: number | null
          id?: string
          successful_conversations?: number | null
          total_conversations?: number | null
          total_cost_cents?: number | null
          total_messages?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channel_metrics_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_analysis: {
        Row: {
          action_items: Json | null
          analysis_confidence: number | null
          analysis_type: string | null
          analyzed_by: string | null
          compliance_score: number | null
          conversation_id: string
          conversation_quality_score: number | null
          conversation_summary: string | null
          conversion_achieved: boolean | null
          created_at: string | null
          dead_air_duration_seconds: number | null
          emotion_analysis: Json | null
          follow_up_required: boolean | null
          goal_achievement_score: number | null
          id: number
          interruption_count: number | null
          key_phrases: Json | null
          lead_quality_score: number | null
          overall_satisfaction_score: number | null
          policy_violations: Json | null
          sentiment_analysis: Json | null
          topics_discussed: Json | null
          updated_at: string | null
          user_satisfaction_indicators: Json | null
        }
        Insert: {
          action_items?: Json | null
          analysis_confidence?: number | null
          analysis_type?: string | null
          analyzed_by?: string | null
          compliance_score?: number | null
          conversation_id: string
          conversation_quality_score?: number | null
          conversation_summary?: string | null
          conversion_achieved?: boolean | null
          created_at?: string | null
          dead_air_duration_seconds?: number | null
          emotion_analysis?: Json | null
          follow_up_required?: boolean | null
          goal_achievement_score?: number | null
          id?: number
          interruption_count?: number | null
          key_phrases?: Json | null
          lead_quality_score?: number | null
          overall_satisfaction_score?: number | null
          policy_violations?: Json | null
          sentiment_analysis?: Json | null
          topics_discussed?: Json | null
          updated_at?: string | null
          user_satisfaction_indicators?: Json | null
        }
        Update: {
          action_items?: Json | null
          analysis_confidence?: number | null
          analysis_type?: string | null
          analyzed_by?: string | null
          compliance_score?: number | null
          conversation_id?: string
          conversation_quality_score?: number | null
          conversation_summary?: string | null
          conversion_achieved?: boolean | null
          created_at?: string | null
          dead_air_duration_seconds?: number | null
          emotion_analysis?: Json | null
          follow_up_required?: boolean | null
          goal_achievement_score?: number | null
          id?: number
          interruption_count?: number | null
          key_phrases?: Json | null
          lead_quality_score?: number | null
          overall_satisfaction_score?: number | null
          policy_violations?: Json | null
          sentiment_analysis?: Json | null
          topics_discussed?: Json | null
          updated_at?: string | null
          user_satisfaction_indicators?: Json | null
        }
        Relationships: []
      }
      conversation_evaluations: {
        Row: {
          conversation_id: string
          created_at: string | null
          criteria_id: number
          evaluated_by: string | null
          evaluation_method: string | null
          evaluation_notes: string | null
          evaluation_result: Json | null
          id: number
          passed: boolean | null
          score: number | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          criteria_id: number
          evaluated_by?: string | null
          evaluation_method?: string | null
          evaluation_notes?: string | null
          evaluation_result?: Json | null
          id?: number
          passed?: boolean | null
          score?: number | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          criteria_id?: number
          evaluated_by?: string | null
          evaluation_method?: string | null
          evaluation_notes?: string | null
          evaluation_result?: Json | null
          id?: number
          passed?: boolean | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_evaluations_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "evaluation_criteria"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string | null
          id: number
          role: string
          timestamp: string
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string | null
          id?: number
          role: string
          timestamp: string
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string | null
          id?: number
          role?: string
          timestamp?: string
        }
        Relationships: []
      }
      daily_metrics: {
        Row: {
          agent_id: string
          average_cost_per_conversation: number | null
          average_response_latency_ms: number | null
          average_satisfaction_score: number | null
          completion_rate: number | null
          created_at: string | null
          date: string
          error_rate: number | null
          id: number
          interruption_rate: number | null
          success_rate: number | null
          total_conversations: number | null
          total_cost_credits: number | null
          total_duration_seconds: number | null
          total_messages: number | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          average_cost_per_conversation?: number | null
          average_response_latency_ms?: number | null
          average_satisfaction_score?: number | null
          completion_rate?: number | null
          created_at?: string | null
          date: string
          error_rate?: number | null
          id?: number
          interruption_rate?: number | null
          success_rate?: number | null
          total_conversations?: number | null
          total_cost_credits?: number | null
          total_duration_seconds?: number | null
          total_messages?: number | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          average_cost_per_conversation?: number | null
          average_response_latency_ms?: number | null
          average_satisfaction_score?: number | null
          completion_rate?: number | null
          created_at?: string | null
          date?: string
          error_rate?: number | null
          id?: number
          interruption_rate?: number | null
          success_rate?: number | null
          total_conversations?: number | null
          total_cost_credits?: number | null
          total_duration_seconds?: number | null
          total_messages?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      evaluation_criteria: {
        Row: {
          agent_id: string
          created_at: string | null
          criteria_type: string | null
          description: string | null
          evaluation_prompt: string | null
          id: number
          is_active: boolean | null
          name: string
          success_threshold: number | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          agent_id: string
          created_at?: string | null
          criteria_type?: string | null
          description?: string | null
          evaluation_prompt?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          success_threshold?: number | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          agent_id?: string
          created_at?: string | null
          criteria_type?: string | null
          description?: string | null
          evaluation_prompt?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          success_threshold?: number | null
          updated_at?: string | null
          weight?: number | null
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
      organizations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          owner_clerk_user_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          name: string
          owner_clerk_user_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_clerk_user_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tool_executions: {
        Row: {
          completed_at: string | null
          conversation_id: string
          created_at: string | null
          error_code: string | null
          error_details: Json | null
          error_message: string | null
          execution_status: string | null
          execution_time_ms: number | null
          id: number
          input_parameters: Json | null
          message_id: number | null
          output_result: Json | null
          retry_count: number | null
          started_at: string
          tool_id: number
        }
        Insert: {
          completed_at?: string | null
          conversation_id: string
          created_at?: string | null
          error_code?: string | null
          error_details?: Json | null
          error_message?: string | null
          execution_status?: string | null
          execution_time_ms?: number | null
          id?: number
          input_parameters?: Json | null
          message_id?: number | null
          output_result?: Json | null
          retry_count?: number | null
          started_at: string
          tool_id: number
        }
        Update: {
          completed_at?: string | null
          conversation_id?: string
          created_at?: string | null
          error_code?: string | null
          error_details?: Json | null
          error_message?: string | null
          execution_status?: string | null
          execution_time_ms?: number | null
          id?: number
          input_parameters?: Json | null
          message_id?: number | null
          output_result?: Json | null
          retry_count?: number | null
          started_at?: string
          tool_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tool_executions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "conversation_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tool_executions_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "agent_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_organization_permissions: {
        Row: {
          can_manage_agents: boolean | null
          can_manage_users: boolean | null
          can_view_metrics: boolean | null
          clerk_user_id: string
          created_at: string | null
          id: string
          organization_id: string
          role: string | null
        }
        Insert: {
          can_manage_agents?: boolean | null
          can_manage_users?: boolean | null
          can_view_metrics?: boolean | null
          clerk_user_id: string
          created_at?: string | null
          id?: string
          organization_id: string
          role?: string | null
        }
        Update: {
          can_manage_agents?: boolean | null
          can_manage_users?: boolean | null
          can_view_metrics?: boolean | null
          clerk_user_id?: string
          created_at?: string | null
          id?: string
          organization_id?: string
          role?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          clerk_user_id: string
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          organization_id: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          clerk_user_id: string
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          clerk_user_id?: string
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          agent_id: string
          conversation_id: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_attempts: number | null
          delivery_status: string | null
          error_message: string | null
          event_type: string
          id: number
          max_delivery_attempts: number | null
          next_retry_at: string | null
          payload: Json
          response_body: string | null
          response_status_code: number | null
          response_time_ms: number | null
        }
        Insert: {
          agent_id: string
          conversation_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          delivery_status?: string | null
          error_message?: string | null
          event_type: string
          id?: number
          max_delivery_attempts?: number | null
          next_retry_at?: string | null
          payload: Json
          response_body?: string | null
          response_status_code?: number | null
          response_time_ms?: number | null
        }
        Update: {
          agent_id?: string
          conversation_id?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_attempts?: number | null
          delivery_status?: string | null
          error_message?: string | null
          event_type?: string
          id?: number
          max_delivery_attempts?: number | null
          next_retry_at?: string | null
          payload?: Json
          response_body?: string | null
          response_status_code?: number | null
          response_time_ms?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      agent_performance: {
        Row: {
          avg_cost: number | null
          avg_duration: number | null
          avg_satisfaction: number | null
          completed_conversations: number | null
          failed_conversations: number | null
          id: string | null
          name: string | null
          success_rate: number | null
          total_conversations: number | null
        }
        Relationships: []
      }
      channel_performance_summary: {
        Row: {
          active_agents: number | null
          avg_satisfaction: number | null
          channel_name: string | null
          display_name: string | null
          failed_conversations: number | null
          last_activity_date: string | null
          success_rate: number | null
          successful_conversations: number | null
          total_conversations: number | null
          total_cost_cents: number | null
        }
        Relationships: []
      }
      conversation_summary: {
        Row: {
          agent_id: string | null
          agent_name: string | null
          call_direction: string | null
          client_name: string | null
          duration_seconds: number | null
          end_time: string | null
          goal_achievement_score: number | null
          id: string | null
          message_count: number | null
          overall_satisfaction_score: number | null
          start_time: string | null
          status: string | null
          total_cost_credits: number | null
        }
        Relationships: []
      }
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
      get_clerk_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      unix_to_date: {
        Args: { unix_timestamp: number }
        Returns: string
      }
      user_has_permission: {
        Args: { org_id: string; permission_type: string }
        Returns: boolean
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
