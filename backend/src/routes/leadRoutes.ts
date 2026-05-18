import express from 'express';
import { 
  createLead, 
  getLeads, 
  getLeadById, 
  updateLead, 
  deleteLead,
  exportLeadsCSV 
} from '../controllers/leadController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createLead)
  .get(protect, getLeads);

router.get('/export', protect, exportLeadsCSV);

router.route('/:id')
  .get(protect, getLeadById)
  .put(protect, updateLead)
  .delete(protect, admin, deleteLead); // Only admin can delete

export default router;
