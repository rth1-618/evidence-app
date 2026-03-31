import CaseSchema from '../models/CaseSchema.js';
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
    const item = await Evidence.findOne({ evidenceId: req.params.id });
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

    let status = 'pending';

    if (caseId === "" || caseId === "null") {
      caseId = null;
      status = 'unassigned';
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
      submittedByBadge: req.user.badge,
      status,
      submittedDate: new Date().toISOString()
    });

    await newEvidence.save();
    if (caseId && caseId !== "null" && caseId !== "") {
      await CaseSchema.findOneAndUpdate(
        { caseId: caseId },
        { $push: { evidenceIds: newEvidence._id } },
        { returnDocument: 'after' } // Updated here
      );
    }

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

export const getUnassignedEvidence = async (req, res) => {
  const searchTerm = req.query.term || req.query.location;

  let filter = {};

  if (searchTerm) {
    // 1. GLOBAL SEARCH MODE: If there is a term, ignore status/caseId
    // This will find "India" even if it is 'pending' or assigned to another case
    filter = {
      $or: [
        { "locationFound.address": { $regex: searchTerm, $options: 'i' } },
        { "evidenceId": { $regex: searchTerm, $options: 'i' } },
        { "title": { $regex: searchTerm, $options: 'i' } }
      ]
    };
  } else {
    // 2. UNASSIGNED POOL MODE: If no term, show only available items
    filter = {
      $or: [
        { caseId: { $exists: false } },
        { caseId: null },
        { caseId: "" },
        { status: 'unassigned' }
      ]
    };
  }

  // console.log("SEARCH MODE:", searchTerm ? "GLOBAL" : "UNASSIGNED_ONLY");

  const results = await Evidence.find(filter).populate('submittedBy', 'name');

  // console.log("FINAL COUNT:", results.length);
  res.json(results);
};




export const updateEvidenceStatus = async (req, res) => {
  try {
    const { id } = req.params; // Evidence ObjectId
    const { status, caseId } = req.body; // Custom string e.g. "CASE-101"

    const update = { status };

    if (status === 'unassigned') {
      update.caseId = null;
      // Remove Evidence ObjectId from the Case that matches the custom string
      await CaseSchema.findOneAndUpdate(
        { caseId: caseId },
        { [status === 'unassigned' ? '$pull' : '$addToSet']: { evidenceIds: id } },
        { returnDocument: 'after' } // Updated here
      );
    } else {
      update.caseId = caseId;
      // Add Evidence ObjectId to the Case that matches the custom string
      await CaseSchema.findOneAndUpdate(
        { caseId: caseId },
        { $addToSet: { evidenceIds: id } }
      );
    }
    const evidence = await Evidence.findByIdAndUpdate(
      id,
      update,
      { returnDocument: 'after' } // Updated here
    );
    res.status(200).json({ success: true, data: evidence });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
