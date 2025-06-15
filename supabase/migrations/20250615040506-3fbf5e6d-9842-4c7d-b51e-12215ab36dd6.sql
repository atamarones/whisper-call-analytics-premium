
-- =============================================
-- MIGRACIÓN DE SEGURIDAD: Corregir vistas SECURITY DEFINER y habilitar RLS
-- =============================================

-- 1. Corregir vistas con SECURITY DEFINER
-- Recrear conversation_summary con SECURITY INVOKER
DROP VIEW IF EXISTS public.conversation_summary;
CREATE VIEW public.conversation_summary
WITH (security_invoker = true)
AS
SELECT 
    c.id,
    c.agent_id,
    COALESCE(a.name, c.agent_id) as agent_name,
    c.status,
    c.start_time,
    c.end_time,
    c.duration_seconds,
    c.first_name as client_name,
    c.call_direction,
    c.total_cost_credits,
    ca.overall_satisfaction_score,
    ca.goal_achievement_score,
    COUNT(cm.id) as message_count
FROM calls c
LEFT JOIN agents a ON c.agent_id = a.id
LEFT JOIN conversation_analysis ca ON c.conversation_id = ca.conversation_id
LEFT JOIN conversation_messages cm ON c.conversation_id = cm.conversation_id
GROUP BY c.id, c.agent_id, a.name, c.status, c.start_time, c.end_time, c.duration_seconds, 
         c.first_name, c.call_direction, c.total_cost_credits, ca.overall_satisfaction_score, ca.goal_achievement_score;

-- Recrear agent_performance con SECURITY INVOKER
DROP VIEW IF EXISTS public.agent_performance;
CREATE VIEW public.agent_performance
WITH (security_invoker = true)
AS
SELECT 
    COALESCE(a.id, c.agent_id) as id,
    COALESCE(a.name, c.agent_id) as name,
    COUNT(c.id) as total_conversations,
    AVG(c.duration_seconds) as avg_duration,
    AVG(ca.overall_satisfaction_score) as avg_satisfaction,
    AVG(c.total_cost_credits) as avg_cost,
    (COUNT(CASE WHEN c.status = 'completed' THEN 1 END)::DECIMAL / NULLIF(COUNT(c.id), 0) * 100) as success_rate,
    COUNT(CASE WHEN c.status = 'completed' THEN 1 END) as completed_conversations,
    COUNT(CASE WHEN c.status = 'failed' THEN 1 END) as failed_conversations
FROM calls c
LEFT JOIN agents a ON c.agent_id = a.id
LEFT JOIN conversation_analysis ca ON c.conversation_id = ca.conversation_id
GROUP BY COALESCE(a.id, c.agent_id), COALESCE(a.name, c.agent_id);

-- Recrear channel_performance_summary con SECURITY INVOKER
DROP VIEW IF EXISTS public.channel_performance_summary;
CREATE VIEW public.channel_performance_summary
WITH (security_invoker = true)
AS
SELECT 
    ch.name as channel_name,
    ch.display_name,
    COUNT(cm.total_conversations) as total_conversations,
    SUM(cm.successful_conversations) as successful_conversations,
    SUM(cm.failed_conversations) as failed_conversations,
    AVG(cm.avg_satisfaction_score) as avg_satisfaction,
    CASE 
        WHEN SUM(cm.total_conversations) > 0 
        THEN (SUM(cm.successful_conversations)::DECIMAL / SUM(cm.total_conversations) * 100)
        ELSE 0 
    END as success_rate,
    SUM(cm.total_cost_cents) as total_cost_cents,
    COUNT(DISTINCT cm.agent_id) as active_agents,
    MAX(cm.date) as last_activity_date
FROM channels ch
LEFT JOIN channel_metrics cm ON ch.id = cm.channel_id
GROUP BY ch.id, ch.name, ch.display_name;

-- 2. Habilitar RLS en todas las tablas públicas que no lo tienen
ALTER TABLE public.call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas RLS básicas (permitir acceso a usuarios autenticados)
-- Estas son políticas básicas, se pueden personalizar según los requisitos específicos

-- call_transcripts: acceso a usuarios autenticados
CREATE POLICY "Allow authenticated users to view call transcripts" ON public.call_transcripts
    FOR SELECT TO authenticated USING (true);

-- llm_usage: acceso a usuarios autenticados
CREATE POLICY "Allow authenticated users to view llm usage" ON public.llm_usage
    FOR SELECT TO authenticated USING (true);

-- call_evaluations: acceso a usuarios autenticados
CREATE POLICY "Allow authenticated users to view call evaluations" ON public.call_evaluations
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert call evaluations" ON public.call_evaluations
    FOR INSERT TO authenticated WITH CHECK (true);

-- evaluation_criteria: acceso a usuarios autenticados
CREATE POLICY "Allow authenticated users to view evaluation criteria" ON public.evaluation_criteria
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage evaluation criteria" ON public.evaluation_criteria
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- conversation_evaluations: acceso a usuarios autenticados
CREATE POLICY "Allow authenticated users to view conversation evaluations" ON public.conversation_evaluations
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert conversation evaluations" ON public.conversation_evaluations
    FOR INSERT TO authenticated WITH CHECK (true);

-- audio_segments: acceso a usuarios autenticados
CREATE POLICY "Allow authenticated users to view audio segments" ON public.audio_segments
    FOR SELECT TO authenticated USING (true);

-- agent_tools: acceso a usuarios autenticados
CREATE POLICY "Allow authenticated users to view agent tools" ON public.agent_tools
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage agent tools" ON public.agent_tools
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- tool_executions: acceso a usuarios autenticados
CREATE POLICY "Allow authenticated users to view tool executions" ON public.tool_executions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert tool executions" ON public.tool_executions
    FOR INSERT TO authenticated WITH CHECK (true);

-- webhook_events: acceso a usuarios autenticados
CREATE POLICY "Allow authenticated users to view webhook events" ON public.webhook_events
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert webhook events" ON public.webhook_events
    FOR INSERT TO authenticated WITH CHECK (true);

-- batch_calls: acceso a usuarios autenticados
CREATE POLICY "Allow authenticated users to view batch calls" ON public.batch_calls
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage batch calls" ON public.batch_calls
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- agents: acceso a usuarios autenticados
CREATE POLICY "Allow authenticated users to view agents" ON public.agents
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage agents" ON public.agents
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Añadir comentarios para documentar los cambios
COMMENT ON VIEW public.conversation_summary IS 'Conversation summary view with SECURITY INVOKER for proper user permission enforcement';
COMMENT ON VIEW public.agent_performance IS 'Agent performance metrics view with SECURITY INVOKER for proper user permission enforcement';
COMMENT ON VIEW public.channel_performance_summary IS 'Channel performance summary view with SECURITY INVOKER for proper user permission enforcement';
