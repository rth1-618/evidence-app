//shelRotes.js
//routes/shelfRoutes.js
import express from 'express';
import { getShelves, addShelf, uploadStatus, linkEvidenceToShelf, getShelfById } from '../controllers/shelfController.js';
import { protect } from '../middleware/authMiddleware.js'; // You'll make this for JWT
import { authorize } from '../middleware/roleHandler.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', protect, authorize('EVIDENCE_MANAGER', 'CUSTODIAN'), getShelves);
router.post('/addshelf', protect, authorize('EVIDENCE_MANAGER'), addShelf);
router.post('/changeStatus', protect, authorize('EVIDENCE_MANAGER'), uploadStatus);

router.get('/:id', protect, authorize('EVIDENCE_MANAGER', 'CUSTODIAN'), getShelfById);
router.post('/link-storage', protect, authorize('CUSTODIAN'), linkEvidenceToShelf);




export default router;