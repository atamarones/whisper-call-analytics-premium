
-- =============================================
-- MIGRACIÓN DE SEGURIDAD: Corregir search_path mutable en funciones
-- =============================================

-- Corregir funciones en el esquema public
ALTER FUNCTION public.unix_to_date(bigint) 
SET search_path = public;

ALTER FUNCTION public.get_clerk_user_id() 
SET search_path = public;

ALTER FUNCTION public.calculate_percentage_change(numeric, numeric) 
SET search_path = public;

ALTER FUNCTION public.calculate_conversation_duration() 
SET search_path = public;

ALTER FUNCTION public.user_has_permission(text, text) 
SET search_path = public;

ALTER FUNCTION public.update_daily_channel_metrics() 
SET search_path = public;

ALTER FUNCTION public.generate_reservation_code() 
SET search_path = public;

ALTER FUNCTION public.update_updated_at_column() 
SET search_path = public;

ALTER FUNCTION public.set_reservation_code() 
SET search_path = public;

-- Corregir funciones en el esquema utils (si existen)
-- Nota: Solo se ejecutarán si las funciones existen
DO $$ 
BEGIN
    -- Verificar y corregir utils.unix_to_date si existe
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'utils' AND p.proname = 'unix_to_date') THEN
        EXECUTE 'ALTER FUNCTION utils.unix_to_date SET search_path = utils, public';
    END IF;
    
    -- Verificar y corregir utils.get_date_range si existe
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'utils' AND p.proname = 'get_date_range') THEN
        EXECUTE 'ALTER FUNCTION utils.get_date_range SET search_path = utils, public';
    END IF;
    
    -- Verificar y corregir utils.calculate_percentage_change si existe
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
               WHERE n.nspname = 'utils' AND p.proname = 'calculate_percentage_change') THEN
        EXECUTE 'ALTER FUNCTION utils.calculate_percentage_change SET search_path = utils, public';
    END IF;
END $$;

-- Añadir comentarios para documentar los cambios de seguridad
COMMENT ON FUNCTION public.unix_to_date(bigint) IS 'Convert unix timestamp to date - search_path fixed for security';
COMMENT ON FUNCTION public.get_clerk_user_id() IS 'Get Clerk user ID from JWT - search_path fixed for security';
COMMENT ON FUNCTION public.calculate_percentage_change(numeric, numeric) IS 'Calculate percentage change - search_path fixed for security';
COMMENT ON FUNCTION public.user_has_permission(text, text) IS 'Check user permissions - search_path fixed for security';
