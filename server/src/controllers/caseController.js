import { timeStamp } from 'node:console';
import Case from '../models/CaseSchema.js';
import POI from '../models/poiSchema.js';
import Evidence from '../models/EvidenceSchema.js';
// get all cases
export const getCases = async (req, res) => {
  try {
    const investigatorId = req.query.investigatorId;

    const cases = await Case.find({
      investigatorId: investigatorId
    });

    res.status(200).json({
      success: true,
      data: cases
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    // We MUST populate these fields to get the actual objects, not just IDs
    const caseData = await Case.findById(id)
      .populate('assignedOfficers', 'name badge email')
      .populate('evidenceIds')
      .populate('poiIds'); // Ensure this matches your Schema field name

    if (!caseData) {
      return res.status(404).json({ success: false, message: "Case not found" });
    }

    res.status(200).json({ success: true, data: caseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// create a new case
export const addCase = async (req, res) => {
  try {
    const { caseId, title, types, status, investigatorId, assignedOfficers } = req.body;

    if (!caseId || !title || !investigatorId) {
      return res.status(400).json({ message: "caseId, title, and investigatorId are required" });
    }

    const newCase = await Case.create({
      caseId,
      title,
      types,
      status,
      investigatorId, // Must be a valid MongoDB _id string
      assignedOfficers // Array of ObjectIds from your search dropdown
    });

    res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    console.error("ADD CASE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// get all the poi of a case
export const getPois = async (req, res) => {
  try {
    const investigatorId = req.query.investigatorId;
    const caseId = req.query.caseId;

    const pois = await POI.find({
      investigatorId: investigatorId,
      caseId: caseId
    });
    res.status(200).json({
      success: true,
      data: pois
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//new case with poi
export const addPOI = async (req, res) => {
  try {
    const {
      name,
      dob,
      role,
      contact,
      address, // Added from your frontend form
      caseId, // This is the MongoDB _id of the case
      investigatorId
    } = req.body;

    if (!name || !dob || !caseId) {
      return res.status(400).json({
        success: false,
        message: "Name, date of birth, and Case ID are required"
      });
    }

    // 1. Create the POI document
    const newPOI = await POI.create({
      name,
      dob,
      role,
      contact,
      address,
      caseId,
      investigatorId
    });

    // 2. ATTACH TO CASE: Push the new POI _id into the Case's poiIds array
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $push: { poiIds: newPOI._id } },
      { new: true }
    );

    if (!updatedCase) {
      // Cleanup: If case doesn't exist, delete the orphaned POI
      await POI.findByIdAndDelete(newPOI._id);
      return res.status(404).json({
        success: false,
        message: "Target case not found. Subject registration aborted."
      });
    }

    res.status(201).json({
      success: true,
      data: newPOI
    });

  } catch (error) {
    console.error("ADD POI ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//update evidence status
// Link multiple evidence items to a case string
export const verifyEvidence = async (req, res) => {
  try {
    const { evidenceIds, caseId } = req.body; // evidenceIds: ["_id1", "_id2"], caseId: "CASE-101"

    // 1. Bulk update Evidence status and link to the custom Case String
    await Evidence.updateMany(
      { _id: { $in: evidenceIds } },
      { $set: { status: 'active', caseId: caseId } }
    );

    // 2. Update the Case document's evidence array using the ObjectIds
    const updatedCase = await Case.findOneAndUpdate(
      { caseId: caseId },
      { $addToSet: { evidenceIds: { $each: evidenceIds } } },
      { returnDocument: 'after' }
    ).populate('evidenceIds');

    res.status(200).json({ success: true, data: updatedCase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMyAssignedCases = async (req, res) => {
  try {
    // req.user._id is populated by your 'protect' middleware
    const cases = await Case.find({
      assignedOfficers: req.user._id,
      // status: 'open' 
    }).select('title caseId _id'); // Only send necessary fields

    res.status(200).json({ success: true, data: cases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCaseCategories = async (req, res) => {
  // These should match your Mongoose enum exactly
  const caseTypes = ['Burglary', 'Theft', 'Fraud', 'Assault', 'Homicide', 'Other'];

  res.status(200).json({
    success: true,
    data: { types: caseTypes }
  });
};

export const updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCase = await Case.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: 'after' } // Updated here
    );

    res.status(200).json({ success: true, data: updatedCase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const assignOfficers = async (req, res) => {
  try {
    const { id } = req.params; // Case _id
    const { officerIds } = req.body; // Array of User ObjectIds

    const updatedCase = await Case.findByIdAndUpdate(
      id,
      { $set: { assignedOfficers: officerIds } },
      { new: true }
    ).populate('assignedOfficers', 'name badge email');

    res.status(200).json({ success: true, data: updatedCase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};