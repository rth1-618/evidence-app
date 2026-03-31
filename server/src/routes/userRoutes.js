import express from 'express';
import { createUser, getUsers, searchFieldOfficers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleHandler.js';
const router = express.Router();

// ONLY Evidence Managers can create new users
router.get('/all', protect, authorize('EVIDENCE_MANAGER'), getUsers);
router.post('/create', protect, authorize('EVIDENCE_MANAGER'), createUser);

// Search for FOs by name/badge - Used in "Create Case" modal
router.get('/search-officer', protect, authorize('INVESTIGATOR', 'EVIDENCE_MANAGER'), searchFieldOfficers);

export default router;
