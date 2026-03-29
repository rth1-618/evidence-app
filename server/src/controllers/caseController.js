import { timeStamp } from 'node:console';
import Case from '../models/CaseSchema.js';
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
// create a new case
export const addCase = async (req, res) => {
  try {
    const {
      caseId,
      title,
      types,
      status,
      investigatorId
    } = req.body;

    if (!caseId || !title) {
      return res.status(400).json({
        message: "caseId and title are required"
      });
    }

    const newCase = await Case.create({
      caseId,
      title,
      types,
      status,
      investigatorId
    });

    res.status(201).json({
      success: true,
      data: newCase
    });

  } catch (error) {
    console.error("ADD CASE ERROR:", error); 
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};