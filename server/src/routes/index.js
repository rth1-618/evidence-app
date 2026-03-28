import express from 'express';
import authRoutes from './authRoutes.js';
import evidenceRoutes from './evidenceRoutes.js';
import userRoutes from './userRoutes.js';
import shelfRoutes from './shelfRoutes.js';

const router = express.Router();

// This adds the prefix /auth to everything in authRoutes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/evidence', evidenceRoutes);
router.use('/shelves', shelfRoutes);

export default router;