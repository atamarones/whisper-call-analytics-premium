
-- ==============================================
-- MIGRACIÓN SEGURA CORREGIDA
-- ==============================================

-- Eliminar vistas existentes si existen
DROP VIEW IF EXISTS conversation_summary CASCADE;
DROP VIEW IF EXISTS agent_performance CASCADE;

-- Eliminar triggers existentes antes de modificar las tablas
DROP TRIGGER IF EXISTS calculate_duration_trigger ON calls;
DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
DROP TRIGGER IF EXISTS update_conversation_analysis_updated_at ON conversation_analysis;

-- Eliminar funciones que vamos a recrear
DROP FUNCTION IF EXISTS calculate_conversation_duration();

-- ==============================================
-- RECREAR TABLA DE AGENTES (RESPALDANDO DATOS)
-- ==============================================

-- Crear tabla temporal para respaldar datos de agentes si la tabla existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'agents') THEN
        CREATE TEMP TABLE agents_backup AS SELECT * FROM agents;
        DROP TABLE agents CASCADE;
    END IF;
END $$;

CREATE TABLE agents (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    voice_id VARCHAR(255),
    voice_name VARCHAR(255),
    voice_category VARCHAR(100),
    
    -- Configuración del agente
    conversation_config JSONB,
    platform_settings JSONB,
    
    -- Configuración de LLM
    llm_provider VARCHAR(100),
    llm_model VARCHAR(100),
    llm_temperature DECIMAL(3,2),
    llm_max_tokens INTEGER,
    llm_system_prompt TEXT,
    
    -- Configuración de respuesta
    response_delay_ms INTEGER DEFAULT 0,
    interruption_threshold DECIMAL(3,2),
    turn_detection_mode VARCHAR(50),
    
    -- Configuración de herramientas
    tools_enabled BOOLEAN DEFAULT FALSE,
    tools_config JSONB,
    
    -- Configuración de seguridad
    authentication_enabled BOOLEAN DEFAULT FALSE,
    authentication_config JSONB,
    hipaa_compliance BOOLEAN DEFAULT FALSE,
    pii_redaction BOOLEAN DEFAULT FALSE,
    
    -- Configuración de webhooks
    webhook_url VARCHAR(500),
    webhook_secret VARCHAR(255),
    post_call_analysis_enabled BOOLEAN DEFAULT TRUE,
    
    -- Metadatos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Configuración de límites
    max_conversation_duration_seconds INTEGER DEFAULT 3600,
    max_concurrent_conversations INTEGER DEFAULT 10,
    
    -- Configuración de audio
    audio_format VARCHAR(50) DEFAULT 'pcm_16000',
    voice_stability DECIMAL(3,2) DEFAULT 0.5,
    voice_similarity_boost DECIMAL(3,2) DEFAULT 0.8,
    voice_style DECIMAL(3,2) DEFAULT 0.0,
    use_speaker_boost BOOLEAN DEFAULT TRUE
);

-- Restaurar datos de agentes si existía backup
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'agents_backup') THEN
        INSERT INTO agents (id, name, description, voice_name, llm_provider, llm_model, is_active, created_at, updated_at)
        SELECT id, name, description, voice_name, llm_provider, llm_model, 
               COALESCE(is_active, true), 
               COALESCE(created_at, CURRENT_TIMESTAMP), 
               COALESCE(updated_at, CURRENT_TIMESTAMP)
        FROM agents_backup;
    END IF;
END $$;

-- ==============================================
-- MODIFICAR TABLA CALLS (CONSERVANDO DATOS)
-- ==============================================

-- Agregar nuevas columnas a la tabla calls existente
ALTER TABLE calls ADD COLUMN IF NOT EXISTS status VARCHAR(50);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS client_id VARCHAR(255);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS call_type VARCHAR(50);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS connection_type VARCHAR(50);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS conversation_config JSONB;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS custom_llm_extra_body JSONB;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS connection_id VARCHAR(255);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS first_response_latency_ms INTEGER;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS average_response_latency_ms INTEGER;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS total_processing_time_ms INTEGER;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS audio_received_bytes BIGINT DEFAULT 0;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS audio_sent_bytes BIGINT DEFAULT 0;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS audio_quality_score DECIMAL(3,2);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS full_recording_url VARCHAR(500);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS full_recording_file_path VARCHAR(500);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS full_recording_file_size BIGINT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS full_recording_format VARCHAR(50) DEFAULT 'mp3';
ALTER TABLE calls ADD COLUMN IF NOT EXISTS full_recording_duration_ms INTEGER;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS audio_processing_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE calls ADD COLUMN IF NOT EXISTS audio_waveform_data JSONB;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS audio_transcription_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE calls ADD COLUMN IF NOT EXISTS audio_noise_reduction BOOLEAN DEFAULT FALSE;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS audio_normalized BOOLEAN DEFAULT FALSE;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS llm_cost_credits DECIMAL(10,4) DEFAULT 0;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS tts_cost_credits DECIMAL(10,4) DEFAULT 0;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS stt_cost_credits DECIMAL(10,4) DEFAULT 0;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS error_code VARCHAR(100);
ALTER TABLE calls ADD COLUMN IF NOT EXISTS error_message TEXT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS error_details JSONB;

