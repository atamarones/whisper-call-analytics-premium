// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iwtvftrwjhlvtzeqpihx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3dHZmdHJ3amhsdnR6ZXFwaWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0OTUxNjgsImV4cCI6MjA2NDA3MTE2OH0.NTD1E7UTsIFaU9Ul5v9HnqF4aQrBUj_doXMGEbQ3Oa0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);