import mongoose from 'mongoose';
import { time } from 'node:console';
// Schema for Persons of Interest (matches your interface)
export const POISchema = new mongoose.Schema({
  name: String,
  dob: String,
  role: { type: String, enum: ['Suspect', 'Witness', 'Victim', 'Associate', 'Other'] },
  statement: String,
  contact: String,
  caseId: String,
  address: String,
  investigatorId: String,
}, {
  timestamps: true
});
export default mongoose.model('POI', POISchema);