-- Agregar nuevas columnas temporales para restructuración
ALTER TABLE calls ADD COLUMN IF NOT EXISTS start_time_unix BIGINT;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS start_time TIMESTAMP;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS end_time TIMESTAMP;
ALTER TABLE calls ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;

-- Migrar datos a nuevas columnas
UPDATE calls SET start_time_unix = start_time_unix_secs WHERE start_time_unix IS NULL;
UPDATE calls SET start_time = to_timestamp(start_time_unix_secs) WHERE start_time IS NULL;
UPDATE calls SET duration_seconds = call_duration_secs WHERE duration_seconds IS NULL;

-- Actualizar datos existentes para alinear con nuevas estructuras
UPDATE calls SET status = 'completed' WHERE status IS NULL AND call_successful = 'success';
UPDATE calls SET status = 'failed' WHERE status IS NULL AND call_successful = 'failure';
UPDATE calls SET call_direction = 'outbound' WHERE call_direction IS NULL;
UPDATE calls SET total_cost_credits = cost_cents::DECIMAL / 100.0 WHERE total_cost_credits IS NULL OR total_cost_credits = 0;

-- ==============================================
-- CREAR TABLA DE MENSAJES SOLO SI NO EXISTE
-- ==============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversation_messages') THEN
        CREATE TABLE conversation_messages (
            id SERIAL PRIMARY KEY,
            conversation_id VARCHAR(255) NOT NULL,
            
            -- Información del mensaje
            role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
            content TEXT,
            content_type VARCHAR(50), -- 'text', 'audio', 'tool_call', 'tool_response'
            
            -- Información de timing
            timestamp TIMESTAMP NOT NULL,
            sequence_number INTEGER,
            
            -- Información de audio (si aplica)
            audio_duration_ms INTEGER,
            audio_format VARCHAR(50),
            audio_url VARCHAR(500),
            
            -- Información de herramientas (si aplica)
            tool_name VARCHAR(100),
            tool_parameters JSONB,
            tool_response JSONB,
            
            -- Información de procesamiento
            processing_time_ms INTEGER,
            tokens_used INTEGER,
            
            -- Información de confianza/calidad
            confidence_score DECIMAL(3,2),
            speech_recognition_confidence DECIMAL(3,2),
            
            -- Metadatos
            metadata JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- ==============================================
-- ACTUALIZAR TABLA DE ANÁLISIS POST-LLAMADA
-- ==============================================
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS sentiment_analysis JSONB;
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS emotion_analysis JSONB;
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS topics_discussed JSONB;
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS key_phrases JSONB;
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS action_items JSONB;
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS interruption_count INTEGER DEFAULT 0;
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS dead_air_duration_seconds INTEGER DEFAULT 0;
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS user_satisfaction_indicators JSONB;
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS compliance_score DECIMAL(3,2);
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS policy_violations JSONB;
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS conversion_achieved BOOLEAN DEFAULT FALSE;
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS follow_up_required BOOLEAN DEFAULT FALSE;
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS lead_quality_score DECIMAL(3,2);
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS analysis_type VARCHAR(50);
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS analyzed_by VARCHAR(255);
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS analysis_confidence DECIMAL(3,2);
ALTER TABLE conversation_analysis ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- ==============================================
-- CREAR TABLAS NUEVAS SOLO SI NO EXISTEN
-- ==============================================

-- Tabla de criterios de evaluación
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'evaluation_criteria') THEN
        CREATE TABLE evaluation_criteria (
            id SERIAL PRIMARY KEY,
            agent_id VARCHAR(255) NOT NULL,
            
            -- Información del criterio
            name VARCHAR(255) NOT NULL,
            description TEXT,
            criteria_type VARCHAR(50), -- 'boolean', 'numeric', 'categorical'
            
            -- Configuración del criterio
            evaluation_prompt TEXT,
            success_threshold DECIMAL(5,2),
            weight DECIMAL(3,2) DEFAULT 1.0,
            
            -- Estado
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- Tabla de evaluaciones por conversación
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversation_evaluations') THEN
        CREATE TABLE conversation_evaluations (
            id SERIAL PRIMARY KEY,
            conversation_id VARCHAR(255) NOT NULL,
            criteria_id INTEGER NOT NULL REFERENCES evaluation_criteria(id),
            
            -- Resultado de la evaluación
            score DECIMAL(5,2),
            passed BOOLEAN,
            evaluation_result JSONB,
            
            -- Información de la evaluación
            evaluation_method VARCHAR(50), -- 'automatic', 'manual'
            evaluated_by VARCHAR(255),
            evaluation_notes TEXT,
            
            -- Timestamps
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- Tabla de herramientas/tools
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'agent_tools') THEN
        CREATE TABLE agent_tools (
            id SERIAL PRIMARY KEY,
            agent_id VARCHAR(255) NOT NULL,
            
            -- Información de la herramienta
            tool_name VARCHAR(255) NOT NULL,
            tool_description TEXT,
            tool_type VARCHAR(100), -- 'function', 'webhook', 'api'
            
            -- Configuración de la herramienta
            tool_config JSONB NOT NULL,
            input_schema JSONB,
            output_schema JSONB,
            
            -- Configuración de ejecución
            timeout_seconds INTEGER DEFAULT 30,
            retry_attempts INTEGER DEFAULT 3,
            
            -- Estado
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- Tabla de segmentos de audio
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'audio_segments') THEN
        CREATE TABLE audio_segments (
            id SERIAL PRIMARY KEY,
            conversation_id VARCHAR(255) NOT NULL,
            message_id INTEGER REFERENCES conversation_messages(id),
            
            -- Información del segmento
            segment_type VARCHAR(50), -- 'user_speech', 'agent_speech', 'silence', 'noise'
            start_time_ms INTEGER NOT NULL,
            end_time_ms INTEGER NOT NULL,
            duration_ms INTEGER NOT NULL,
            
            -- Archivo de audio del segmento
            audio_file_url VARCHAR(500),
            audio_file_path VARCHAR(500),
            audio_file_size BIGINT,
            audio_format VARCHAR(50) DEFAULT 'mp3',
            
            -- Información de procesamiento
            transcription TEXT,
            transcription_confidence DECIMAL(3,2),
            language_detected VARCHAR(10),
            
            -- Análisis de audio
            volume_level DECIMAL(5,2),
            noise_level DECIMAL(5,2),
            speech_clarity_score DECIMAL(3,2),
            
            -- Metadatos
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- Tabla de ejecuciones de herramientas
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tool_executions') THEN
        CREATE TABLE tool_executions (
            id SERIAL PRIMARY KEY,
            conversation_id VARCHAR(255) NOT NULL,
            tool_id INTEGER NOT NULL REFERENCES agent_tools(id),
            message_id INTEGER REFERENCES conversation_messages(id),
            
            -- Información de la ejecución
            execution_status VARCHAR(50), -- 'pending', 'success', 'error', 'timeout'
            input_parameters JSONB,
            output_result JSONB,
            
            -- Métricas de rendimiento
            execution_time_ms INTEGER,
            retry_count INTEGER DEFAULT 0,
            
            -- Información de errores
            error_code VARCHAR(100),
            error_message TEXT,
            error_details JSONB,
            
            -- Timestamps
            started_at TIMESTAMP NOT NULL,
            completed_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- Tabla de webhooks
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'webhook_events') THEN
        CREATE TABLE webhook_events (
            id SERIAL PRIMARY KEY,
            conversation_id VARCHAR(255),
            agent_id VARCHAR(255) NOT NULL,
            
            -- Información del webhook
            event_type VARCHAR(100) NOT NULL,
            payload JSONB NOT NULL,
            
            -- Información de entrega
            delivery_status VARCHAR(50), -- 'pending', 'delivered', 'failed', 'retrying'
            delivery_attempts INTEGER DEFAULT 0,
            max_delivery_attempts INTEGER DEFAULT 5,
            
            -- Respuesta del webhook
            response_status_code INTEGER,
            response_body TEXT,
            response_time_ms INTEGER,
            
            -- Información de errores
            error_message TEXT,
            next_retry_at TIMESTAMP,
            
            -- Timestamps
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            delivered_at TIMESTAMP
        );
    END IF;
END $$;

-- Tabla de llamadas batch
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'batch_calls') THEN
        CREATE TABLE batch_calls (
            id VARCHAR(255) PRIMARY KEY,
            agent_id VARCHAR(255) NOT NULL,
            
            -- Información del batch
            batch_name VARCHAR(255) NOT NULL,
            batch_description TEXT,
            total_calls INTEGER NOT NULL,
            completed_calls INTEGER DEFAULT 0,
            successful_calls INTEGER DEFAULT 0,
            failed_calls INTEGER DEFAULT 0,
            
            -- Estado del batch
            status VARCHAR(50) NOT NULL, -- 'pending', 'running', 'completed', 'failed', 'cancelled'
            
            -- Configuración del batch
            call_list JSONB NOT NULL,
            call_config JSONB,
            schedule_time TIMESTAMP,
            
            -- Información de progreso
            started_at TIMESTAMP,
            completed_at TIMESTAMP,
            estimated_completion TIMESTAMP,
            
            -- Metadatos
            created_by VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    END IF;
END $$;

-- ==============================================
-- ACTUALIZAR TABLA DE MÉTRICAS DIARIAS
-- ==============================================
ALTER TABLE daily_metrics ADD COLUMN IF NOT EXISTS total_messages INTEGER DEFAULT 0;
ALTER TABLE daily_metrics ADD COLUMN IF NOT EXISTS average_response_latency_ms INTEGER;
ALTER TABLE daily_metrics ADD COLUMN IF NOT EXISTS average_cost_per_conversation DECIMAL(8,4);
ALTER TABLE daily_metrics ADD COLUMN IF NOT EXISTS completion_rate DECIMAL(5,2);
ALTER TABLE daily_metrics ADD COLUMN IF NOT EXISTS error_rate DECIMAL(5,2);
ALTER TABLE daily_metrics ADD COLUMN IF NOT EXISTS interruption_rate DECIMAL(5,2);
ALTER TABLE daily_metrics ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- ==============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ==============================================

-- Índices para conversaciones
CREATE INDEX IF NOT EXISTS idx_calls_agent_id ON calls(agent_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_client_id ON calls(client_id);
CREATE INDEX IF NOT EXISTS idx_calls_call_direction ON calls(call_direction);

-- Índices para mensajes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON conversation_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_role ON conversation_messages(role);

-- Índices para análisis
CREATE INDEX IF NOT EXISTS idx_analysis_conversation_id ON conversation_analysis(conversation_id);
CREATE INDEX IF NOT EXISTS idx_analysis_created_at ON conversation_analysis(created_at);

-- Índices para evaluaciones
CREATE INDEX IF NOT EXISTS idx_evaluations_conversation_id ON conversation_evaluations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_criteria_id ON conversation_evaluations(criteria_id);

-- Índices para herramientas
CREATE INDEX IF NOT EXISTS idx_tool_executions_conversation_id ON tool_executions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_tool_executions_tool_id ON tool_executions(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_executions_status ON tool_executions(execution_status);

-- Índices para webhooks
CREATE INDEX IF NOT EXISTS idx_webhook_events_conversation_id ON webhook_events(conversation_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(delivery_status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at);

-- Índices para métricas
CREATE INDEX IF NOT EXISTS idx_daily_metrics_date_agent ON daily_metrics(date, agent_id);

-- Índices para segmentos de audio
CREATE INDEX IF NOT EXISTS idx_audio_segments_conversation_id ON audio_segments(conversation_id);
CREATE INDEX IF NOT EXISTS idx_audio_segments_start_time ON audio_segments(start_time_ms);
CREATE INDEX IF NOT EXISTS idx_audio_segments_type ON audio_segments(segment_type);

-- ==============================================
-- TRIGGERS Y FUNCIONES
-- ==============================================

-- Función para calcular duración automáticamente
CREATE OR REPLACE FUNCTION calculate_conversation_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para calcular duración
CREATE TRIGGER calculate_duration_trigger BEFORE INSERT OR UPDATE ON calls
    FOR EACH ROW EXECUTE FUNCTION calculate_conversation_duration();

-- Triggers para actualizar updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_analysis_updated_at BEFORE UPDATE ON conversation_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- VISTAS ÚTILES
-- ==============================================

-- Vista para resumen de conversaciones
CREATE VIEW conversation_summary AS
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

-- Vista para métricas de agentes
CREATE VIEW agent_performance AS
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

-- ==============================================
-- INSERTAR DATOS DE EJEMPLO
-- ==============================================

-- Insertar agentes de ejemplo si no existen
INSERT INTO agents (id, name, description, voice_name, llm_provider, llm_model, is_active) 
VALUES 
('agent_1', 'Agente de Ventas', 'Especializado en llamadas de ventas y seguimiento de leads', 'Professional Sales Voice', 'openai', 'gpt-4', true),
('agent_2', 'Agente de Soporte', 'Manejo de consultas de soporte técnico y atención al cliente', 'Friendly Support Voice', 'openai', 'gpt-3.5-turbo', true),
('agent_3', 'Agente de Citas', 'Programación y confirmación de citas médicas', 'Professional Assistant Voice', 'anthropic', 'claude-3', true)
ON CONFLICT (id) DO NOTHING;
