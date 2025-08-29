-- Update RLS policy for agents table to allow public read access
DROP POLICY IF EXISTS "Allow authenticated users to view agents" ON agents;

-- Create a more permissive policy for viewing agents
CREATE POLICY "Allow public read access to active agents" 
ON agents FOR SELECT 
USING (is_active = true);