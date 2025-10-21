import { Router } from 'express';
import {
    createAppointment,
    getUserAppointments,
    getAllAppointments,
    updateAppointmentStatus
} from '../controllers/appointmentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// User routes
router.post('/', protect, authorize(['user']), createAppointment); // Create an appointment
router.get('/my', protect, authorize(['user']), getUserAppointments); // Get user's own appointments

// Admin routes
router.get('/', protect, authorize(['admin']), getAllAppointments); // Get all appointments for admin
router.put('/:id/status', protect, authorize(['admin']), updateAppointmentStatus); // Update appointment status for admin

export default router;

