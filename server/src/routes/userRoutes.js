import express from 'express';
import { checkBadge, createUser, getUsers, searchFieldOfficers, updateUserStatus } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleHandler.js';
const router = express.Router();

// ONLY Evidence Managers can create new users
router.get('/all', protect, authorize('EVIDENCE_MANAGER'), getUsers);
router.get('/check-badge', protect, authorize('EVIDENCE_MANAGER'), checkBadge);
router.post('/create', protect, authorize('EVIDENCE_MANAGER'), createUser);

// Search for FOs by name/badge - Used in "Create Case" modal
router.get('/search-officer', protect, authorize('INVESTIGATOR', 'EVIDENCE_MANAGER'), searchFieldOfficers);

router.put('/status', protect, authorize('EVIDENCE_MANAGER'), updateUserStatus);

export default router;
