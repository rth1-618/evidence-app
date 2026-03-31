import express from 'express';
import { getCases, addCase, getPois, newPOI, verifyEvidence } from '../controllers/caseController.js';
import { protect } from '../middleware/authMiddleware.js'; // You'll make this for JWT
import { authorize } from '../middleware/roleHandler.js';

const router = express.Router();

router.get('/', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), getCases);
router.post('/addcase', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), addCase);
router.post('/addPOI', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), newPOI);
router.get('/pois', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), getPois);
router.post('/verify', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), verifyEvidence);

// router.route('/:id')
//     .get(protect, getCaseById);

// // 2. FO Assignment - "The Fix" for the dropdown problem
// // FOs use this to see ONLY cases they are assigned to
// router.get('/my-assignments', protect, authorize('FIELD_OFFICER'), getMyAssignedCases);

// router.post('/:id/attach-evidence', protect, authorize('INVESTIGATOR'), attachEvidenceToCase);


export default router;