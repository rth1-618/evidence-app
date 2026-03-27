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

export const getMyEvidences = async (req, res) => {
  try {
    // Filter by the ID of the user from the JWT (protect middleware)
    const evidence = await Evidence.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: evidence });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

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


export const submitEvidence = async (req, res) => {
  try {
    // 1. Get text data from body
    // NOTE: Complex objects like locationFound must be JSON.parse'd 
    // because FormData sends everything as strings.

    const { title, type, caseId, description, locationFound } = req.body;

    // 2. Parse the stringified JSON from Postman
    let parsedLocation;
    if (locationFound) {
      parsedLocation = JSON.parse(locationFound);
    }
    // console.log("parsedLocation: ", parsedLocation)

    // 2. Helper to grab Cloudinary URLs from req.files
    const getUrls = (field) => req.files[field] ? req.files[field].map(f => f.path) : [];

    //  Find the latest evidence to generate the next ID
    const lastEvidence = await Evidence.findOne().sort({ createdAt: -1 });
    let nextId = "EV-0001";

    if (lastEvidence && lastEvidence.evidenceId) {
      // Extract number from "EV-0001" -> 1
      const lastIdNum = parseInt(lastEvidence.evidenceId.split('-')[1]);
      // Increment and pad with leading zeros -> "EV-0002"
      nextId = `EV-${String(lastIdNum + 1).padStart(4, '0')}`;
    }

    // 3. Create the document
    const newEvidence = new Evidence({
      title,
      description,
      type,
      evidenceId: nextId,
      caseId,
      locationFound: parsedLocation ? parsedLocation : undefined,
      img: getUrls('img'),
      voiceNote: getUrls('voiceNote'),
      video: getUrls('video'),
      submittedBy: req.user._id, // From your 'protect' middleware
      status: 'pending',
      submittedDate: new Date().toISOString()
    });

    await newEvidence.save();

    res.status(201).json({
      success: true,
      message: 'Evidence submitted successfully',
      data: newEvidence
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
};
