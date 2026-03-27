import express from 'express';
import * as controller from '../controllers/evidenceController.js';
import { protect } from '../middleware/authMiddleware.js'; // You'll make this for JWT
import { authorize } from '../middleware/roleHandler.js';
import { submitEvidence } from '../controllers/evidenceController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(protect, controller.getAllEvidence)
  .post(protect, authorize('EVIDENCE_MANAGER', 'FIELD_OFFICER'), controller.createEvidence);

router.route('/:id')
  .get(protect, controller.getEvidenceById)
// .put(protect, authorize('EVIDENCE_MANAGER'), controller.updateEvidence)
// .delete(protect, authorize('EVIDENCE_MANAGER'), controller.deleteEvidence);


// Only Field Officers (and maybe others) can submit evidence
router.post(
  '/submit',
  protect,
  authorize('FIELD_OFFICER'),
  upload.fields([
    { name: 'img', maxCount: 5 },
    { name: 'voiceNote', maxCount: 2 },
    { name: 'video', maxCount: 1 }
  ]),
  submitEvidence
);


export default router;
