import { z } from 'zod';

export const newAppointmentSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    // Status will default to 'Booked' in DB, so not required here for creation
});

export const updateAppointmentStatusSchema = z.object({
    status: z.enum(
        ['Booked', 'Confirmed', 'Completed', 'Cancelled'],
        { message: "Status must be one of 'Booked', 'Confirmed', 'Completed', 'Cancelled'" }
    ),
});
