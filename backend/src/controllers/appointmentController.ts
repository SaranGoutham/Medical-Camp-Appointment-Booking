import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { newAppointmentSchema, updateAppointmentStatusSchema } from '../utils/validation';
import { Appointment } from '../interfaces';

export const createAppointment = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const validatedBody = newAppointmentSchema.parse(req.body);

        const { date, time } = validatedBody;
        const userId = req.user!.id; // Assured by `protect` middleware

        // Check for existing appointment at the same time for the same user
        const { data: existingAppointments, error: checkError } = await supabase
            .from('appointments')
            .select('id')
            .eq('user_id', userId)
            .eq('date', date)
            .eq('time', time)
            .neq('status', 'Cancelled'); // Exclude cancelled appointments

        if (checkError) throw checkError;

        if (existingAppointments && existingAppointments.length > 0) {
            return res.status(409).json({ message: 'You already have an active appointment at this date and time.' });
        }

        const { data: appointment, error } = await supabase
            .from('appointments')
            .insert({
                user_id: userId,
                date: date,
                time: time,
                status: 'Booked', // Default status
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating appointment:', error.message);
            return res.status(500).json({ message: 'Error creating appointment', error: error.message });
        }

        res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        console.error('Server error in createAppointment:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserAppointments = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id; // Assured by `protect` middleware

        const { data: appointments, error } = await supabase
            .from('appointments')
            .select('*') // RLS will ensure only user's own appointments are returned
            .eq('user_id', userId) // Explicitly filter, though RLS should handle it
            .order('date', { ascending: true })
            .order('time', { ascending: true });

        if (error) {
            console.error('Error fetching user appointments:', error.message);
            return res.status(500).json({ message: 'Error fetching appointments', error: error.message });
        }

        res.status(200).json(appointments);
    } catch (error: any) {
        console.error('Server error in getUserAppointments:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllAppointments = async (req: Request, res: Response) => {
    try {
        // Admin only, verified by `authorize(['admin'])` middleware
        const { data: appointments, error } = await supabase
            .from('appointments')
            .select(`
        *,
        users (name, email)
      `)
            .order('date', { ascending: true })
            .order('time', { ascending: true });

        if (error) {
            console.error('Error fetching all appointments:', error.message);
            return res.status(500).json({ message: 'Error fetching appointments', error: error.message });
        }

        // Flatten data for easier frontend consumption
        const formattedAppointments = appointments.map(appt => ({
            ...appt,
            user_name: (appt.users as any)?.name,
            user_email: (appt.users as any)?.email,
            users: undefined, // Remove nested users object
        }));

        res.status(200).json(formattedAppointments);
    } catch (error: any) {
        console.error('Server error in getAllAppointments:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validatedBody = updateAppointmentStatusSchema.parse(req.body);
        const { status } = validatedBody;

        const { data: updatedAppointment, error } = await supabase
            .from('appointments')
            .update({ status: status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating appointment status:', error.message);
            return res.status(500).json({ message: 'Error updating appointment status', error: error.message });
        }

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment status updated successfully', appointment: updatedAppointment });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        console.error('Server error in updateAppointmentStatus:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

