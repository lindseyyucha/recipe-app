import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hcqebjnptjgxiilhbajh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjcWViam5wdGpneGlpbGhiYWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNzAxNzUsImV4cCI6MjAyNTg0NjE3NX0.a-bx7aMAkGA2QjRPa3zoObjV5EoQmnYZraMHlGFIN38';

export const supabase = createClient(supabaseUrl, supabaseKey);