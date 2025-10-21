import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { User } from '../interfaces';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, email, name, phone, age, address, role, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching users:', error.message);
            return res.status(500).json({ message: 'Error fetching users', error: error.message });
        }

        res.status(200).json(users);
    } catch (error: any) {
        console.error('Server error in getAllUsers:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

