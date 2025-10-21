import { Request } from 'express';
import { User as SupabaseAuthUser } from '@supabase/supabase-js';

// Extend the Express Request type to include our custom properties
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: 'user' | 'admin';
            };
            supabase?: SupabaseAuthUser | null; // The full Supabase user object if needed
        }
    }
}

