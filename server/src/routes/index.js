import express from 'express';
import evidenceRoutes from './evidenceRoutes.js';
// import caseRoutes from './caseRoutes.js';
// import userRoutes from './userRoutes.js'; 

const router = express.Router();

// Register all modules here
router.use('/evidence', evidenceRoutes);
router.use('/cases', caseRoutes);

export default router;
