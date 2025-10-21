export interface User {
    id: string; // auth.users.id
    email: string;
    name: string;
    phone: string;
    age: number;
    address: string;
    role: 'user' | 'admin';
    created_at: string;
}

export interface Appointment {
    id: number;
    user_id: string; // references users.id
    date: string; // ISO date string e.g., 'YYYY-MM-DD'
    time: string; // e.g., '09:00'
    status: 'Booked' | 'Confirmed' | 'Completed' | 'Cancelled';
    created_at: string;
    user_name?: string; // For admin view, populated via join
    user_email?: string; // For admin view, populated via join
}

