import Evidence from '../models/EvidenceSchema.js';

// @desc    Get all evidence
// @route   GET /api/evidence
export const getAllEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: evidence.length, data: evidence });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEvidenceById = async (req, res) => {
  try {
    const item = await Evidence.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
