import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { createClient } from '@supabase/supabase-js';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify the token using Supabase client's auth.getUser()
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            console.error('Supabase auth.getUser error:', error?.message);
            return res.status(401).json({ message: 'Not authorized, token failed or user not found' });
        }

        const authUser = data.user;

        // Create a per-request Supabase client that carries the user's JWT
        // so RLS policies evaluate with this user's identity.
        const supabaseUrl = process.env.SUPABASE_URL!;
        const supabaseAnon = process.env.SUPABASE_ANON_KEY!;
        const authedClient = createClient(supabaseUrl, supabaseAnon, {
            global: { headers: { Authorization: `Bearer ${token}` } },
        });

        // Fetch the user's role from our public.users table; if missing, create with default role 'user'
        let { data: userProfile, error: profileError } = await authedClient
            .from('users')
            .select('id, email, role')
            .eq('id', authUser.id)
            .single();

        if (profileError || !userProfile) {
            console.warn('User profile missing; attempting to create default profile with role=user');
            const insertPayload: any = {
                id: authUser.id,
                email: authUser.email,
                role: 'user',
            };
            const { data: createdProfile, error: insertError } = await authedClient
                .from('users')
                .insert(insertPayload)
                .select('id, email, role')
                .single();

            if (insertError || !createdProfile) {
                console.error('Failed to create default user profile. Check RLS policies on public.users:', insertError?.message);
                return res.status(401).json({ message: 'User profile not found and could not be created. Please contact support.' });
            }
            userProfile = createdProfile as any;
        }

        // Safety: ensure we have a profile
        if (!userProfile) {
            return res.status(401).json({ message: 'User profile could not be loaded' });
        }

        // Ensure role exists; if missing, set to 'user'
        if (!userProfile.role) {
            const { data: updatedProfile, error: updateError } = await authedClient
                .from('users')
                .update({ role: 'user' })
                .eq('id', userProfile.id)
                .select('id, email, role')
                .single();
            if (!updateError && updatedProfile) {
                userProfile = updatedProfile as any;
            }
        }

        req.user = {
            id: userProfile!.id,
            email: userProfile!.email,
            role: userProfile!.role as 'user' | 'admin',
        };

        req.supabase = authUser; // Optionally attach the full Supabase user object

        next();
    } catch (error: any) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export const authorize = (roles: Array<'user' | 'admin'>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Not authorized, user role not found' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Not authorized, role '${req.user.role}' is not allowed to access this resource` });
        }
        next();
    };
};
