import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env' }); // Load .env from backend root

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!; // Using anon key for client-side functionality

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend/.env');
    process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

