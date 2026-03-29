import express from 'express';
import { getCases, addCase, getPois, newPOI} from '../controllers/caseController.js';
import { protect } from '../middleware/authMiddleware.js'; // You'll make this for JWT
import { authorize } from '../middleware/roleHandler.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();

router.get('/', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'),getCases);  
router.post('/addcase', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), addCase);
router.post('/addPOI', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), newPOI);
router.get('/pois', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), getPois); // Get case by ID

export default router;