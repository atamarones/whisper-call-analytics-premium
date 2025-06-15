
-- First, let's drop the existing view if it exists
DROP VIEW IF EXISTS public.daily_call_metrics;

-- Recreate the view with SECURITY INVOKER (which is the default and safer option)
CREATE VIEW public.daily_call_metrics
WITH (security_invoker = true)
AS
SELECT 
    DATE(COALESCE(c.start_time, to_timestamp(c.start_time_unix_secs))) as call_date,
    COUNT(*) as total_calls,
    SUM(COALESCE(c.duration_seconds, c.call_duration_secs)) as total_duration_secs,
    AVG(COALESCE(c.duration_seconds, c.call_duration_secs)) as avg_duration_secs,
    SUM(c.cost_cents) as total_cost_cents,
    AVG(c.cost_cents) as avg_cost_cents
FROM calls c
WHERE 
    COALESCE(c.start_time, to_timestamp(c.start_time_unix_secs)) IS NOT NULL
GROUP BY DATE(COALESCE(c.start_time, to_timestamp(c.start_time_unix_secs)))
ORDER BY call_date DESC;

-- Add a comment to document the security context
COMMENT ON VIEW public.daily_call_metrics IS 'Daily aggregated call metrics with SECURITY INVOKER to enforce querying user permissions';
