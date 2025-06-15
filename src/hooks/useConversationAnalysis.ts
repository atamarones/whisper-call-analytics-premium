
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface ConversationAnalysisData {
  id: number;
  conversation_id: string;
  overall_satisfaction_score?: number;
  conversation_quality_score?: number;
  goal_achievement_score?: number;
  sentiment_analysis?: any;
  emotion_analysis?: any;
  topics_discussed?: any;
  key_phrases?: any;
  conversation_summary?: string;
  action_items?: any;
  interruption_count?: number;
  dead_air_duration_seconds?: number;
  compliance_score?: number;
  conversion_achieved?: boolean;
  follow_up_required?: boolean;
  lead_quality_score?: number;
  analysis_type?: string;
  analyzed_by?: string;
  analysis_confidence?: number;
  user_satisfaction_indicators?: any;
  policy_violations?: any;
  created_at?: string;
  updated_at?: string;
}

export const useConversationAnalysis = (conversationId?: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['conversation-analysis', conversationId],
    queryFn: async (): Promise<ConversationAnalysisData[]> => {
      try {
        const token = await getToken({ template: 'supabase' });
        
        let query = supabase
          .from('conversation_analysis')
          .select(`
            id,
            conversation_id,
            overall_satisfaction_score,
            conversation_quality_score,
            goal_achievement_score,
            sentiment_analysis,
            emotion_analysis,
            topics_discussed,
            key_phrases,
            conversation_summary,
            action_items,
            interruption_count,
            dead_air_duration_seconds,
            compliance_score,
            conversion_achieved,
            follow_up_required,
            lead_quality_score,
            analysis_type,
            analyzed_by,
            analysis_confidence,
            user_satisfaction_indicators,
            policy_violations,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false });

        if (conversationId) {
          query = query.eq('conversation_id', conversationId);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching conversation analysis:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in useConversationAnalysis:', error);
        throw error;
      }
    },
    enabled: true,
    refetchInterval: 2 * 60 * 1000,
  });
};
