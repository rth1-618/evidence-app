import express from 'express';
import { getEvidence, createEvidence } from '../controllers/evidenceController.js';

const router = express.Router();

router.route('/')
  .get(getEvidence)
  .post(createEvidence);

export default router;
