import express from 'express';
import { createUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleHandler.js';

const router = express.Router();

// ONLY Evidence Managers can create new users
router.post('/create', protect, authorize('EVIDENCE_MANAGER'), createUser);

export default router;
