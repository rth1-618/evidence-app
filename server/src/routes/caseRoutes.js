import express from 'express';
import { getCases, addCase, getPois, addPOI, verifyEvidence, getMyAssignedCases, getCaseCategories, getCaseById, updateCase, assignOfficers } from '../controllers/caseController.js';
import { protect } from '../middleware/authMiddleware.js'; // You'll make this for JWT
import { authorize } from '../middleware/roleHandler.js';

const router = express.Router();

router.get('/', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), getCases);
router.post('/addcase', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), addCase);
router.post('/addPOI', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), addPOI);
router.get('/pois', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), getPois);
router.post('/verify', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), verifyEvidence);
router.get('/my-assigned', protect, authorize('FIELD_OFFICER'), getMyAssignedCases);
router.get('/categories', protect, authorize('EVIDENCE_MANAGER', 'INVESTIGATOR'), getCaseCategories);

router.route('/:id')
    .get(protect, getCaseById)
    .put(protect, authorize('INVESTIGATOR'), updateCase);

router.put('/:id/officers', protect, authorize('INVESTIGATOR'), assignOfficers);


// router.post('/:id/attach-evidence', protect, authorize('INVESTIGATOR'), attachEvidenceToCase);


export default router;