import express from 'express';
import { getCases, addCase} from '../controllers/caseController.js';
import { protect } from '../middleware/authMiddleware.js'; // You'll make this for JWT
import { authorize } from '../middleware/roleHandler.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();

router.get('/', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'),getCases);  
router.post('/addcase', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), addCase);

export default router;