-- Update RLS policy for calls table to allow public read access for metrics
CREATE POLICY "Allow public read access to calls for metrics" 
ON calls FOR SELECT 
USING (true);