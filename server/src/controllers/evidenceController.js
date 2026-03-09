import Evidence from '../models/EvidenceSchema.js';

// @desc    Get all evidence
// @route   GET /api/evidence
export const getEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.find();
    res.json(evidence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new evidence
// @route   POST /api/evidence
export const createEvidence = async (req, res) => {
  try {
    const newEvidence = await Evidence.create(req.body);
    res.status(201).json(newEvidence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
