import { createClient } from '@supabase/supabase-js';

const supabaseUrl='https://kzcahsqmamxljyyncahm.supabase.co';
const supabaseAnonKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6Y2Foc3FtYW14bGp5eW5jYWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzg0MzksImV4cCI6MjA2ODcxNDQzOX0.KbMUr1GSBYHcbKu-bQ-Vp64VfXNsXIrLifz3ZeVDH44';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);