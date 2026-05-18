import express from 'express';
import { createLead, getLeads, getLeadById, updateLead, deleteLead, exportLeads } from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/')
    .post(protect, createLead)
    .get(protect, getLeads);
router.get('/export', protect, exportLeads);
router.route('/:id')
    .get(protect, getLeadById)
    .put(protect, updateLead)
    .delete(protect, authorize('admin'), deleteLead);
export default router;
